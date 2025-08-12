import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
// Firebase 비활성화 - localStorage 기반 인증 사용
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Calendar,
  User,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  content: string
  type: 'announcement' | 'event' | 'general'
  status: 'published' | 'draft' | 'scheduled'
  author: string
  publishedAt: Date
  views: number
}

const AdminPostsPage = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<Post[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // 샘플 데이터
  useEffect(() => {
    const samplePosts: Post[] = [
      {
        id: '1',
        title: '2025년도 장로선거도 설문조사 결과',
        content: '장로선거 관련 설문조사 결과를 공지드립니다...',
        type: 'announcement',
        status: 'published',
        author: '관리자',
        publishedAt: new Date('2025-06-05'),
        views: 234
      },
      {
        id: '2',
        title: '담임목사님 신간 안내',
        content: '담임목사님의 새로운 저서가 출간되었습니다...',
        type: 'announcement',
        status: 'published',
        author: '관리자',
        publishedAt: new Date('2025-04-18'),
        views: 156
      },
      {
        id: '3',
        title: '광복 80주년 감사예배',
        content: '광복 80주년을 맞아 특별 감사예배를 드립니다...',
        type: 'event',
        status: 'scheduled',
        author: '관리자',
        publishedAt: new Date('2025-08-15'),
        views: 0
      }
    ]
    setPosts(samplePosts)
  }, [])

  useEffect(() => {
    // localStorage 기반 인증 체크
    const adminLoggedIn = localStorage.getItem('adminLoggedIn')
    const adminUser = localStorage.getItem('adminUser')
    
    if (adminLoggedIn === 'true' && adminUser) {
      setUser(JSON.parse(adminUser))
    } else {
      router.push('/admin/login')
    }
    setLoading(false)
  }, [router])

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || post.type === filterType
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800'
    }
    const labels = {
      published: '게시됨',
      draft: '임시저장',
      scheduled: '예약됨'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const getTypeBadge = (type: string) => {
    const styles = {
      announcement: 'bg-red-100 text-red-800',
      event: 'bg-yellow-100 text-yellow-800',
      general: 'bg-purple-100 text-purple-800'
    }
    const labels = {
      announcement: '공지사항',
      event: '행사',
      general: '일반'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type as keyof typeof styles]}`}>
        {labels[type as keyof typeof labels]}
      </span>
    )
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
        </div>
      </Layout>
    )
  }

  if (!user) {
    return null
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/admin/dashboard" className="mr-4">
                  <ArrowLeft className="w-5 h-5 text-gray-600 hover:text-black transition-colors" />
                </Link>
                <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
                <h1 className="text-xl font-bold text-gray-900 font-korean">게시글 관리</h1>
              </div>
              <Link
                href="/admin/posts/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="font-korean">새 게시글</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* 검색 및 필터 */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="제목이나 내용으로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black font-korean"
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                  >
                    <option value="all">모든 유형</option>
                    <option value="announcement">공지사항</option>
                    <option value="event">행사</option>
                    <option value="general">일반</option>
                  </select>
                </div>
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                  >
                    <option value="all">모든 상태</option>
                    <option value="published">게시됨</option>
                    <option value="draft">임시저장</option>
                    <option value="scheduled">예약됨</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 게시글 목록 */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 font-korean">
                      게시글 목록 ({filteredPosts.length}개)
                    </h3>
                  </div>
                </div>

                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-korean">
                          제목
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-korean">
                          유형
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-korean">
                          상태
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-korean">
                          작성자
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-korean">
                          날짜
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-korean">
                          조회수
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">작업</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-black rounded-full mr-3"></div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 font-korean">
                                  {post.title}
                                </div>
                                <div className="text-sm text-gray-500 font-korean truncate max-w-xs">
                                  {post.content.substring(0, 50)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getTypeBadge(post.type)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(post.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-korean">
                            {post.author}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {post.publishedAt.toLocaleDateString('ko-KR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {post.views}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-indigo-600 hover:text-indigo-900">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default AdminPostsPage