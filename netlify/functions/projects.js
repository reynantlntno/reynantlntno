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
    const path = event.path.replace('/.netlify/functions/projects', '') || '/'
    const queryParams = utils.getQueryParams(event)
    
    let response

    switch (method) {
      case 'GET':
        if (path === '/' || path === '') {
          response = await getProjects(queryParams)
        } else if (path.match(/^\/[^\/]+$/)) {
          // Single project by slug
          const slug = path.substring(1)
          response = await getProjectBySlug(slug)
        } else if (path.match(/^\/[^\/]+\/images$/)) {
          // Project images
          const slug = path.split('/')[1]
          response = await getProjectImages(slug)
        } else {
          response = utils.errorResponse('Endpoint not found', 404)
        }
        break

      case 'POST':
        // Check for master API key for write operations
        const authResult = await auth.verifyMasterApiKey(event)
        if (!authResult.valid) {
          return utils.errorResponse(authResult.error, 401)
        }
        
        response = await createProject(utils.parseRequestBody(event), event)
        break

      case 'PUT':
        // Check for master API key for write operations
        const authResultPut = await auth.verifyMasterApiKey(event)
        if (!authResultPut.valid) {
          return utils.errorResponse(authResultPut.error, 401)
        }
        
        if (path.match(/^\/[^\/]+$/)) {
          const slug = path.substring(1)
          response = await updateProject(slug, utils.parseRequestBody(event), event)
        } else {
          response = utils.errorResponse('Endpoint not found', 404)
        }
        break

      case 'DELETE':
        // Check for master API key for write operations
        const authResultDelete = await auth.verifyMasterApiKey(event)
        if (!authResultDelete.valid) {
          return utils.errorResponse(authResultDelete.error, 401)
        }
        
        if (path.match(/^\/[^\/]+$/)) {
          const slug = path.substring(1)
          response = await deleteProject(slug, event)
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
    console.log(`Projects function executed in ${endTime - startTime}ms`)
    
    return response
    
  } catch (error) {
    console.error('Projects function error:', error)
    return utils.errorResponse('Internal server error', 500)
  }
}

