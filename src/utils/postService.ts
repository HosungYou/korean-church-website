import { supabase } from '../../lib/supabase'

export type PostType = 'announcement' | 'event' | 'general'
export type PostStatus = 'draft' | 'published' | 'scheduled'
export type PostCategory = 'general' | 'wednesday' | 'sunday' | 'bible'

export interface PostRecord {
  id: string
  title: string
  content: string
  type: PostType
  category?: PostCategory
  status: PostStatus
  authorEmail: string | null
  authorName: string | null
  coverImageUrl?: string | null
  excerpt?: string | null
  createdAt?: Date | null
  updatedAt?: Date | null
  publishedAt?: Date | null
  scheduledFor?: Date | null
  attachmentUrl?: string | null
  attachmentName?: string | null
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

const createExcerpt = (raw: string, maxLength = 140): string => {
  if (!raw) {
    return ''
  }
  const clean = raw.replace(/\s+/g, ' ').trim()
  if (clean.length <= maxLength) {
    return clean
  }
  return `${clean.slice(0, maxLength).trim()}…`
}

const toDate = (value: string | null | undefined): Date | null => {
  if (!value) return null
  return new Date(value)
}

// Map database row to PostRecord
const mapPostRow = (row: any): PostRecord => ({
  id: row.id,
  title: row.title ?? '',
  content: row.content ?? '',
  type: (row.type ?? 'announcement') as PostType,
  category: (row.category ?? 'general') as PostCategory,
  status: (row.status ?? 'draft') as PostStatus,
  authorEmail: row.author_email ?? null,
  authorName: row.author_name ?? null,
  coverImageUrl: row.cover_image_url ?? null,
  attachmentUrl: row.attachment_url ?? null,
  attachmentName: row.attachment_name ?? null,
  excerpt: row.excerpt ?? null,
  createdAt: toDate(row.created_at),
  updatedAt: toDate(row.updated_at),
  publishedAt: toDate(row.published_at),
  scheduledFor: toDate(row.scheduled_for)
})

export const createPost = async (input: CreatePostInput): Promise<string> => {
  const payload: any = {
    title: input.title,
    content: input.content,
    type: input.type,
    category: input.category ?? 'general',
    status: input.status,
    author_email: input.authorEmail ?? null,
    author_name: input.authorName ?? null,
    cover_image_url: input.coverImageUrl?.trim() || null,
    attachment_url: input.attachmentUrl?.trim() || null,
    attachment_name: input.attachmentName?.trim() || null,
    excerpt: createExcerpt(input.content),
    published_at: null,
    scheduled_for: null
  }

  if (input.status === 'published') {
    payload.published_at = new Date().toISOString()
  }

  if (input.status === 'scheduled' && input.scheduledFor) {
    payload.scheduled_for = new Date(input.scheduledFor).toISOString()
  }

  const { data, error } = await (supabase
    .from('posts') as any)
    .insert(payload)
    .select('id')
    .single()

  if (error) {
    console.error('Create post error:', error)
    throw new Error('게시글 생성에 실패했습니다.')
  }

  return data.id
}

export const updatePost = async (input: UpdatePostInput): Promise<void> => {
  // First, get existing post
  const { data: existing, error: fetchError } = await (supabase
    .from('posts') as any)
    .select('*')
    .eq('id', input.id)
    .single()

  if (fetchError || !existing) {
    throw new Error('게시글을 찾을 수 없습니다.')
  }

  const payload: any = {
    title: input.title,
    content: input.content,
    type: input.type,
    category: input.category ?? existing.category ?? 'general',
    status: input.status,
    author_email: input.authorEmail ?? existing.author_email ?? null,
    author_name: input.authorName ?? existing.author_name ?? null,
    cover_image_url: input.coverImageUrl?.trim() || null,
    attachment_url: input.attachmentUrl?.trim() || null,
    attachment_name: input.attachmentName?.trim() || null,
    excerpt: createExcerpt(input.content),
    published_at: existing.published_at,
    scheduled_for: null
  }

  if (input.status === 'published') {
    payload.published_at = existing.published_at || new Date().toISOString()
    payload.scheduled_for = null
  } else if (input.status === 'scheduled' && input.scheduledFor) {
    payload.scheduled_for = new Date(input.scheduledFor).toISOString()
    payload.published_at = null
  } else {
    payload.published_at = null
    payload.scheduled_for = null
  }

  const { error } = await (supabase
    .from('posts') as any)
    .update(payload)
    .eq('id', input.id)

  if (error) {
    console.error('Update post error:', error)
    throw new Error('게시글 수정에 실패했습니다.')
  }
}

export const deletePost = async (id: string): Promise<void> => {
  const { error } = await (supabase
    .from('posts') as any)
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Delete post error:', error)
    throw new Error('게시글 삭제에 실패했습니다.')
  }
}

export const getPostById = async (id: string): Promise<PostRecord | null> => {
  const { data, error } = await (supabase
    .from('posts') as any)
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return mapPostRow(data)
}

interface GetPostsOptions {
  limit?: number
}

export const getPosts = async (options?: GetPostsOptions): Promise<PostRecord[]> => {
  let query = (supabase
    .from('posts') as any)
    .select('*')
    .order('created_at', { ascending: false })

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Get posts error:', error)
    return []
  }

  return (data || []).map(mapPostRow)
}

export const getPublishedAnnouncements = async (limit = 20): Promise<PostRecord[]> => {
  const { data, error } = await (supabase
    .from('posts') as any)
    .select('*')
    .eq('type', 'announcement')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Get announcements error:', error)
    return []
  }

  return (data || []).map(mapPostRow)
}

export const getRecentPublishedPosts = async (limit = 6): Promise<PostRecord[]> => {
  const { data, error } = await (supabase
    .from('posts') as any)
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Get recent posts error:', error)
    return []
  }

  return (data || []).map(mapPostRow)
}
