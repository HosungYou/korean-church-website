import type { NextApiRequest, NextApiResponse } from 'next'
import { adminAuth } from '../../../../lib/firebaseAdmin'

const API_SECRET = process.env.ADMIN_API_SECRET

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  if (!API_SECRET) {
    return res.status(500).json({ error: 'Admin API secret is not configured.' })
  }

  const authHeader = req.headers.authorization ?? ''
  const token = authHeader.replace('Bearer ', '')

  if (token !== API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { email, uid, role = 'admin' } = req.body as {
    email?: string
    uid?: string
    role?: string
  }

  if (!email && !uid) {
    return res.status(400).json({ error: 'Either email or uid must be provided.' })
  }

  try {
    const userRecord = uid
      ? await adminAuth.getUser(uid)
      : await adminAuth.getUserByEmail(email as string)

    await adminAuth.setCustomUserClaims(userRecord.uid, {
      ...(userRecord.customClaims ?? {}),
      role,
    })

    return res.status(200).json({
      success: true,
      uid: userRecord.uid,
      email: userRecord.email,
      role,
    })
  } catch (error) {
    console.error('Failed to assign custom claim:', error)
    return res.status(500).json({ error: 'Failed to assign custom claim.' })
  }
}

export default handler