async function getProjects(params) {
  try {
    const {
      page = 1,
      limit = 12,
      search = '',
      technologies = '',
      featured = null,
      sortBy = 'display_order',
      sortOrder = 'asc'
    } = params
    
    const pageNum = parseInt(page)
    const limitNum = Math.min(parseInt(limit), 50) // Cap at 50
    
    let whereConditions = []
    let queryParams = []
    
    // Search functionality
    if (search) {
      whereConditions.push('(title LIKE ? OR description LIKE ? OR content LIKE ?)')
      const searchTerm = `%${search}%`
      queryParams.push(searchTerm, searchTerm, searchTerm)
    }
    
    // Filter by technologies
    if (technologies) {
      const techArray = technologies.split(',').map(t => t.trim()).filter(Boolean)
      if (techArray.length > 0) {
        const techConditions = techArray.map(() => 'JSON_CONTAINS(technologies, JSON_QUOTE(?))').join(' OR ')
        whereConditions.push(`(${techConditions})`)
        queryParams.push(...techArray)
      }
    }
    
    // Filter by featured status
    if (featured !== null) {
      whereConditions.push('featured = ?')
      queryParams.push(featured === 'true' ? 1 : 0)
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''
    
    // Validate sort parameters
    const validSortFields = ['id', 'title', 'created_at', 'updated_at', 'display_order', 'featured']
    const validSortBy = validSortFields.includes(sortBy) ? sortBy : 'display_order'
    const validSortOrder = ['asc', 'desc'].includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'ASC'
    
    const orderClause = `ORDER BY ${validSortBy} ${validSortOrder}, created_at DESC`
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM t_projects ${whereClause}`
    const [{ total }] = await db.query(countQuery, queryParams)
    
    // Get projects
    const offset = (pageNum - 1) * limitNum
    const projectsQuery = `
      SELECT id, slug, title, description, thumbnail_url, github_url, demo_url,
             technologies, featured, display_order, created_at, updated_at
      FROM t_projects 
      ${whereClause} 
      ${orderClause} 
      LIMIT ? OFFSET ?
    `
    
    const projects = await db.query(projectsQuery, [...queryParams, limitNum, offset])
    
    // Parse JSON technologies
    const formattedProjects = projects.map(project => ({
      ...project,
      technologies: project.technologies ? JSON.parse(project.technologies) : [],
      featured: Boolean(project.featured)
    }))
    
    const pagination = utils.generatePagination(pageNum, limitNum, total)
    
    return utils.successResponse({
      projects: formattedProjects,
      pagination
    })
    
  } catch (error) {
    console.error('Error fetching projects:', error)
    return utils.errorResponse('Failed to fetch projects', 500)
  }
}

async function getProjectBySlug(slug) {
  try {
    if (!slug) {
      return utils.errorResponse('Project slug is required', 400)
    }
    
    const projectQuery = `
      SELECT id, slug, title, description, content, thumbnail_url, github_url, demo_url,
             technologies, featured, display_order, created_at, updated_at
      FROM t_projects 
      WHERE slug = ?
    `
    
    const project = await db.queryOne(projectQuery, [slug])
    
    if (!project) {
      return utils.errorResponse('Project not found', 404)
    }
    
    // Parse JSON technologies
    project.technologies = project.technologies ? JSON.parse(project.technologies) : []
    project.featured = Boolean(project.featured)
    
    // Get project images
    const imagesQuery = `
      SELECT id, image_url, alt_text, display_order, created_at
      FROM t_project_images 
      WHERE project_id = ?
      ORDER BY display_order, created_at
    `
    
    const images = await db.query(imagesQuery, [project.id])
    project.images = images
    
    return utils.successResponse(project)
    
  } catch (error) {
    console.error('Error fetching project by slug:', error)
    return utils.errorResponse('Failed to fetch project', 500)
  }
}

async function getProjectImages(slug) {
  try {
    if (!slug) {
      return utils.errorResponse('Project slug is required', 400)
    }
    
    // First get the project to check if it exists
    const project = await db.queryOne('SELECT id FROM t_projects WHERE slug = ?', [slug])
    
    if (!project) {
      return utils.errorResponse('Project not found', 404)
    }
    
    const imagesQuery = `
      SELECT id, image_url, alt_text, display_order, created_at
      FROM t_project_images 
      WHERE project_id = ?
      ORDER BY display_order, created_at
    `
    
    const images = await db.query(imagesQuery, [project.id])
    
    return utils.successResponse(images)
    
  } catch (error) {
    console.error('Error fetching project images:', error)
    return utils.errorResponse('Failed to fetch project images', 500)
  }
}

async function createProject(projectData, event) {
  try {
    // Validate project data
    const validationResult = validation.validateProject(projectData)
    if (!validationResult.isValid) {
      return utils.errorResponse('Validation failed', 400, validationResult.errors)
    }
    
    const {
      title,
      slug,
      description,
      content = '',
      thumbnail_url = null,
      github_url = null,
      demo_url = null,
      technologies = [],
      featured = false,
      display_order = 0
    } = projectData
    
    // Check if slug already exists
    const existingProject = await db.queryOne('SELECT id FROM t_projects WHERE slug = ?', [slug])
    if (existingProject) {
      return utils.errorResponse('A project with this slug already exists', 409)
    }
    
    // Prepare data for insertion
    const insertData = {
      title: validation.sanitizeString(title),
      slug: validation.sanitizeString(slug),
      description: validation.sanitizeString(description),
      content: content ? validation.sanitizeString(content) : null,
      thumbnail_url: thumbnail_url ? validation.sanitizeString(thumbnail_url) : null,
      github_url: github_url ? validation.sanitizeString(github_url) : null,
      demo_url: demo_url ? validation.sanitizeString(demo_url) : null,
      technologies: Array.isArray(technologies) ? JSON.stringify(technologies) : JSON.stringify([]),
      featured: Boolean(featured),
      display_order: parseInt(display_order) || 0,
      created_at: new Date(),
      updated_at: new Date()
    }
    
    const projectId = await db.insert('t_projects', insertData)
    
    // Fetch the created project
    const createdProject = await db.queryOne(
      'SELECT * FROM t_projects WHERE id = ?',
      [projectId]
    )
    
    // Format response
    createdProject.technologies = JSON.parse(createdProject.technologies || '[]')
    createdProject.featured = Boolean(createdProject.featured)
    
    return utils.successResponse(createdProject, 201)
    
  } catch (error) {
    console.error('Error creating project:', error)
    return utils.errorResponse('Failed to create project', 500)
  }
}

async function updateProject(slug, projectData, event) {
  try {
    if (!slug) {
      return utils.errorResponse('Project slug is required', 400)
    }
    
    // Check if project exists
    const existingProject = await db.queryOne('SELECT id, slug FROM t_projects WHERE slug = ?', [slug])
    if (!existingProject) {
      return utils.errorResponse('Project not found', 404)
    }
    
    // Validate project data (partial validation for updates)
    const allowedFields = [
      'title', 'slug', 'description', 'content', 'thumbnail_url', 
      'github_url', 'demo_url', 'technologies', 'featured', 'display_order'
    ]
    
    const updateData = utils.sanitizeData(projectData, allowedFields)
    
    // If slug is being updated, check for conflicts
    if (updateData.slug && updateData.slug !== existingProject.slug) {
      if (!validation.isValidSlug(updateData.slug)) {
        return utils.errorResponse('Invalid slug format', 400)
      }
      
      const slugConflict = await db.queryOne(
        'SELECT id FROM t_projects WHERE slug = ? AND id != ?',
        [updateData.slug, existingProject.id]
      )
      
      if (slugConflict) {
        return utils.errorResponse('A project with this slug already exists', 409)
      }
    }
    
    // Process fields
    if (updateData.technologies && Array.isArray(updateData.technologies)) {
      updateData.technologies = JSON.stringify(updateData.technologies)
    }
    
    if (updateData.featured !== undefined) {
      updateData.featured = Boolean(updateData.featured)
    }
    
    if (updateData.display_order !== undefined) {
      updateData.display_order = parseInt(updateData.display_order) || 0
    }
    
    // Add updated timestamp
    updateData.updated_at = new Date()
    
    // Update project
    await db.update('t_projects', updateData, 'id = ?', [existingProject.id])
    
    // Fetch updated project
    const updatedProject = await db.queryOne('SELECT * FROM t_projects WHERE id = ?', [existingProject.id])
    
    // Format response
    updatedProject.technologies = JSON.parse(updatedProject.technologies || '[]')
    updatedProject.featured = Boolean(updatedProject.featured)
    
    return utils.successResponse(updatedProject)
    
  } catch (error) {
    console.error('Error updating project:', error)
    return utils.errorResponse('Failed to update project', 500)
  }
}

async function deleteProject(slug, event) {
  try {
    if (!slug) {
      return utils.errorResponse('Project slug is required', 400)
    }
    
    // Check if project exists
    const project = await db.queryOne('SELECT id, title FROM t_projects WHERE slug = ?', [slug])
    if (!project) {
      return utils.errorResponse('Project not found', 404)
    }
    
    // Delete project (this will cascade delete images due to foreign key constraint)
    const deleteResult = await db.delete('t_projects', 'id = ?', [project.id])
    
    if (deleteResult.affectedRows === 0) {
      return utils.errorResponse('Failed to delete project', 500)
    }
    
    return utils.successResponse({
      message: `Project "${project.title}" has been deleted successfully`,
      deleted_project: {
        id: project.id,
        slug: slug,
        title: project.title
      }
    })
    
  } catch (error) {
    console.error('Error deleting project:', error)
    return utils.errorResponse('Failed to delete project', 500)
  }
}