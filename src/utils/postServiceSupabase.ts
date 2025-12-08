import { createSupabaseClient } from '@/lib/supabaseClient'
import type { Database } from '@/types/supabase'

type PostRow = Database['public']['Tables']['posts']['Row']
type PostInsert = Database['public']['Tables']['posts']['Insert']
type PostUpdate = Database['public']['Tables']['posts']['Update']

export type PostType = 'announcement' | 'event' | 'general'
export type PostStatus = 'draft' | 'published' | 'scheduled'
export type PostCategory = 'general' | 'wednesday' | 'sunday' | 'bible'

export interface PostRecord extends PostRow {
  id: string
}

export interface CreatePostInput {
  title: string
  content: string
  type: PostType
  category?: PostCategory
  status: PostStatus
  authorEmail?: string | null
  authorName?: string | null
  coverImageUrl?: string | null
  scheduledFor?: string | Date | null
  attachmentUrl?: string | null
  attachmentName?: string | null
}

export interface UpdatePostInput extends CreatePostInput {
  id: string
  publishedAt?: Date | null
  createdAt?: Date | null
}

const createExcerpt = (content: string, maxLength = 140): string => {
  if (!content) return ''
  const clean = content.replace(/\s+/g, ' ').trim()
  if (clean.length <= maxLength) return clean
  return `${clean.slice(0, maxLength).trim()}…`
}

export const postService = {
  async createPost(input: CreatePostInput): Promise<PostRecord | null> {
    const supabase = createSupabaseClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    const postData: PostInsert = {
      title: input.title,
      content: input.content,
      type: input.type,
      category: input.category || 'general',
      status: input.status,
      author_id: user?.id || null,
      author_email: input.authorEmail || user?.email || null,
      author_name: input.authorName || null,
      cover_image_url: input.coverImageUrl || null,
      excerpt: createExcerpt(input.content),
      attachment_url: input.attachmentUrl || null,
      attachment_name: input.attachmentName || null,
      scheduled_for: input.scheduledFor ? new Date(input.scheduledFor).toISOString() : null,
      published_at: input.status === 'published' ? new Date().toISOString() : null
    }

    const { data, error } = await supabase
      .from('posts')
      .insert(postData)
      .select()
      .single()

    if (error) {
      console.error('Error creating post:', error)
      return null
    }

    return data as PostRecord
  },

  async updatePost(input: UpdatePostInput): Promise<PostRecord | null> {
    const supabase = createSupabaseClient()

    const updateData: PostUpdate = {
      title: input.title,
      content: input.content,
      type: input.type,
      category: input.category,
      status: input.status,
      author_email: input.authorEmail,
      author_name: input.authorName,
      cover_image_url: input.coverImageUrl,
      excerpt: createExcerpt(input.content),
      attachment_url: input.attachmentUrl,
      attachment_name: input.attachmentName,
      scheduled_for: input.scheduledFor ? new Date(input.scheduledFor).toISOString() : null,
      published_at: input.status === 'published' && !input.publishedAt
        ? new Date().toISOString()
        : input.publishedAt?.toISOString() || null
    }

    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', input.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating post:', error)
      return null
    }

    return data as PostRecord
  },

  async deletePost(id: string): Promise<boolean> {
    const supabase = createSupabaseClient()

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting post:', error)
      return false
    }

    return true
  },

  async getPost(id: string): Promise<PostRecord | null> {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching post:', error)
      return null
    }

    return data as PostRecord
  },

  async getPublishedPosts(
    type?: PostType,
    limit = 10
  ): Promise<PostRecord[]> {
    const supabase = createSupabaseClient()

    let query = supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit)

    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching published posts:', error)
      return []
    }

    return (data || []) as PostRecord[]
  },

  async getAllPosts(includesDrafts = false): Promise<PostRecord[]> {
    const supabase = createSupabaseClient()

    let query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (!includesDrafts) {
      query = query.eq('status', 'published')
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching all posts:', error)
      return []
    }

    return (data || []) as PostRecord[]
  },

  async getPostsByCategory(
    category: PostCategory,
    limit = 10
  ): Promise<PostRecord[]> {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('category', category)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching posts by category:', error)
      return []
    }

    return (data || []) as PostRecord[]
  },

  async searchPosts(query: string): Promise<PostRecord[]> {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error searching posts:', error)
      return []
    }

    return (data || []) as PostRecord[]
  },

  async getRecentAnnouncements(limit = 5): Promise<PostRecord[]> {
    return this.getPublishedPosts('announcement', limit)
  },

  async getRecentEvents(limit = 5): Promise<PostRecord[]> {
    return this.getPublishedPosts('event', limit)
  }
}