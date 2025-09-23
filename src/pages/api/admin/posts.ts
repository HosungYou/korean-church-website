import { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { initializeApp, getApps, cert } from 'firebase-admin/app'

// Firebase Admin SDK 초기화
if (getApps().length === 0) {
  try {
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')

    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    })
  } catch (error) {
    console.error('Firebase Admin 초기화 오류:', error)
  }
}

const db = getFirestore()

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      title,
      content,
      type,
      status,
      authorEmail,
      authorName,
      coverImageUrl,
      scheduledFor
    } = req.body

    if (!title || !content) {
      return res.status(400).json({ error: '제목과 내용은 필수입니다.' })
    }

    const payload: any = {
      title,
      content,
      type: type || 'announcement',
      status: status || 'draft',
      authorEmail: authorEmail || null,
      authorName: authorName || '관리자',
      coverImageUrl: coverImageUrl?.trim() || null,
      excerpt: createExcerpt(content),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      publishedAt: null,
      scheduledFor: null
    }

    if (status === 'published') {
      payload.publishedAt = FieldValue.serverTimestamp()
    }

    if (status === 'scheduled' && scheduledFor) {
      const scheduledDate = new Date(scheduledFor)
      payload.scheduledFor = scheduledDate
    }

    const docRef = await db.collection('posts').add(payload)

    res.status(201).json({
      success: true,
      id: docRef.id,
      message: '게시글이 성공적으로 생성되었습니다.'
    })
  } catch (error) {
    console.error('게시글 생성 오류:', error)
    res.status(500).json({
      error: '게시글 생성 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    })
  }
}