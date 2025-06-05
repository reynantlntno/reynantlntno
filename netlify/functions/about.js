const { db } = require('./lib/db')
const { utils } = require('./lib/utils')
const { validation } = require('./lib/validation')
const { rateLimit } = require('./lib/rate-limit')
const { auth } = require('./lib/auth')

exports.handler = async (event, context) => {
  // Handle CORS preflight
  const corsResponse = utils.handleCORS(event)
  if (corsResponse) return corsResponse

  // Rate limiting
  const rateLimitResult = rateLimit.middleware(100, 60000)(event)
  if (!rateLimitResult.allowed) return rateLimitResult

  const startTime = Date.now()
  
  try {
    const method = event.httpMethod
    const path = event.path.replace('/.netlify/functions/about', '') || '/'
    const queryParams = utils.getQueryParams(event)
    
    let response
    
    switch (method) {
      case 'GET':
        if (path === '/content' || path === '/content/') {
          // Public endpoint - get all content grouped by type
          response = await getContent(queryParams)
        } else if (path.match(/^\/content\/[a-zA-Z0-9_-]+$/)) {
          // Public endpoint - get content by specific type
          const type = path.split('/')[2]
          response = await getContentByType(type)
        } else if (path === '/skills' || path === '/skills/') {
          // Public endpoint - get skills with optional filtering
          response = await getSkills(queryParams)
        } else if (path.match(/^\/skills\/[a-zA-Z0-9_-]+$/)) {
          // Public endpoint - get skills by category
          const category = path.split('/')[2]
          response = await getSkillsByCategory(category)
        } else {
          response = utils.errorResponse('Endpoint not found', 404)
        }
        break

      case 'POST':
        // Admin endpoint - requires authentication
        const authResultPost = await auth.verifyMasterApiKey(event)
        if (!authResultPost.valid) {
          return utils.errorResponse(authResultPost.error, 401)
        }
        
        if (path === '/content' || path === '/content/') {
          response = await createContent(utils.parseRequestBody(event))
        } else if (path === '/skills' || path === '/skills/') {
          response = await createSkill(utils.parseRequestBody(event))
        } else {
          response = utils.errorResponse('Endpoint not found', 404)
        }
        break

      case 'PUT':
        // Admin endpoint - requires authentication
        const authResultPut = await auth.verifyMasterApiKey(event)
        if (!authResultPut.valid) {
          return utils.errorResponse(authResultPut.error, 401)
        }
        
        if (path.match(/^\/content\/\d+$/)) {
          const contentId = path.split('/')[2]
          response = await updateContent(contentId, utils.parseRequestBody(event))
        } else if (path.match(/^\/skills\/\d+$/)) {
          const skillId = path.split('/')[2]
          response = await updateSkill(skillId, utils.parseRequestBody(event))
        } else {
          response = utils.errorResponse('Endpoint not found', 404)
        }
        break

      case 'DELETE':
        // Admin endpoint - requires authentication
        const authResultDelete = await auth.verifyMasterApiKey(event)
        if (!authResultDelete.valid) {
          return utils.errorResponse(authResultDelete.error, 401)
        }
        
        if (path.match(/^\/content\/\d+$/)) {
          const contentId = path.split('/')[2]
          response = await deleteContent(contentId)
        } else if (path.match(/^\/skills\/\d+$/)) {
          const skillId = path.split('/')[2]
          response = await deleteSkill(skillId)
        } else {
          response = utils.errorResponse('Endpoint not found', 404)
        }
        break

      default:
        response = utils.errorResponse(`Method ${method} not allowed`, 405)
    }
    
    // Add rate limit headers
    if (rateLimitResult.headers) {
      Object.assign(response.headers, rateLimitResult.headers)
    }
    
    const endTime = Date.now()
    console.log(`About function executed in ${endTime - startTime}ms`)
    
    return response
    
  } catch (error) {
    console.error('About function error:', error)
    return utils.errorResponse('Internal server error', 500)
  }
}

