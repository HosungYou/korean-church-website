import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import { useState, useEffect } from 'react'
import { 
  signInWithRedirect, 
  signInWithPopup,
  getRedirectResult,
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth'
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  updateDoc,
  arrayUnion,
  serverTimestamp
} from 'firebase/firestore'
import { auth, db } from '../../lib/firebase'

interface PrayerRequest {
  id: string
  title: string
  content: string
  author: string
  authorEmail: string
  createdAt: any
  replies?: Reply[]
}

interface Reply {
  id: string
  content: string
  author: string
  authorEmail: string
  createdAt: any
}

const PrayerRequests: NextPage = () => {
  const { t, i18n } = useTranslation(['prayer-requests', 'common'])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [requests, setRequests] = useState<PrayerRequest[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingRequest, setEditingRequest] = useState<PrayerRequest | null>(null)
  const [formData, setFormData] = useState({ title: '', content: '' })
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({})

  // Pastor's email for reply permissions
  const PASTOR_EMAIL = 'KyuHongYeon@gmail.com'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const wasLoggedOut = !user && !loading
      setUser(user)
      setLoading(false)
      
      // If user just logged in and was previously logged out, show the form
      if (user && wasLoggedOut) {
        setTimeout(() => {
          setShowForm(true)
          setEditingRequest(null)
          setFormData({ title: '', content: '' })
        }, 100) // Small delay to ensure UI is stable
      }
    })

    // Check for redirect result on page load
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user)
          // Show form after successful redirect login
          setTimeout(() => {
            setShowForm(true)
            setEditingRequest(null)
            setFormData({ title: '', content: '' })
          }, 100)
        }
      })
      .catch((error) => {
        console.error('Redirect result error:', error)
      })

    return () => unsubscribe()
  }, [loading])

  useEffect(() => {
    const q = query(collection(db, 'prayerRequests'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PrayerRequest[]
      setRequests(requestsData)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({
      prompt: 'select_account'
    })
    
    try {
      // Try popup first, fallback to redirect if needed
      const result = await signInWithPopup(auth, provider)
      if (result?.user) {
        // Popup login successful, user state will be updated via onAuthStateChanged
        return result
      }
    } catch (error: any) {
      console.error('Popup failed, trying redirect:', error)
      // Only try redirect if popup was blocked or failed
      if (error?.code === 'auth/popup-blocked' || error?.code === 'auth/popup-closed-by-user') {
        try {
          // Fallback to redirect method
          await signInWithRedirect(auth, provider)
        } catch (redirectError) {
          console.error('Redirect also failed:', redirectError)
          throw redirectError
        }
      } else {
        throw error
      }
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formData.title.trim() || !formData.content.trim()) return

    try {
      if (editingRequest) {
        await updateDoc(doc(db, 'prayerRequests', editingRequest.id), {
          title: formData.title,
          content: formData.content,
          updatedAt: serverTimestamp()
        })
      } else {
        await addDoc(collection(db, 'prayerRequests'), {
          title: formData.title,
          content: formData.content,
          author: user.displayName || 'Anonymous',
          authorEmail: user.email,
          createdAt: serverTimestamp(),
          replies: []
        })
      }
      
      setFormData({ title: '', content: '' })
      setShowForm(false)
      setEditingRequest(null)
    } catch (error) {
      console.error('Error submitting request:', error)
    }
  }

  const handleEdit = (request: PrayerRequest) => {
    setEditingRequest(request)
    setFormData({ title: request.title, content: request.content })
    setShowForm(true)
  }

  const handleDelete = async (requestId: string) => {
    if (window.confirm(t('prayer-requests:delete_confirm') as string)) {
      try {
        await deleteDoc(doc(db, 'prayerRequests', requestId))
      } catch (error) {
        console.error('Error deleting request:', error)
      }
    }
  }

  const handleReply = async (requestId: string) => {
    const content = replyContent[requestId]
    if (!content?.trim() || !user) return

    try {
      const reply = {
        id: Date.now().toString(),
        content,
        author: user.displayName || 'Anonymous',
        authorEmail: user.email,
        createdAt: new Date()
      }

      await updateDoc(doc(db, 'prayerRequests', requestId), {
        replies: arrayUnion(reply)
      })

      setReplyContent({ ...replyContent, [requestId]: '' })
    } catch (error) {
      console.error('Error posting reply:', error)
    }
  }

  const canEdit = (request: PrayerRequest) => {
    return user?.email === request.authorEmail
  }

  const canReply = () => {
    return user?.email === PASTOR_EMAIL
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return ''
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString(i18n.language === 'ko' ? 'ko-KR' : 'en-US')
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">{t('prayer-requests:loading')}</div>
        </div>
      </Layout>
    )
  }

  const handleWriteClick = async () => {
    if (!user) {
      try {
        await signInWithGoogle()
        // Don't show form immediately after login attempt
        // The form will be shown in useEffect after successful auth
        return
      } catch (error) {
        console.error('Login failed:', error)
        return
      }
    }
    // Only show form if user is already authenticated
    setShowForm(true)
    setEditingRequest(null)
    setFormData({ title: '', content: '' })
  }

  return (
    <Layout>
      {/* Header Section */}
      <section className="bg-gradient-to-br from-church-primary to-church-secondary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className={`text-4xl font-bold text-white text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('prayer-requests:page_title')}
          </h1>
          <p className={`mt-4 text-xl text-gray-100 text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('prayer-requests:subtitle')}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Toolbar Section */}
        <div className="flex justify-between items-center mb-8">
          <div className={`text-lg ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {user ? (
              <>
                {user.displayName} {t('prayer-requests:welcome')}
              </>
            ) : (
              <span className="text-gray-600">{t('prayer-requests:guest_mode')}</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleWriteClick}
              className={`px-4 py-2 bg-church-primary hover:bg-church-secondary text-white rounded-lg transition-colors ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}
            >
              {t('prayer-requests:write_request')}
            </button>
            {user && (
              <button
                onClick={handleSignOut}
                className={`px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}
              >
                {t('prayer-requests:logout')}
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        {showForm && user && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className={`text-xl font-bold mb-4 ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              {editingRequest ? t('prayer-requests:edit_request') : t('prayer-requests:write_request')}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder={t('prayer-requests:title_placeholder') as string}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-primary focus:border-transparent ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}
                required
              />
              <textarea
                placeholder={t('prayer-requests:content_placeholder') as string}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-primary focus:border-transparent ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}
                required
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className={`px-6 py-2 bg-church-primary hover:bg-church-secondary text-white rounded-lg transition-colors ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}
                >
                  {editingRequest ? t('prayer-requests:update') : t('prayer-requests:submit')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingRequest(null)
                    setFormData({ title: '', content: '' })
                  }}
                  className={`px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}
                >
                  {t('prayer-requests:cancel')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Prayer Requests List */}
        <div className="space-y-6">
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <p className={`text-gray-500 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('prayer-requests:no_requests')}
              </p>
            </div>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={`text-xl font-bold text-gray-900 mb-2 ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
                      {request.title}
                    </h3>
                    <p className={`text-sm text-gray-500 ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
                      {request.author} • {formatDate(request.createdAt)}
                    </p>
                  </div>
                  {user && canEdit(request) && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(request)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {t('prayer-requests:edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(request.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        {t('prayer-requests:delete')}
                      </button>
                    </div>
                  )}
                </div>
                
                <p className={`text-gray-700 mb-4 whitespace-pre-wrap ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {request.content}
                </p>

                {/* Replies */}
                {request.replies && request.replies.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    {request.replies.map((reply) => (
                      <div key={reply.id} className="bg-blue-50 rounded-lg p-4 mb-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`font-medium text-blue-800 ${
                            i18n.language === 'ko' ? 'font-korean' : 'font-english'
                          }`}>
                            {reply.author}
                          </span>
                          <span className="text-xs text-blue-600">
                            {formatDate(reply.createdAt)}
                          </span>
                        </div>
                        <p className={`text-blue-700 whitespace-pre-wrap ${
                          i18n.language === 'ko' ? 'font-korean' : 'font-english'
                        }`}>
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                {user && canReply() && (
                  <div className="border-t pt-4 mt-4">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder={t('prayer-requests:reply_placeholder') as string}
                        value={replyContent[request.id] || ''}
                        onChange={(e) => setReplyContent({
                          ...replyContent,
                          [request.id]: e.target.value
                        })}
                        className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-primary focus:border-transparent ${
                          i18n.language === 'ko' ? 'font-korean' : 'font-english'
                        }`}
                      />
                      <button
                        onClick={() => handleReply(request.id)}
                        className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${
                          i18n.language === 'ko' ? 'font-korean' : 'font-english'
                        }`}
                      >
                        {t('prayer-requests:post_reply')}
                      </button>
                    </div>
                  </div>
                )}

                {!user && (
                  <div className="border-t pt-4 mt-4">
                    <p className={`text-sm text-gray-500 italic ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
                      {t('prayer-requests:login_to_reply')}
                    </p>
                  </div>
                )}

                {user && !canReply() && (
                  <div className="border-t pt-4 mt-4">
                    <p className={`text-sm text-gray-500 italic ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
                      {t('prayer-requests:pastor_only')}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common', 'prayer-requests'])),
    },
  }
}

export default PrayerRequests