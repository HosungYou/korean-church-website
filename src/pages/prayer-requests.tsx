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
  const [pendingFormShow, setPendingFormShow] = useState(false)
  const [authInitialized, setAuthInitialized] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Pastor's email for reply permissions
  const PASTOR_EMAIL = 'KyuHongYeon@gmail.com'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('🔄 Auth state changed - user:', !!currentUser);
      setUser(currentUser);
      setLoading(false);
      setAuthInitialized(true);
    });

    return () => unsubscribe();
  }, []);

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
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle the user state update
    } catch (error) {
      console.error('Google sign-in popup error:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

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
      setPendingFormShow(false)
    } catch (error) {
      console.error('Error submitting request:', error)
    }
  }

  const handleEdit = (request: PrayerRequest) => {
    setEditingRequest(request)
    setFormData({ title: request.title, content: request.content })
    setShowForm(true)
    setPendingFormShow(false) // Clear any pending form show
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
    console.log('🔥 handleWriteClick called - user:', !!user, 'showForm:', showForm)
    
    // Always show the form - it will handle login internally if needed
    setShowForm(true)
    setEditingRequest(null)
    setFormData({ title: '', content: '' })
    setPendingFormShow(false)
    
    console.log('✅ Form should now be visible (will show login prompt if no user)')
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

        {/* Form - Always render when showForm is true, show login prompt if no user */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            {!user ? (
              // Login prompt when no user but form is requested
              <div className="text-center py-8">
                <h3 className={`text-xl font-bold mb-4 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('prayer-requests:login_required')}
                </h3>
                <p className={`text-gray-600 mb-6 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('prayer-requests:login_to_write')}
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={signInWithGoogle}
                    disabled={isLoggingIn}
                    className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}
                  >
                    {isLoggingIn ? t('prayer-requests:logging_in') : t('prayer-requests:login_with_google')}
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false)
                      setPendingFormShow(false)
                    }}
                    className={`px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}
                  >
                    {t('prayer-requests:cancel')}
                  </button>
                </div>
              </div>
            ) : (
              // Actual form when user is authenticated
              <>
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
                    setPendingFormShow(false)
                  }}
                  className={`px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}
                >
                  {t('prayer-requests:cancel')}
                </button>
              </div>
                </form>
              </>
            )}
          </div>
        )}

        {/* Prayer Requests List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Table Header */}
          <div className="bg-church-primary text-white p-4">
            <h2 className={`text-xl font-bold ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              {t('prayer-requests:page_title')} {t('common:list')}
            </h2>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-12">
              <p className={`text-gray-500 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('prayer-requests:no_requests')}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        i18n.language === 'ko' ? 'font-korean' : 'font-english'
                      }`}>
                        {t('prayer-requests:title')}
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        i18n.language === 'ko' ? 'font-korean' : 'font-english'
                      }`}>
                        {t('prayer-requests:author')}
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        i18n.language === 'ko' ? 'font-korean' : 'font-english'
                      }`}>
                        {t('prayer-requests:date')}
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        i18n.language === 'ko' ? 'font-korean' : 'font-english'
                      }`}>
                        {t('prayer-requests:replies')}
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('prayer-requests:actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requests.map((request, index) => (
                      <tr key={request.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => {
                        const element = document.getElementById(`request-${request.id}`)
                        element?.scrollIntoView({ behavior: 'smooth' })
                      }}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div>
                              <div className={`text-sm font-medium text-gray-900 truncate max-w-xs ${
                                i18n.language === 'ko' ? 'font-korean' : 'font-english'
                              }`}>
                                {request.title}
                              </div>
                              <div className={`text-sm text-gray-500 truncate max-w-xs ${
                                i18n.language === 'ko' ? 'font-korean' : 'font-english'
                              }`}>
                                {request.content.substring(0, 50)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm text-gray-900 ${
                            i18n.language === 'ko' ? 'font-korean' : 'font-english'
                          }`}>
                            {request.author}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm text-gray-500 ${
                            i18n.language === 'ko' ? 'font-korean' : 'font-english'
                          }`}>
                            {formatDate(request.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {request.replies?.length || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {user && canEdit(request) && (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEdit(request)
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                {t('prayer-requests:edit')}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDelete(request.id)
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                {t('prayer-requests:delete')}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden">
                {requests.map((request) => (
                  <div key={request.id} className="border-b border-gray-200 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-medium text-gray-900 ${
                        i18n.language === 'ko' ? 'font-korean' : 'font-english'
                      }`}>
                        {request.title}
                      </h3>
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
                    <p className={`text-sm text-gray-600 mb-2 ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
                      {request.content.substring(0, 100)}...
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span className={i18n.language === 'ko' ? 'font-korean' : 'font-english'}>
                        {request.author}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className={i18n.language === 'ko' ? 'font-korean' : 'font-english'}>
                          {formatDate(request.createdAt)}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {t('prayer-requests:replies')} {request.replies?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Detailed Prayer Requests */}
        {requests.length > 0 && (
          <div className="space-y-6 mt-8">
            <h3 className={`text-xl font-bold text-gray-900 mb-6 ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              {t('prayer-requests:detailed_view')}
            </h3>
            {requests.map((request) => (
            <div key={request.id} id={`request-${request.id}`} className="bg-white rounded-lg shadow-md p-6">
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
            ))}
          </div>
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