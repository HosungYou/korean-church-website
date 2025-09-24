import React, { useState, Fragment, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, Menu as MenuIcon, X as XIcon, Home, ChevronRight } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '../../lib/firebase'

interface NavItem {
  labelKey: string
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

const getBreadcrumbs = (pathname: string, translate: (key: string) => string): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = [{ name: translate('breadcrumbs.home'), href: '/' }]

  const pathMap: { [key: string]: string } = {
    'about': 'about',
    'philosophy': 'philosophy',
    'greeting': 'greeting',
    'history': 'history',
    'ministers': 'ministers',
    'service-info': 'service_info',
    'directions': 'directions',
    'sermons': 'sermons',
    'sermons-live': 'sermons_live',
    'sunday': 'sunday',
    'wednesday': 'wednesday',
    'friday': 'friday',
    'special-praise': 'special_praise',
    'education': 'education',
    'infants': 'infants',
    'kindergarten': 'kindergarten',
    'elementary': 'elementary',
    'youth': 'youth',
    'young-adults': 'young_adults',
    'missions': 'missions',
    'domestic': 'domestic',
    'international': 'international',
    'new-family': 'new_family',
    'discipleship': 'discipleship',
    'training': 'training',
    'news': 'news',
    'announcements': 'announcements',
    'bulletin': 'bulletin',
    'gallery': 'gallery',
    'giving': 'giving',
    'korean-school': 'korean_school'
  }

  let currentPath = ''
  for (const segment of segments) {
    currentPath += `/${segment}`
    if (pathMap[segment]) {
      breadcrumbs.push({ 
        name: translate(`breadcrumbs.${pathMap[segment]}`), 
        href: currentPath 
      })
    }
  }
  
  return breadcrumbs
}