async function getContent(params) {
  try {
    const { type } = params
    
    let whereClause = ''
    let queryParams = []
    
    if (type) {
      whereClause = 'WHERE type = ?'
      queryParams = [type]
    }
    
    const query = `
      SELECT id, type, title, content, format, created_at, updated_at
      FROM t_content 
      ${whereClause}
      ORDER BY type, created_at DESC
    `
    
    const content = await db.query(query, queryParams)
    
    // Group content by type for easier frontend consumption
    const groupedContent = {}
    content.forEach(item => {
      let parsedContent = item.content
      
      // Parse JSON content if format is json
      if (item.format === 'json') {
        try {
          parsedContent = JSON.parse(item.content)
        } catch (error) {
          console.warn('Failed to parse JSON content for item:', item.id)
        }
      }
      
      if (!groupedContent[item.type]) {
        groupedContent[item.type] = {
          id: item.id,
          type: item.type,
          title: item.title,
          content: parsedContent,
          format: item.format,
          created_at: item.created_at,
          updated_at: item.updated_at
        }
      }
    })
    
    return utils.successResponse(groupedContent)
    
  } catch (error) {
    console.error('Error fetching content:', error)
    return utils.errorResponse('Failed to fetch content', 500)
  }
}

async function getContentByType(type) {
  try {
    if (!type) {
      return utils.errorResponse('Content type is required', 400)
    }
    
    const query = `
      SELECT id, type, title, content, format, created_at, updated_at
      FROM t_content 
      WHERE type = ?
      ORDER BY created_at DESC
      LIMIT 1
    `
    
    const content = await db.queryOne(query, [type])
    
    if (!content) {
      return utils.errorResponse('Content not found', 404)
    }
    
    // Parse content based on format
    let parsedContent = content.content
    
    if (content.format === 'json') {
      try {
        parsedContent = JSON.parse(content.content)
      } catch (error) {
        console.warn('Failed to parse JSON content for item:', content.id)
      }
    }
    
    return utils.successResponse({
      ...content,
      content: parsedContent
    })
    
  } catch (error) {
    console.error('Error fetching content by type:', error)
    return utils.errorResponse('Failed to fetch content', 500)
  }
}

