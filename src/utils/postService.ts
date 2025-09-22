import { db } from '../../lib/firebase'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  limit as limitQuery
} from 'firebase/firestore'
import type { DocumentData } from 'firebase/firestore'

export type PostType = 'announcement' | 'event' | 'general'
export type PostStatus = 'draft' | 'published' | 'scheduled'

export interface PostRecord {
  id: string
  title: string
  content: string
  type: PostType
  status: PostStatus
  authorEmail: string | null
  authorName: string | null
  coverImageUrl?: string | null
  excerpt?: string | null
  createdAt?: Date | null
  updatedAt?: Date | null
  publishedAt?: Date | null
  scheduledFor?: Date | null
}

export interface CreatePostInput {
  title: string
  content: string
  type: PostType
  status: PostStatus
  authorEmail?: string | null
  authorName?: string | null
  coverImageUrl?: string | null
  scheduledFor?: string | Date | null
}

export interface UpdatePostInput extends CreatePostInput {
  id: string
  publishedAt?: Date | null
  createdAt?: Date | null
}

const POSTS_COLLECTION = 'posts'

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

const toDate = (value: any): Date | null => {
  if (!value) {
    return null
  }
  if (value instanceof Date) {
    return value
  }
  if (value instanceof Timestamp) {
    return value.toDate()
  }
  if (typeof value.toDate === 'function') {
    return value.toDate()
  }
  return new Date(value)
}

const mapPostDoc = (snapshot: any): PostRecord => {
  const data = snapshot.data()

  return {
    id: snapshot.id,
    title: data.title ?? '',
    content: data.content ?? '',
    type: (data.type ?? 'announcement') as PostType,
    status: (data.status ?? 'draft') as PostStatus,
    authorEmail: data.authorEmail ?? null,
    authorName: data.authorName ?? null,
    coverImageUrl: data.coverImageUrl ?? null,
    excerpt: data.excerpt ?? null,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    publishedAt: toDate(data.publishedAt),
    scheduledFor: toDate(data.scheduledFor)
  }
}

export const createPost = async (input: CreatePostInput): Promise<string> => {
  const collectionRef = collection(db, POSTS_COLLECTION)
  const payload: DocumentData = {
    title: input.title,
    content: input.content,
    type: input.type,
    status: input.status,
    authorEmail: input.authorEmail ?? null,
    authorName: input.authorName ?? null,
    coverImageUrl: input.coverImageUrl?.trim() || null,
    excerpt: createExcerpt(input.content),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: null,
    scheduledFor: null
  }

  if (input.status === 'published') {
    payload.publishedAt = serverTimestamp()
  }

  if (input.status === 'scheduled' && input.scheduledFor) {
    const scheduledDate = new Date(input.scheduledFor)
    payload.scheduledFor = Timestamp.fromDate(scheduledDate)
  }

  const docRef = await addDoc(collectionRef, payload)
  return docRef.id
}

export const updatePost = async (input: UpdatePostInput): Promise<void> => {
  const docRef = doc(db, POSTS_COLLECTION, input.id)
  const existingSnapshot = await getDoc(docRef)
  if (!existingSnapshot.exists()) {
    throw new Error('게시글을 찾을 수 없습니다.')
  }

  const existing = mapPostDoc(existingSnapshot)
  const payload: DocumentData = {
    title: input.title,
    content: input.content,
    type: input.type,
    status: input.status,
    authorEmail: input.authorEmail ?? existing.authorEmail ?? null,
    authorName: input.authorName ?? existing.authorName ?? null,
    coverImageUrl: input.coverImageUrl?.trim() || null,
    excerpt: createExcerpt(input.content),
    updatedAt: serverTimestamp(),
    publishedAt: existing.publishedAt ? Timestamp.fromDate(existing.publishedAt) : null,
    scheduledFor: null
  }

  if (input.status === 'published') {
    payload.publishedAt = existing.publishedAt
      ? Timestamp.fromDate(existing.publishedAt)
      : serverTimestamp()
    payload.scheduledFor = null
  } else if (input.status === 'scheduled' && input.scheduledFor) {
    payload.scheduledFor = Timestamp.fromDate(new Date(input.scheduledFor))
    payload.publishedAt = null
  } else {
    payload.publishedAt = null
    payload.scheduledFor = null
  }

  await updateDoc(docRef, payload)
}

export const deletePost = async (id: string): Promise<void> => {
  const docRef = doc(db, POSTS_COLLECTION, id)
  await deleteDoc(docRef)
}

export const getPostById = async (id: string): Promise<PostRecord | null> => {
  const docRef = doc(db, POSTS_COLLECTION, id)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) {
    return null
  }
  return mapPostDoc(snapshot)
}

interface GetPostsOptions {
  limit?: number
}

export const getPosts = async (options?: GetPostsOptions): Promise<PostRecord[]> => {
  const constraints: any[] = [orderBy('createdAt', 'desc')]
  if (options?.limit) {
    constraints.push(limitQuery(options.limit))
  }

  const q = query(collection(db, POSTS_COLLECTION), ...constraints)
  const snapshot = await getDocs(q)
  return snapshot.docs.map(mapPostDoc)
}

export const getPublishedAnnouncements = async (limit = 20): Promise<PostRecord[]> => {
  const posts = await getPosts({ limit: limit * 2 })
  return posts
    .filter((post) => post.type === 'announcement' && post.status === 'published')
    .slice(0, limit)
}

export const getRecentPublishedPosts = async (limit = 6): Promise<PostRecord[]> => {
  const posts = await getPosts({ limit: limit * 2 })
  return posts
    .filter((post) => post.status === 'published')
    .slice(0, limit)
}