const navigationConfig: NavItem[] = [
  {
    labelKey: 'nav_groups.worship',
    dropdown: [
      { labelKey: 'nav_links.sermons_live', href: '/sermons-live' },
      { labelKey: 'nav_links.sermons', href: '/sermons' },
      { labelKey: 'nav_links.service_info', href: '/about/service-info' },
    ],
  },
  {
    labelKey: 'nav_groups.growth',
    dropdown: [
      { labelKey: 'nav_links.korean_school', href: '/education/korean-school' },
      { labelKey: 'nav_links.training', href: '/education/training' },
      { labelKey: 'nav_links.new_family', href: '/new-family-guide' },
    ],
  },
  {
    labelKey: 'nav_groups.serving',
    dropdown: [
      { labelKey: 'nav_links.missions', href: '/missions/domestic' },
      { labelKey: 'nav_links.volunteer_events', href: '/volunteer-events' },
      { labelKey: 'nav_links.departments', href: '/church-departments' },
    ],
  },
  {
    labelKey: 'nav_groups.media',
    dropdown: [
      { labelKey: 'nav_links.videos', href: '/sermons' },
      { labelKey: 'nav_links.gallery', href: '/news/gallery' },
      { labelKey: 'nav_links.upload', href: '/news/gallery' },
    ],
  },
  {
    labelKey: 'nav_groups.community',
    dropdown: [
      { labelKey: 'nav_links.announcements', href: '/announcements' },
      { labelKey: 'nav_links.resources', href: '/resources' },
    ],
  },
  {
    labelKey: 'nav_groups.about',
    dropdown: [
      { labelKey: 'nav_links.about', href: '/about' },
      { labelKey: 'nav_links.history', href: '/about/history' },
      { labelKey: 'nav_links.philosophy', href: '/about/philosophy' },
      { labelKey: 'nav_links.directions', href: '/about/directions' },
      { labelKey: 'nav_links.bulletin', href: '/news/bulletin' },
    ],
  },
]

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation('common')
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [adminSession, setAdminSession] = useState<{ email?: string; name?: string } | null>(null)
  const fontClass = i18n.language === 'ko' ? 'font-korean' : 'font-english'
  const languageShortLabels: Record<string, string> = {
    ko: t('language.short_ko'),
    en: t('language.short_en'),
  }
  const languageFullLabels: Record<string, string> = {
    ko: t('language.full_ko'),
    en: t('language.full_en'),
  }
  const defaultAdminName = t('admin.default_name')
  const navigationItems = navigationConfig
  const breadcrumbs = useMemo(() => getBreadcrumbs(router.pathname, t), [router.pathname, t])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const syncAdminSession = () => {
      if (typeof window === 'undefined') {
        return
      }

      const loggedIn = window.localStorage.getItem('adminLoggedIn') === 'true'
      if (!loggedIn) {
        setAdminSession(null)
        return
      }

      try {
        const stored = window.localStorage.getItem('adminUser')
        setAdminSession(stored ? JSON.parse(stored) : { name: defaultAdminName })
      } catch (error) {
        console.error('Failed to read admin session:', error)
        setAdminSession({ name: defaultAdminName })
      }
    }

    syncAdminSession()

    const handleAuthChange = () => syncAdminSession()

    window.addEventListener('storage', handleAuthChange)
    window.addEventListener('admin-auth-changed', handleAuthChange)

    return () => {
      window.removeEventListener('storage', handleAuthChange)
      window.removeEventListener('admin-auth-changed', handleAuthChange)
    }
  }, [defaultAdminName])

  const handleAdminNavigate = () => {
    router.push(adminSession ? '/admin/dashboard' : '/admin/login')
  }

  const handleAdminLogout = async () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('adminLoggedIn')
      window.localStorage.removeItem('adminUser')
      window.dispatchEvent(new Event('admin-auth-changed'))
    }

    setAdminSession(null)

    try {
      await signOut(auth)
    } catch (error) {
      console.error('Failed to sign out from Firebase:', error)
    }

    router.push('/').catch((error) => console.error('Failed to redirect after logout:', error))
  }

  const handleMobileAdminNavigate = () => {
    setMobileMenuOpen(false)
    handleAdminNavigate()
  }

  const handleMobileAdminLogout = async () => {
    setMobileMenuOpen(false)
    await handleAdminLogout()
  }

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
                <div className="relative h-12 w-32">
                  <Image
                    src="/images/logo.png"
                    alt="Church Logo"
                    fill
                    priority
                    className="object-contain"
                    sizes="128px"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-8">
              {navigationItems.map((item) =>
                item.dropdown ? (
                  <Menu as="div" key={item.labelKey} className="relative">
                    <Menu.Button className={`inline-flex items-center px-1 pt-1 text-base font-medium text-black hover:opacity-70 transition-opacity ${fontClass}`}>
                      <span>{t(item.labelKey)}</span>
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
                          <Menu.Item key={subItem.labelKey}>
                            {({ active }) => (
                              <Link
                                href={subItem.href!}
                                className={`${
                                  active ? 'bg-black/5' : ''
                                } block px-4 py-2 text-base text-black/80 ${fontClass}`}
                              >
                                {t(subItem.labelKey)}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <Link
                    key={item.labelKey}
                    href={item.href!}
                    className={`px-1 pt-1 text-base font-medium text-black hover:opacity-70 transition-opacity ${fontClass}`}
                  >
                    {t(item.labelKey)}
                  </Link>
                )
              )}
            </div>

            {/* Admin / Language / Mobile Menu */}
            <div className="flex items-center">
              <div className="hidden lg:flex items-center space-x-3 mr-4">
                {adminSession ? (
                  <>
                    <button
                      onClick={handleAdminNavigate}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md border border-black/20 text-black hover:bg-black hover:text-white transition-colors ${fontClass}`}
                    >
                      {t('admin.dashboard')}
                    </button>
                    <button
                      onClick={handleAdminLogout}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md border border-black/20 text-black hover:bg-black hover:text-white transition-colors ${fontClass}`}
                    >
                      {t('admin.logout')}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleAdminNavigate}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md border border-black/20 text-black hover:bg-black hover:text-white transition-colors ${fontClass}`}
                  >
                    {t('admin.login')}
                  </button>
                )}
              </div>
              <div className="hidden sm:flex items-center space-x-2 mr-4">
                <button
                  onClick={() => changeLanguage('ko')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md border ${
                    i18n.language === 'ko' ? 'bg-black text-white border-black' : 'text-black border-black/20 hover:bg-black/5'
                  } ${fontClass}`}
                >
                  {languageShortLabels.ko}
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md border ${
                    i18n.language === 'en' ? 'bg-black text-white border-black' : 'text-black border-black/20 hover:bg-black/5'
                  } ${fontClass}`}
                >
                  {languageShortLabels.en}
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
                <div className="relative h-10 w-28">
                  <Image
                    src="/images/logo.png"
                    alt="Church Logo"
                    fill
                    className="object-contain"
                    sizes="112px"
                  />
                </div>
              </Link>
              <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700" onClick={() => setMobileMenuOpen(false)}>
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigationItems.map((item) => (
                    <div key={item.labelKey} className="px-4">
                      {item.dropdown ? (
                        <div>
                          <p className={`${fontClass} font-semibold text-lg py-2`}>{t(item.labelKey)}</p>
                          <div className="pl-2 border-l border-black/20">
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.labelKey}
                                href={subItem.href!}
                                className={`block rounded-lg py-2 pl-4 pr-3 text-base ${fontClass} text-black/80 hover:bg-black/5`}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {t(subItem.labelKey)}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={item.href!}
                          className={`-mx-3 block rounded-lg px-3 py-2.5 text-base ${fontClass} font-semibold leading-7 text-gray-900 hover:bg-gray-50`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {t(item.labelKey)}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
                <div className="px-4 py-6 space-y-3">
                  {adminSession ? (
                    <>
                      <button
                        onClick={handleMobileAdminNavigate}
                        className={`w-full px-4 py-2 rounded-md border border-black/20 text-left ${fontClass} text-black hover:bg-black hover:text-white transition-colors`}
                      >
                        {t('admin.dashboard')}
                      </button>
                      <button
                        onClick={handleMobileAdminLogout}
                        className={`w-full px-4 py-2 rounded-md border border-black/20 text-left ${fontClass} text-black hover:bg-black hover:text-white transition-colors`}
                      >
                        {t('admin.logout')}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleMobileAdminNavigate}
                      className={`w-full px-4 py-2 rounded-md border border-black/20 text-left ${fontClass} text-black hover:bg-black hover:text-white transition-colors`}
                    >
                      {t('admin.login')}
                    </button>
                  )}
                </div>
                <div className="py-6 px-4 flex items-center space-x-2">
                  <button
                    onClick={() => { changeLanguage('ko'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-1.5 text-sm font-medium rounded-md border ${
                      i18n.language === 'ko' ? 'bg-black text-white border-black' : 'text-black border-black/20 hover:bg-black/5'
                    } ${fontClass}`}
                  >
                    {languageFullLabels.ko}
                  </button>
                  <button
                    onClick={() => { changeLanguage('en'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-1.5 text-sm font-medium rounded-md border ${
                      i18n.language === 'en' ? 'bg-black text-white border-black' : 'text-black border-black/20 hover:bg-black/5'
                    } ${fontClass}`}
                  >
                    {languageFullLabels.en}
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
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.name}>
                  {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
                  {crumb.href ? (
                    <Link 
                      href={crumb.href} 
                      className={`text-gray-600 hover:text-black transition-colors ${fontClass}`}
                    >
                      {crumb.name}
                    </Link>
                  ) : (
                    <span className={`text-black font-medium ${fontClass}`}>{crumb.name}</span>
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
              <h3 className={`text-lg font-semibold mb-4 ${fontClass}`}>{t('church_name')}</h3>
              <p className={`text-black/70 ${fontClass}`}>{t('full_address')}</p>
              <p className={`text-black/70 mt-2 ${fontClass}`}>
                <span className="font-semibold">{t('phone')}:</span> {t('phone_number')}
              </p>
              <p className={`text-black/70 ${fontClass}`}>
                <span className="font-semibold">{t('email')}:</span> {t('email_address')}
              </p>
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${fontClass}`}>{t('service_times')}</h3>
              <p className={`text-black/70 ${fontClass}`}>{t('sunday')}: {t('sunday_time')}</p>
              <p className={`text-black/70 ${fontClass}`}>{t('wednesday')}: {t('wednesday_time')}</p>
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${fontClass}`}>{t('quick_links')}</h3>
              <div className="flex flex-col space-y-2">
                <Link href="/about/greeting" className={`text-black/70 hover:text-black ${fontClass}`}>{t('church_guide')}</Link>
                <Link href="/sermons-live" className={`text-black/70 hover:text-black ${fontClass}`}>{t('sermons_praise')}</Link>
                <Link href="/news/announcements" className={`text-black/70 hover:text-black ${fontClass}`}>{t('nav_links.announcements')}</Link>
                <Link href="/giving" className={`text-black/70 hover:text-black ${fontClass}`}>{t('online_giving')}</Link>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-black/10 pt-8 text-center">
            <p className={`text-black/50 text-sm ${fontClass}`}>
              © {new Date().getFullYear()} {t('church_name')}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
