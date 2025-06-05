export interface BlogPost {
  id: number
  slug: string
  title: string
  summary?: string
  content: string
  image_url?: string
  published: boolean
  published_at?: string
  meta_title?: string
  meta_description?: string
  tags?: string[]
  read_time?: number
  created_at: string
  updated_at: string
}

export interface BlogListItem {
  id: number
  slug: string
  title: string
  summary?: string
  image_url?: string
  published_at?: string
  read_time?: number
  tags?: string[]
}

export interface BlogCreateData {
  title: string
  slug: string
  summary?: string
  content: string
  image_url?: string
  published?: boolean
  meta_title?: string
  meta_description?: string
  tags?: string[]
}

export interface BlogUpdateData extends Partial<BlogCreateData> {
  id: number
}