async function getSkills(params) {
  try {
    const { category, proficiency_min, limit } = params
    
    let whereConditions = []
    let queryParams = []
    
    if (category) {
      whereConditions.push('category = ?')
      queryParams.push(category)
    }
    
    if (proficiency_min) {
      const minProf = parseInt(proficiency_min)
      if (minProf >= 1 && minProf <= 10) {
        whereConditions.push('proficiency >= ?')
        queryParams.push(minProf)
      }
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''
    
    let limitClause = ''
    if (limit) {
      const limitNum = Math.min(parseInt(limit), 100) // Cap at 100
      limitClause = `LIMIT ${limitNum}`
    }
    
    const query = `
      SELECT id, name, category, proficiency, icon, description, display_order, created_at, updated_at
      FROM t_skills 
      ${whereClause}
      ORDER BY category, display_order, proficiency DESC, name
      ${limitClause}
    `
    
    const skills = await db.query(query, queryParams)
    
    // Get category statistics
    const statsQuery = `
      SELECT 
        category,
        COUNT(*) as skill_count,
        AVG(proficiency) as avg_proficiency,
        MAX(proficiency) as max_proficiency
      FROM t_skills 
      GROUP BY category
      ORDER BY category
    `
    
    const categoryStats = await db.query(statsQuery)
    
    return utils.successResponse({
      skills,
      statistics: {
        total_skills: skills.length,
        categories: categoryStats
      }
    })
    
  } catch (error) {
    console.error('Error fetching skills:', error)
    return utils.errorResponse('Failed to fetch skills', 500)
  }
}

async function getSkillsByCategory(category) {
  try {
    if (!category) {
      return utils.errorResponse('Category is required', 400)
    }
    
    const query = `
      SELECT id, name, category, proficiency, icon, description, display_order, created_at, updated_at
      FROM t_skills 
      WHERE category = ?
      ORDER BY display_order, proficiency DESC, name
    `
    
    const skills = await db.query(query, [category])
    
    if (skills.length === 0) {
      return utils.errorResponse('No skills found for this category', 404)
    }
    
    // Get category statistics
    const categoryStats = {
      category,
      total_skills: skills.length,
      avg_proficiency: skills.reduce((sum, skill) => sum + skill.proficiency, 0) / skills.length,
      max_proficiency: Math.max(...skills.map(skill => skill.proficiency)),
      min_proficiency: Math.min(...skills.map(skill => skill.proficiency))
    }
    
    return utils.successResponse({
      skills,
      category_stats: categoryStats
    })
    
  } catch (error) {
    console.error('Error fetching skills by category:', error)
    return utils.errorResponse('Failed to fetch skills', 500)
  }
}

async function createContent(contentData) {
  try {
    // Validate content data
    if (!contentData.type) {
      return utils.errorResponse('Content type is required', 400)
    }
    
    if (!contentData.content) {
      return utils.errorResponse('Content is required', 400)
    }
    
    const { type, title, content, format = 'markdown' } = contentData
    
    // Validate format
    const validFormats = ['markdown', 'json', 'text']
    if (!validFormats.includes(format)) {
      return utils.errorResponse('Invalid format. Must be one of: ' + validFormats.join(', '), 400)
    }
    
    // Validate JSON if format is json
    if (format === 'json') {
      try {
        JSON.parse(content)
      } catch (error) {
        return utils.errorResponse('Invalid JSON content', 400)
      }
    }
    
    // Check if content type already exists
    const existingContent = await db.queryOne(
      'SELECT id FROM t_content WHERE type = ?',
      [type]
    )
    
    if (existingContent) {
      return utils.errorResponse('Content with this type already exists', 409)
    }
    
    // Create content
    const contentId = await db.insert('t_content', {
      type: validation.sanitizeString(type),
      title: title ? validation.sanitizeString(title) : null,
      content: validation.sanitizeString(content),
      format,
      created_at: new Date()
    })
    
    // Fetch created content
    const createdContent = await db.queryOne(
      'SELECT * FROM t_content WHERE id = ?',
      [contentId]
    )
    
    return utils.successResponse({
      message: 'Content created successfully',
      content: createdContent
    }, 201)
    
  } catch (error) {
    console.error('Error creating content:', error)
    return utils.errorResponse('Failed to create content', 500)
  }
}

async function updateContent(contentId, updateData) {
  try {
    if (!contentId) {
      return utils.errorResponse('Content ID is required', 400)
    }
    
    // Check if content exists
    const existingContent = await db.queryOne(
      'SELECT * FROM t_content WHERE id = ?',
      [contentId]
    )
    
    if (!existingContent) {
      return utils.errorResponse('Content not found', 404)
    }
    
    // Validate allowed fields
    const allowedFields = ['title', 'content', 'format']
    const sanitizedData = utils.sanitizeData(updateData, allowedFields)
    
    if (Object.keys(sanitizedData).length === 0) {
      return utils.errorResponse('No valid fields to update', 400)
    }
    
    // Validate format if provided
    if (sanitizedData.format) {
      const validFormats = ['markdown', 'json', 'text']
      if (!validFormats.includes(sanitizedData.format)) {
        return utils.errorResponse('Invalid format. Must be one of: ' + validFormats.join(', '), 400)
      }
    }
    
    // Validate JSON if format is json
    if (sanitizedData.format === 'json' && sanitizedData.content) {
      try {
        JSON.parse(sanitizedData.content)
      } catch (error) {
        return utils.errorResponse('Invalid JSON content', 400)
      }
    }
    
    // Set updated timestamp
    sanitizedData.updated_at = new Date()
    
    // Update content
    await db.update('t_content', sanitizedData, 'id = ?', [contentId])
    
    // Fetch updated content
    const updatedContent = await db.queryOne(
      'SELECT * FROM t_content WHERE id = ?',
      [contentId]
    )
    
    return utils.successResponse({
      message: 'Content updated successfully',
      content: updatedContent
    })
    
  } catch (error) {
    console.error('Error updating content:', error)
    return utils.errorResponse('Failed to update content', 500)
  }
}

async function deleteContent(contentId) {
  try {
    if (!contentId) {
      return utils.errorResponse('Content ID is required', 400)
    }
    
    // Check if content exists
    const content = await db.queryOne(
      'SELECT * FROM t_content WHERE id = ?',
      [contentId]
    )
    
    if (!content) {
      return utils.errorResponse('Content not found', 404)
    }
    
    // Delete content
    const deleteResult = await db.delete('t_content', 'id = ?', [contentId])
    
    if (deleteResult.affectedRows === 0) {
      return utils.errorResponse('Failed to delete content', 500)
    }
    
    return utils.successResponse({
      message: 'Content deleted successfully',
      deleted_content: {
        id: content.id,
        type: content.type,
        title: content.title
      }
    })
    
  } catch (error) {
    console.error('Error deleting content:', error)
    return utils.errorResponse('Failed to delete content', 500)
  }
}

async function createSkill(skillData) {
  try {
    // Validate skill data
    if (!skillData.name) {
      return utils.errorResponse('Skill name is required', 400)
    }
    
    if (!skillData.category) {
      return utils.errorResponse('Skill category is required', 400)
    }
    
    if (skillData.proficiency === undefined || skillData.proficiency < 1 || skillData.proficiency > 10) {
      return utils.errorResponse('Proficiency must be between 1 and 10', 400)
    }
    
    const { name, category, proficiency, icon, description, display_order = 0 } = skillData
    
    // Check if skill already exists
    const existingSkill = await db.queryOne(
      'SELECT id FROM t_skills WHERE name = ? AND category = ?',
      [name, category]
    )
    
    if (existingSkill) {
      return utils.errorResponse('Skill with this name already exists in this category', 409)
    }
    
    // Create skill
    const skillId = await db.insert('t_skills', {
      name: validation.sanitizeString(name),
      category: validation.sanitizeString(category),
      proficiency: parseInt(proficiency),
      icon: icon ? validation.sanitizeString(icon) : null,
      description: description ? validation.sanitizeString(description) : null,
      display_order: parseInt(display_order),
      created_at: new Date()
    })
    
    // Fetch created skill
    const createdSkill = await db.queryOne(
      'SELECT * FROM t_skills WHERE id = ?',
      [skillId]
    )
    
    return utils.successResponse({
      message: 'Skill created successfully',
      skill: createdSkill
    }, 201)
    
  } catch (error) {
    console.error('Error creating skill:', error)
    return utils.errorResponse('Failed to create skill', 500)
  }
}

async function updateSkill(skillId, updateData) {
  try {
    if (!skillId) {
      return utils.errorResponse('Skill ID is required', 400)
    }
    
    // Check if skill exists
    const existingSkill = await db.queryOne(
      'SELECT * FROM t_skills WHERE id = ?',
      [skillId]
    )
    
    if (!existingSkill) {
      return utils.errorResponse('Skill not found', 404)
    }
    
    // Validate allowed fields
    const allowedFields = ['name', 'category', 'proficiency', 'icon', 'description', 'display_order']
    const sanitizedData = utils.sanitizeData(updateData, allowedFields)
    
    if (Object.keys(sanitizedData).length === 0) {
      return utils.errorResponse('No valid fields to update', 400)
    }
    
    // Validate proficiency if provided
    if (sanitizedData.proficiency !== undefined) {
      const prof = parseInt(sanitizedData.proficiency)
      if (prof < 1 || prof > 10) {
        return utils.errorResponse('Proficiency must be between 1 and 10', 400)
      }
      sanitizedData.proficiency = prof
    }
    
    // Validate display_order if provided
    if (sanitizedData.display_order !== undefined) {
      sanitizedData.display_order = parseInt(sanitizedData.display_order)
    }
    
    // Check for name/category uniqueness if either is being updated
    if (sanitizedData.name || sanitizedData.category) {
      const nameToCheck = sanitizedData.name || existingSkill.name
      const categoryToCheck = sanitizedData.category || existingSkill.category
      
      const duplicateSkill = await db.queryOne(
        'SELECT id FROM t_skills WHERE name = ? AND category = ? AND id != ?',
        [nameToCheck, categoryToCheck, skillId]
      )
      
      if (duplicateSkill) {
        return utils.errorResponse('Skill with this name already exists in this category', 409)
      }
    }
    
    // Set updated timestamp
    sanitizedData.updated_at = new Date()
    
    // Update skill
    await db.update('t_skills', sanitizedData, 'id = ?', [skillId])
    
    // Fetch updated skill
    const updatedSkill = await db.queryOne(
      'SELECT * FROM t_skills WHERE id = ?',
      [skillId]
    )
    
    return utils.successResponse({
      message: 'Skill updated successfully',
      skill: updatedSkill
    })
    
  } catch (error) {
    console.error('Error updating skill:', error)
    return utils.errorResponse('Failed to update skill', 500)
  }
}

async function deleteSkill(skillId) {
  try {
    if (!skillId) {
      return utils.errorResponse('Skill ID is required', 400)
    }
    
    // Check if skill exists
    const skill = await db.queryOne(
      'SELECT * FROM t_skills WHERE id = ?',
      [skillId]
    )
    
    if (!skill) {
      return utils.errorResponse('Skill not found', 404)
    }
    
    // Delete skill
    const deleteResult = await db.delete('t_skills', 'id = ?', [skillId])
    
    if (deleteResult.affectedRows === 0) {
      return utils.errorResponse('Failed to delete skill', 500)
    }
    
    return utils.successResponse({
      message: 'Skill deleted successfully',
      deleted_skill: {
        id: skill.id,
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency
      }
    })
    
  } catch (error) {
    console.error('Error deleting skill:', error)
    return utils.errorResponse('Failed to delete skill', 500)
  }
}