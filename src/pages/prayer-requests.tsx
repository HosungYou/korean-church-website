import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import { useState, useEffect } from 'react'
import { 
  signInWithPopup, 
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
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

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
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error('Error signing in:', error)
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
    if (window.confirm(t('prayer-requests:delete_confirm'))) {
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
        {/* Authentication Section */}
        {!user ? (
          <div className="text-center py-12">
            <p className={`text-lg text-gray-600 mb-6 ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              {t('prayer-requests:login_required')}
            </p>
            <button
              onClick={signInWithGoogle}
              className={`inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t('prayer-requests:login_with_google')}
            </button>
          </div>
        ) : (
          <>
            {/* User Info and Actions */}
            <div className="flex justify-between items-center mb-8">
              <div className={`text-lg ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {user.displayName} {t('prayer-requests:welcome')}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowForm(true)
                    setEditingRequest(null)
                    setFormData({ title: '', content: '' })
                  }}
                  className={`px-4 py-2 bg-church-primary hover:bg-church-secondary text-white rounded-lg transition-colors ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}
                >
                  {t('prayer-requests:write_request')}
                </button>
                <button
                  onClick={handleSignOut}
                  className={`px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}
                >
                  {t('prayer-requests:logout')}
                </button>
              </div>
            </div>

            {/* Form */}
            {showForm && (
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
                      {canEdit(request) && (
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
                    {canReply() && (
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

                    {!canReply() && (
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
          </>
        )}
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