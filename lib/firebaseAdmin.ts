import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const getServiceAccountConfig = () => {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase admin credentials are not fully configured.')
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  }
}

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert(getServiceAccountConfig()),
    })

export const adminAuth = getAuth(app)
export default app
