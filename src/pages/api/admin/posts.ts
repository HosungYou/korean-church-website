import { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore, collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig, 'admin-posts')
const db = getFirestore(app)

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
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: null,
      scheduledFor: null
    }

    if (status === 'published') {
      payload.publishedAt = serverTimestamp()
    }

    if (status === 'scheduled' && scheduledFor) {
      const scheduledDate = new Date(scheduledFor)
      payload.scheduledFor = Timestamp.fromDate(scheduledDate)
    }

    const docRef = await addDoc(collection(db, 'posts'), payload)

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