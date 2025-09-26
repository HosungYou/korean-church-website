import { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore } from 'firebase-admin/firestore'
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { category } = req.query

    // Firestore에서 자료실 카테고리만 가져오기
    const postsRef = db.collection('posts')
    let query = postsRef
      .where('status', '==', 'published')
      .where('category', 'in', ['wednesday', 'sunday', 'bible']) // 자료실 카테고리만

    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get()

    let posts = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        type: data.type,
        category: data.category,
        excerpt: data.excerpt,
        coverImageUrl: data.coverImageUrl,
        attachments: data.attachments || [],
        important: data.type === 'announcement' && data.important,
        publishedAt: data.publishedAt?.toDate?.()?.toISOString() ||
                     data.createdAt?.toDate?.()?.toISOString() ||
                     new Date().toISOString(),
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      }
    })

    // 클라이언트에서 요청한 특정 카테고리 필터링
    if (category && category !== 'all') {
      posts = posts.filter(post => post.category === category)
    }

    res.status(200).json({ posts })
  } catch (error) {
    console.error('자료실 게시글 조회 오류:', error)
    res.status(500).json({
      error: '자료실을 가져오는 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    })
  }
}