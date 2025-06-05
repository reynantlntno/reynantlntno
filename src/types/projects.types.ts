export interface Project {
  id: number
  slug: string
  title: string
  description: string
  content?: string
  thumbnail_url?: string
  github_url?: string
  demo_url?: string
  technologies?: string[]
  featured: boolean
  display_order: number
  images?: ProjectImage[]
  created_at: string
  updated_at: string
}

export interface ProjectImage {
  id: number
  project_id: number
  image_url: string
  alt_text?: string
  display_order: number
  created_at: string
}

export interface ProjectListItem {
  id: number
  slug: string
  title: string
  description: string
  thumbnail_url?: string
  technologies?: string[]
  featured: boolean
  github_url?: string
  demo_url?: string
}

export interface ProjectCreateData {
  title: string
  slug: string
  description: string
  content?: string
  thumbnail_url?: string
  github_url?: string
  demo_url?: string
  technologies?: string[]
  featured?: boolean
  display_order?: number
}

export interface ProjectUpdateData extends Partial<ProjectCreateData> {
  id: number
}