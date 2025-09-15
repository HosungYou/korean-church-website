import React, { useState, Fragment } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, Menu as MenuIcon, X as XIcon, Home, ChevronRight } from 'lucide-react'

interface NavItem {
  name: string
  href?: string
  dropdown?: NavItem[]
}

interface LayoutProps {
  children: React.ReactNode
}

interface BreadcrumbItem {
  name: string
  href?: string
}

const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = [{ name: 'HOME', href: '/' }]
  
  const pathMap: { [key: string]: string } = {
    'about': '교회안내',
    'philosophy': '목회철학',
    'greeting': '인사말',
    'history': '연혁',
    'ministers': '섬기는분들',
    'service-info': '예배안내',
    'directions': '오시는길',
    'sermons': '설교',
    'sunday': '주일예배',
    'wednesday': '수요예배',
    'friday': '금요철야',
    'special-praise': '특별찬양',
    'education': '교육',
    'infants': '영아부',
    'kindergarten': '유치부',
    'elementary': '초등부',
    'youth': '중고등부',
    'young-adults': '청년부',
    'missions': '선교',
    'domestic': '국내선교',
    'international': '해외선교',
    'new-family': '새가족양육',
    'discipleship': '제자훈련',
    'training': '교육/훈련',
    'news': '교회소식',
    'announcements': '공지사항',
    'bulletin': '주보',
    'gallery': '갤러리',
    'giving': '온라인헌금',
    'korean-school': '한글학교'
  }
  
  let currentPath = ''
  for (const segment of segments) {
    currentPath += `/${segment}`
    if (pathMap[segment]) {
      breadcrumbs.push({ 
        name: pathMap[segment], 
        href: currentPath 
      })
    }
  }
  
  return breadcrumbs
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation('common')
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation: NavItem[] = [
    {
      name: '예배',
      dropdown: [
        { name: '예배 LIVE', href: '/sermons/sunday' },
        { name: '설교', href: '/sermons' },
        { name: '예배안내', href: '/about/service-info' },
      ],
    },
    {
      name: '성장',
      dropdown: [
        { name: '한글학교', href: '/education/korean-school' },
        { name: '교육/훈련', href: '/education/training' },
        { name: '새가족 등록', href: '/new-family-guide' },
      ],
    },
    {
      name: '섬김',
      dropdown: [
        { name: '선교', href: '/missions/domestic' },
        { name: '봉사/행사', href: '/volunteer-events' },
        { name: '교회부서', href: '/church-departments' },
      ],
    },
    {
      name: '미디어',
      dropdown: [
        { name: '영상', href: '/sermons' },
        { name: '갤러리', href: '/news/gallery' },
        { name: '업로드', href: '/news/gallery' },
      ],
    },
    {
      name: '소통',
      dropdown: [
        { name: '교회소식', href: '/news/announcements' },
        { name: '행정서비스', href: '/about/service-info' },
      ],
    },
    {
      name: '교회안내',
      dropdown: [
        { name: 'SCKC 안내', href: '/about' },
        { name: '교회 역사', href: '/about/history' },
        { name: '목회철학', href: '/about/philosophy' },
        { name: '오시는 길', href: '/about/directions' },
        { name: '주보', href: '/news/bulletin' },
      ],
    },
  ]

  const changeLanguage = (lng: string) => {
    router.push(router.pathname, router.asPath, { locale: lng })
  }

  return (
    <div className="min-h-screen bg-white text-black font-english">
      <header className="bg-white/70 sticky top-0 z-50 backdrop-blur-lg border-b border-black/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 justify-between items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <img src="/images/logo.png" alt="Church Logo" className="h-12 w-auto" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-8">
              {navigation.map((item) =>
                item.dropdown ? (
                  <Menu as="div" key={item.name} className="relative">
                    <Menu.Button className="inline-flex items-center px-1 pt-1 text-base font-medium text-black hover:opacity-70 transition-opacity">
                      <span className="font-korean">{item.name}</span>
                      <ChevronDownIcon className="ml-1 h-5 w-5" />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Menu.Items className="absolute -right-4 top-full mt-4 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {item.dropdown.map((subItem) => (
                          <Menu.Item key={subItem.name}>
                            {({ active }) => (
                              <Link
                                href={subItem.href!}
                                className={`${
                                  active ? 'bg-black/5' : ''
                                } block px-4 py-2 text-base text-black/80 font-korean`}
                              >
                                {subItem.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href!}
                    className="px-1 pt-1 text-base font-medium text-black hover:opacity-70 transition-opacity font-korean"
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>

            {/* Language & Mobile Menu */}
            <div className="flex items-center">
              <div className="hidden sm:flex items-center space-x-2 mr-4">
                <button
                  onClick={() => changeLanguage('ko')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md border ${
                    i18n.language === 'ko' ? 'bg-black text-white border-black' : 'text-black border-black/20 hover:bg-black/5'
                  }`}
                >
                  KR
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md border ${
                    i18n.language === 'en' ? 'bg-black text-white border-black' : 'text-black border-black/20 hover:bg-black/5'
                  }`}
                >
                  EN
                </button>
              </div>
              <div className="lg:hidden">
                <button onClick={() => setMobileMenuOpen(true)} className="p-2">
                  <MenuIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <div className="lg:hidden" >
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" onClick={() => setMobileMenuOpen(false)} />
          </Transition.Child>

          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between p-4 border-b">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <img src="/images/logo.png" alt="Church Logo" className="h-10 w-auto" />
              </Link>
              <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700" onClick={() => setMobileMenuOpen(false)}>
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <div key={item.name} className="px-4">
                      {item.dropdown ? (
                        <div>
                          <p className="font-korean font-semibold text-lg py-2">{item.name}</p>
                          <div className="pl-2 border-l border-black/20">
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href!}
                                className="block rounded-lg py-2 pl-4 pr-3 text-base font-korean text-black/80 hover:bg-black/5"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={item.href!}
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-korean font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
                <div className="py-6 px-4 flex items-center space-x-2">
                  <button
                    onClick={() => { changeLanguage('ko'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-1.5 text-sm font-medium rounded-md border ${
                      i18n.language === 'ko' ? 'bg-black text-white border-black' : 'text-black border-black/20 hover:bg-black/5'
                    }`}
                  >
                    한국어
                  </button>
                  <button
                    onClick={() => { changeLanguage('en'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-1.5 text-sm font-medium rounded-md border ${
                      i18n.language === 'en' ? 'bg-black text-white border-black' : 'text-black border-black/20 hover:bg-black/5'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition.Root>

      {/* Breadcrumb Navigation */}
      {router.pathname !== '/' && (
        <nav className="bg-gray-50 border-b border-gray-200 py-3">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 text-sm">
              {getBreadcrumbs(router.pathname).map((crumb, index) => (
                <React.Fragment key={crumb.name}>
                  {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
                  {crumb.href ? (
                    <Link 
                      href={crumb.href} 
                      className="text-gray-600 hover:text-black font-korean transition-colors"
                    >
                      {crumb.name}
                    </Link>
                  ) : (
                    <span className="text-black font-korean font-medium">{crumb.name}</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </nav>
      )}
      
      <main>{children}</main>

      <footer className="bg-white border-t">
        <div className="mx-auto max-w-7xl px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4 font-korean">{t('church_name')}</h3>
              <p className="text-black/70 font-korean">{t('full_address')}</p>
              <p className="text-black/70 mt-2">
                <span className="font-korean">{t('phone')}:</span> {t('phone_number')}
              </p>
              <p className="text-black/70">
                <span className="font-korean">{t('email')}:</span> {t('email_address')}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 font-korean">{t('service_times')}</h3>
              <p className="text-black/70 font-korean">{t('sunday')}: 11:00 AM</p>
              <p className="text-black/70 font-korean">{t('wednesday')}: 7:30 PM</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 font-korean">바로가기</h3>
              <div className="flex flex-col space-y-2">
                <Link href="/about/greeting" className="text-black/70 hover:text-black font-korean">교회안내</Link>
                <Link href="/sermons/sunday" className="text-black/70 hover:text-black font-korean">말씀/찬양</Link>
                <Link href="/news/announcements" className="text-black/70 hover:text-black font-korean">교회소식</Link>
                <Link href="/giving" className="text-black/70 hover:text-black font-korean">온라인헌금</Link>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-black/10 pt-8 text-center">
            <p className="text-black/50 text-sm">
              © {new Date().getFullYear()} {t('church_name')}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
