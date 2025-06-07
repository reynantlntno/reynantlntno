import { getMany, getOne, executeQuery, insertRecord, updateRecord, deleteRecord } from './lib/db.js'
import { asyncHandler, successResponse, errorResponse, getQueryParams, getPathParams, parseBody, getPaginationMeta, validatePagination, JSONToTags, tagsToJSON, generateSlug } from './lib/utils.js'
import { rateLimitMiddleware } from './lib/rate-limit.js'
import { requireAuth } from './lib/auth.js'
import { validateData, schemas } from './lib/validation.js'

const handler = asyncHandler(async (event, context) => {
  // Apply rate limiting
  const rateLimit = await rateLimitMiddleware('default')(event)
  if (rateLimit.statusCode) return rateLimit

  const { httpMethod } = event
  const pathParams = getPathParams(event)
  const queryParams = getQueryParams(event)

  // ADD THIS DEBUG BLOCK
  console.log('=== PROJECTS API DEBUG ===')
  console.log('HTTP Method:', httpMethod)
  console.log('Raw Path:', event.path)
  console.log('Extracted pathParams:', JSON.stringify(pathParams))
  console.log('Query params:', JSON.stringify(queryParams))
  console.log('========================')

  try {
    // PUBLIC GET OPERATIONS (No authentication required)
    if (httpMethod === 'GET') {
      const { admin } = queryParams

      // Admin get operations require authentication
      if (admin) {
        const authResult = await requireAuth('projects')(event)
        if (authResult.statusCode) return authResult

        const { featured, technology, limit, offset } = queryParams
        
        // Get all projects including unpublished (admin view)
        let conditions = {}
        if (featured !== undefined) conditions.featured = featured === 'true' ? 1 : 0
        
        let whereConditions = []
        let sqlParams = [] // <-- Use a different name

        if (featured !== undefined) {
          whereConditions.push('featured = ?')
          sqlParams.push(featured === 'true' ? 1 : 0)
        }

        if (technology) {
          whereConditions.push('JSON_SEARCH(technologies, "one", ?) IS NOT NULL')
          sqlParams.push(technology)
        }

        const whereClause = whereConditions.length > 0 ? 
          'WHERE ' + whereConditions.join(' AND ') : ''

        const projectsQuery = `
          SELECT p.*, 
                 GROUP_CONCAT(
                   JSON_OBJECT(
                     'id', pi.id,
                     'image_url', pi.image_url,
                     'alt_text', pi.alt_text,
                     'display_order', pi.display_order
                   ) ORDER BY pi.display_order ASC
                 ) as images
          FROM t_projects p
          LEFT JOIN t_project_images pi ON p.id = pi.project_id
          ${whereClause}
          GROUP BY p.id
          ORDER BY p.display_order ASC, p.created_at DESC
          ${limit ? `LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset) || 0}` : ''}
        `

        const result = await executeQuery(projectsQuery, sqlParams)
        
        if (!result.success) {
          return errorResponse('Failed to fetch projects', 500)
        }

        const projects = result.data.map(project => ({
          ...project,
          technologies: JSONToTags(project.technologies),
          images: project.images ? 
            project.images.split(',').map(img => JSON.parse(img)) : []
        }))

        return successResponse(projects, 'Projects retrieved successfully (admin)', rateLimit.rateLimitHeaders)
      }

      // Check if requesting specific project by slug
      if (pathParams.slug) {
        const slug = pathParams.slug
        
        // Get project with images - Fixed query to handle JSON properly
        const projectQuery = `
          SELECT p.*, 
                 COALESCE(
                   JSON_ARRAYAGG(
                     CASE 
                       WHEN pi.id IS NOT NULL THEN
                         JSON_OBJECT(
                           'id', pi.id,
                           'image_url', pi.image_url,
                           'alt_text', pi.alt_text,
                           'display_order', pi.display_order
                         )
                       ELSE NULL
                     END
                   ), 
                   JSON_ARRAY()
                 ) as images
          FROM t_projects p
          LEFT JOIN t_project_images pi ON p.id = pi.project_id
          WHERE p.slug = ?
          GROUP BY p.id
        `
        
        const result = await executeQuery(projectQuery, [slug])
        
        if (!result.success || result.data.length === 0) {
          return errorResponse('Project not found', 404)
        }

        const project = result.data[0]
        
        // Parse technologies and images
        project.technologies = JSONToTags(project.technologies)
        
        // Handle images parsing more safely
        try {
          if (project.images && typeof project.images === 'string') {
            project.images = JSON.parse(project.images).filter(img => img !== null)
          } else if (Array.isArray(project.images)) {
            project.images = project.images.filter(img => img !== null)
          } else {
            project.images = []
          }
        } catch (imageParseError) {
          console.error('Error parsing project images:', imageParseError)
          project.images = []
        }
        
        return successResponse(project, 'Project retrieved successfully', rateLimit.rateLimitHeaders)
      }

      // Get projects list with pagination (public view)
      const { page = 1, limit = 12, featured, technology } = queryParams
      const { page: validPage, limit: validLimit } = validatePagination(page, limit)
      const offset = (validPage - 1) * validLimit

      // Build query conditions
      let whereConditions = []
      let sqlParams = [] // Changed from queryParams to avoid conflict

      if (featured === 'true') {
        whereConditions.push('featured = 1')
      }

      if (technology) {
        whereConditions.push('JSON_SEARCH(technologies, "one", ?) IS NOT NULL')
        sqlParams.push(technology) // Changed from queryParams
      }

      const whereClause = whereConditions.length > 0 ? 
        'WHERE ' + whereConditions.join(' AND ') : ''

      // Get projects
      const projectsQuery = `
        SELECT id, slug, title, description, thumbnail_url, github_url, demo_url, 
               technologies, featured, display_order
        FROM t_projects 
        ${whereClause}
        ORDER BY featured DESC, display_order ASC, created_at DESC
        LIMIT ${validLimit} OFFSET ${offset}
      `

      const projectsResult = await executeQuery(projectsQuery, sqlParams) // Changed from queryParams

      if (!projectsResult.success) {
        return errorResponse('Failed to fetch projects', 500)
      }

      // Get total count
      const countQuery = `SELECT COUNT(*) as count FROM t_projects ${whereClause}`
      const countResult = await executeQuery(countQuery, sqlParams) // Changed from queryParams
      const totalProjects = countResult.success ? countResult.data[0].count : 0

      // Parse technologies for each project
      const projects = projectsResult.data.map(project => ({
        ...project,
        technologies: JSONToTags(project.technologies)
      }))

      // Get all unique technologies for filter options
      const techQuery = `
        SELECT DISTINCT JSON_UNQUOTE(JSON_EXTRACT(technologies, CONCAT('$[', numbers.n, ']'))) as technology
        FROM t_projects
        CROSS JOIN (
          SELECT 0 as n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
          UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9
        ) numbers
        WHERE JSON_EXTRACT(technologies, CONCAT('$[', numbers.n, ']')) IS NOT NULL
        ORDER BY technology
      `
      
      const techResult = await executeQuery(techQuery)
      const availableTechnologies = techResult.success ? 
        techResult.data.map(row => row.technology).filter(Boolean) : []

      const pagination = getPaginationMeta(validPage, totalProjects, validLimit)

      const responseData = {
        projects,
        pagination,
        availableTechnologies,
        filters: {
          featured: featured === 'true' ? true : null,
          technology: technology || null
        }
      }

      return successResponse(responseData, 'Projects retrieved successfully', rateLimit.rateLimitHeaders)
    }

    // All write operations require API key with 'projects' scope
    if (['POST', 'PUT', 'DELETE'].includes(httpMethod)) {
      const authResult = await requireAuth('projects')(event)
      if (authResult.statusCode) return authResult
    }

    // POST - Create new project
    if (httpMethod === 'POST') {
      const body = parseBody(event)
      
      console.log('POST REQUEST - Body:', JSON.stringify(body, null, 2))
      
      // Validate project data
      const validation = validateData(body, schemas.project)
      
      console.log('POST REQUEST - Validation result:', validation.isValid)
      console.log('POST REQUEST - Validation errors:', validation.errors)
      
      if (!validation.isValid) {
        return errorResponse('Validation failed', 400, validation.errors)
      }

      const { title, slug, description, content, thumbnail_url, github_url, demo_url, technologies, featured, display_order, images } = validation.data

      // Check if slug already exists
      const existingProject = await getOne('t_projects', { slug })
      if (existingProject) {
        return errorResponse('Slug already exists', 400)
      }

      // Prepare data for insertion
      const projectData = {
        title,
        slug,
        description,
        content: content || null,
        thumbnail_url: thumbnail_url || null,
        github_url: github_url || null,
        demo_url: demo_url || null,
        technologies: tagsToJSON(technologies),
        featured: featured || false,
        display_order: display_order || 0,
        created_at: new Date(),
        updated_at: new Date()
      }

      const projectId = await insertRecord('t_projects', projectData)

      if (!projectId) {
        return errorResponse('Failed to create project', 500)
      }

      // Add project images if provided
      if (images && Array.isArray(images)) {
        for (let i = 0; i < images.length; i++) {
          const image = images[i]
          if (image.image_url) {
            await insertRecord('t_project_images', {
              project_id: projectId,
              image_url: image.image_url,
              alt_text: image.alt_text || null,
              display_order: image.display_order || i
            })
          }
        }
      }

      const newProject = await getOne('t_projects', { id: projectId })
      newProject.technologies = JSONToTags(newProject.technologies)
      newProject.images = []

      return successResponse(newProject, 'Project created successfully', rateLimit.rateLimitHeaders)
    }

    // PUT - Update existing project
    if (httpMethod === 'PUT') {
      const { id } = pathParams
      
      console.log('PUT REQUEST - Extracted ID:', id, 'Type:', typeof id)
      
      if (!id) {
        return errorResponse('Project ID required in path', 400)
      }

      const body = parseBody(event)
      console.log('PUT REQUEST - Body keys:', Object.keys(body))
      console.log('PUT REQUEST - Full body:', JSON.stringify(body, null, 2)) // ADD THIS LINE
      
      // Check what the featured field actually contains
      console.log('PUT REQUEST - featured field:', body.featured, 'type:', typeof body.featured) // ADD THIS LINE
      
      // Add try-catch for validation
      let validation
      try {
        validation = validateData(body, schemas.project)
        console.log('PUT REQUEST - Validation result:', validation.isValid)
        console.log('PUT REQUEST - Validation errors:', validation.errors)
        console.log('PUT REQUEST - Schema details:', schemas.project) // ADD THIS LINE
      } catch (validationError) {
        console.error('PUT REQUEST - Validation error:', validationError)
        return errorResponse('Validation error occurred', 500, validationError.message)
      }
      
      if (!validation.isValid) {
        return errorResponse('Validation failed', 400, validation.errors)
      }

      // Check if project exists
      const existingProject = await getOne('t_projects', { id })
      if (!existingProject) {
        return errorResponse('Project not found', 404)
      }

      const { title, slug, description, content, thumbnail_url, github_url, demo_url, technologies, featured, display_order, images } = validation.data

      // Check if slug conflicts with another project
      if (slug && slug !== existingProject.slug) {
        const conflictingProject = await getOne('t_projects', { slug })
        if (conflictingProject && conflictingProject.id != id) {
          return errorResponse('Slug already exists', 400)
        }
      }

      // Prepare update data
      const updateData = {
        updated_at: new Date()
      }

      if (title) updateData.title = title
      if (slug) updateData.slug = slug
      if (description) updateData.description = description
      if (content !== undefined) updateData.content = content
      if (thumbnail_url !== undefined) updateData.thumbnail_url = thumbnail_url
      if (github_url !== undefined) updateData.github_url = github_url
      if (demo_url !== undefined) updateData.demo_url = demo_url
      if (technologies !== undefined) updateData.technologies = tagsToJSON(technologies)
      if (featured !== undefined) updateData.featured = featured
      if (display_order !== undefined) updateData.display_order = display_order

      const updated = await updateRecord('t_projects', updateData, { id })

      if (!updated) {
        return errorResponse('Failed to update project', 500)
      }

      // Handle image updates if provided
      if (images !== undefined && Array.isArray(images)) {
        // Delete existing images
        await deleteRecord('t_project_images', { project_id: id })
        
        // Add new images
        for (let i = 0; i < images.length; i++) {
          const image = images[i]
          if (image.image_url) {
            await insertRecord('t_project_images', {
              project_id: id,
              image_url: image.image_url,
              alt_text: image.alt_text || null,
              display_order: image.display_order || i
            })
          }
        }
      }

      // Get updated project with images
      const projectQuery = `
        SELECT p.*,
               JSON_ARRAYAGG(
                 JSON_OBJECT(
                   'id', pi.id,
                   'image_url', pi.image_url,
                   'alt_text', pi.alt_text,
                   'display_order', pi.display_order
                 )
               ) as images
        FROM t_projects p
        LEFT JOIN t_project_images pi ON p.id = pi.project_id
        WHERE p.id = ?
        GROUP BY p.id
      `
      
      const result = await executeQuery(projectQuery, [id])
      const updatedProject = result.data[0]
      
      updatedProject.technologies = JSONToTags(updatedProject.technologies)
      updatedProject.images = updatedProject.images ? 
        JSON.parse(updatedProject.images) : []

      return successResponse(updatedProject, 'Project updated successfully', rateLimit.rateLimitHeaders)
    }

    // DELETE - Remove project
    if (httpMethod === 'DELETE') {
      const { id } = pathParams
      
      if (!id) {
        return errorResponse('Project ID required in path', 400)
      }

      // Check if project exists
      const existingProject = await getOne('t_projects', { id })
      if (!existingProject) {
        return errorResponse('Project not found', 404)
      }

      // Delete project (cascading delete will handle images)
      const deleted = await deleteRecord('t_projects', { id })
      
      if (!deleted) {
        return errorResponse('Failed to delete project', 500)
      }

      return successResponse(null, 'Project deleted successfully', rateLimit.rateLimitHeaders)
    }

    // POST - Manage project images (separate endpoint)
    if (httpMethod === 'POST' && queryParams.action === 'images') {
      const { id } = pathParams
      const body = parseBody(event)
      
      if (!id) {
        return errorResponse('Project ID required in path', 400)
      }

      // Check if project exists
      const existingProject = await getOne('t_projects', { id })
      if (!existingProject) {
        return errorResponse('Project not found', 404)
      }

      const { image_url, alt_text, display_order } = body

      if (!image_url) {
        return errorResponse('Image URL is required', 400)
      }

      const imageId = await insertRecord('t_project_images', {
        project_id: id,
        image_url,
        alt_text: alt_text || null,
        display_order: display_order || 0
      })

      if (!imageId) {
        return errorResponse('Failed to add project image', 500)
      }

      const newImage = await getOne('t_project_images', { id: imageId })
      return successResponse(newImage, 'Project image added successfully', rateLimit.rateLimitHeaders)
    }

    // DELETE - Remove specific project image
    if (httpMethod === 'DELETE' && queryParams.type === 'image') {
      const { id } = pathParams // This is the image ID
      
      if (!id) {
        return errorResponse('Image ID required in path', 400)
      }

      const deleted = await deleteRecord('t_project_images', { id })
      
      if (!deleted) {
        return errorResponse('Project image not found', 404)
      }

      return successResponse(null, 'Project image deleted successfully', rateLimit.rateLimitHeaders)
    }

    return errorResponse('Method not allowed', 405)
  } catch (error) {
    console.error('Projects function error:', error)
    return errorResponse('Internal server error', 500)
  }
})

export { handler }