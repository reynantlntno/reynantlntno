import { getMany, getOne, insertRecord, updateRecord, deleteRecord } from './lib/db.js'
import { asyncHandler, successResponse, errorResponse, getQueryParams, getPathParams, parseBody } from './lib/utils.js'
import { rateLimitMiddleware } from './lib/rate-limit.js'
import { requireAuth } from './lib/auth.js'
import { validateData, schemas } from './lib/validation.js'

const handler = asyncHandler(async (event, context) => {
  // Apply rate limiting first
  const rateLimit = await rateLimitMiddleware('default')(event)
  if (rateLimit.statusCode) return rateLimit

  const { httpMethod } = event
  const pathParams = getPathParams(event)
  const queryParams = getQueryParams(event)

  // ADD THIS DEBUG BLOCK
  console.log('=== ABOUT API DEBUG ===')
  console.log('HTTP Method:', httpMethod)
  console.log('Raw Path:', event.path)
  console.log('Extracted pathParams:', JSON.stringify(pathParams))
  console.log('Query params:', JSON.stringify(queryParams))
  console.log('=====================')

  try {
    // GET requests are public (no auth needed)
    if (httpMethod === 'GET') {
      const { type, category } = queryParams

      if (type === 'skills') {
        // Get skills, optionally filtered by category
        const conditions = category ? { category } : {}
        const skills = await getMany('t_skills', conditions, { 
          orderBy: 'category ASC, display_order ASC, name ASC' 
        })

        // Group skills by category
        const skillsByCategory = skills.reduce((acc, skill) => {
          if (!acc[skill.category]) {
            acc[skill.category] = []
          }
          acc[skill.category].push(skill)
          return acc
        }, {})

        return successResponse({
          skills: skillsByCategory,
          totalSkills: skills.length,
          categories: [...new Set(skills.map(s => s.category))]
        }, 'Skills retrieved successfully', rateLimit.rateLimitHeaders)
      }

      if (type === 'content') {
        // Get specific content by type or all content
        const { contentType } = queryParams
        const conditions = contentType ? { type: contentType } : {}
        
        if (contentType) {
          const content = await getOne('t_content', conditions)
          if (!content) {
            return errorResponse('Content not found', 404)
          }
          return successResponse(content, 'Content retrieved successfully', rateLimit.rateLimitHeaders)
        } else {
          const allContent = await getMany('t_content', {}, { orderBy: 'type ASC, updated_at DESC' })
          return successResponse(allContent, 'All content retrieved successfully', rateLimit.rateLimitHeaders)
        }
      }

      // Default: Get all about-related data
      const [aboutContent, skills] = await Promise.all([
        getMany('t_content', { type: 'about' }),
        getMany('t_skills', {}, { 
          orderBy: 'category ASC, display_order ASC, name ASC' 
        })
      ])

      // Group skills by category
      const skillsByCategory = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = []
        }
        acc[skill.category].push(skill)
        return acc
      }, {})

      const responseData = {
        content: aboutContent[0] || null,
        skills: skillsByCategory,
        totalSkills: skills.length,
        categories: [...new Set(skills.map(s => s.category))]
      }

      return successResponse(responseData, 'About data retrieved successfully', rateLimit.rateLimitHeaders)
    }

    // All write operations require API key with 'content' scope
    if (['POST', 'PUT', 'DELETE'].includes(httpMethod)) {
      const authResult = await requireAuth('content')(event)
      if (authResult.statusCode) return authResult
    }

    // POST - Create new content or skill
    if (httpMethod === 'POST') {
      const body = parseBody(event)
      const { type } = queryParams

      console.log('POST REQUEST - Type:', type)
      console.log('POST REQUEST - Body keys:', Object.keys(body))

      if (type === 'skill') {
        // Create new skill
        console.log('POST SKILL - Full body:', JSON.stringify(body, null, 2)) // ADD THIS LINE
        console.log('POST SKILL - proficiency field:', body.proficiency, 'type:', typeof body.proficiency) // ADD THIS LINE
        
        let validation
        try {
          validation = validateData(body, schemas.skill)
          console.log('POST SKILL - Validation result:', validation.isValid)
          console.log('POST SKILL - Validation errors:', validation.errors)
          console.log('POST SKILL - Schema details:', schemas.skill) // ADD THIS LINE
        } catch (validationError) {
          console.error('POST SKILL - Validation error:', validationError)
          return errorResponse('Validation error occurred', 500, validationError.message)
        }
        
        if (!validation.isValid) {
          return errorResponse('Validation failed', 400, validation.errors)
        }

        const skillId = await insertRecord('t_skills', {
          ...validation.data,
          created_at: new Date(),
          updated_at: new Date()
        })

        if (!skillId) {
          return errorResponse('Failed to create skill', 500)
        }

        const newSkill = await getOne('t_skills', { id: skillId })
        return successResponse(newSkill, 'Skill created successfully', rateLimit.rateLimitHeaders)
      } 
      
      if (type === 'content') {
        // Create new content
        const validation = validateData(body, schemas.content)
        if (!validation.isValid) {
          return errorResponse('Validation failed', 400, validation.errors)
        }

        const contentId = await insertRecord('t_content', {
          ...validation.data,
          created_at: new Date(),
          updated_at: new Date()
        })

        if (!contentId) {
          return errorResponse('Failed to create content', 500)
        }

        const newContent = await getOne('t_content', { id: contentId })
        return successResponse(newContent, 'Content created successfully', rateLimit.rateLimitHeaders)
      }

      return errorResponse('Invalid type parameter. Use "skill" or "content"', 400)
    }

    // PUT - Update existing content or skill
    if (httpMethod === 'PUT') {
      const { id } = pathParams
      const body = parseBody(event)
      const { type } = queryParams

      if (!id) {
        return errorResponse('ID parameter required in path', 400)
      }

      if (type === 'skill') {
        // Update skill
        const validation = validateData(body, schemas.skill)
        if (!validation.isValid) {
          return errorResponse('Validation failed', 400, validation.errors)
        }

        const updated = await updateRecord('t_skills', {
          ...validation.data,
          updated_at: new Date()
        }, { id })

        if (!updated) {
          return errorResponse('Skill not found or update failed', 404)
        }

        const updatedSkill = await getOne('t_skills', { id })
        return successResponse(updatedSkill, 'Skill updated successfully', rateLimit.rateLimitHeaders)
      }
      
      if (type === 'content') {
        // Update content
        const validation = validateData(body, schemas.content)
        if (!validation.isValid) {
          return errorResponse('Validation failed', 400, validation.errors)
        }

        const updated = await updateRecord('t_content', {
          ...validation.data,
          updated_at: new Date()
        }, { id })

        if (!updated) {
          return errorResponse('Content not found or update failed', 404)
        }

        const updatedContent = await getOne('t_content', { id })
        return successResponse(updatedContent, 'Content updated successfully', rateLimit.rateLimitHeaders)
      }

      return errorResponse('Invalid type parameter. Use "skill" or "content"', 400)
    }

    // DELETE - Remove content or skill
    if (httpMethod === 'DELETE') {
      const { id } = pathParams
      const { type } = queryParams

      if (!id) {
        return errorResponse('ID parameter required in path', 400)
      }

      if (type === 'skill') {
        const deleted = await deleteRecord('t_skills', { id })
        if (!deleted) {
          return errorResponse('Skill not found', 404)
        }
        return successResponse(null, 'Skill deleted successfully', rateLimit.rateLimitHeaders)
      }
      
      if (type === 'content') {
        const deleted = await deleteRecord('t_content', { id })
        if (!deleted) {
          return errorResponse('Content not found', 404)
        }
        return successResponse(null, 'Content deleted successfully', rateLimit.rateLimitHeaders)
      }

      return errorResponse('Invalid type parameter. Use "skill" or "content"', 400)
    }

    return errorResponse('Method not allowed', 405)
  } catch (error) {
    console.error('About function error:', error)
    return errorResponse('Internal server error', 500)
  }
})

export { handler }