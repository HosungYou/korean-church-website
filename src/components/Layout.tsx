import React, { useState, Fragment, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, Menu as MenuIcon, X as XIcon, ChevronRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'

// ===========================================
// VS Design Diverge: Editorial Minimalism
// Glass Header + Animated Nav + Refined Footer
// ===========================================

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
    'missionary-support': 'missionary_support',
    'short-term': 'short_term_missions',
    'relief': 'relief_missions',
    'new-family': 'new_family_education',
    'new-family-registration': 'new_family_registration',
    'discipleship': 'discipleship',
    'training': 'training',
    'bible-reading': 'qt',
    'bible-materials': 'bible_materials',
    'news': 'news',
    'posts': 'posts',
    'announcements': 'announcements',
    'resources': 'resources',
    'bulletin': 'bulletin',
    'gallery': 'gallery',
    'giving': 'giving',
    'korean-school': 'korean_school',
    'worship': 'worship',
    'community': 'community',
    'settlement-info': 'settlement_info'
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
      { labelKey: 'nav_links.worship_info', href: '/worship' },
      { labelKey: 'nav_links.sunday_sermon', href: '/sermons/sunday' },
      { labelKey: 'nav_links.wednesday_sermon', href: '/sermons/wednesday' },
    ],
  },
  {
    labelKey: 'nav_groups.nurturing',
    dropdown: [
      { labelKey: 'nav_links.qt', href: '/bible-reading' },
      { labelKey: 'nav_links.bible_materials', href: '/bible-materials' },
      { labelKey: 'nav_links.training', href: '/training' },
      { labelKey: 'nav_links.new_family_education', href: '/training/new-family' },
    ],
  },
  {
    labelKey: 'nav_groups.korean_school',
    href: '/korean-school',
  },
  {
    labelKey: 'nav_groups.missions',
    dropdown: [
      { labelKey: 'nav_links.missionary_support', href: '/missions/missionary-support' },
      { labelKey: 'nav_links.short_term_missions', href: '/missions/short-term' },
      { labelKey: 'nav_links.relief_missions', href: '/missions/relief' },
    ],
  },
  {
    labelKey: 'nav_groups.announcements',
    dropdown: [
      { labelKey: 'nav_links.bulletin', href: '/news/bulletin' },
      { labelKey: 'nav_links.settlement_info', href: '/community/settlement-info' },
      { labelKey: 'nav_links.announcements', href: '/announcements' },
    ],
  },
  {
    labelKey: 'nav_groups.about',
    dropdown: [
      { labelKey: 'nav_links.about', href: '/about' },
      { labelKey: 'nav_links.new_family_registration', href: '/about/new-family-registration' },
      { labelKey: 'nav_links.history', href: '/about/history' },
      { labelKey: 'nav_links.philosophy', href: '/about/philosophy' },
      { labelKey: 'nav_links.directions', href: '/about/directions' },
    ],
  },
  {
    labelKey: 'nav_groups.gallery',
    href: '/news/gallery',
  },
]

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation('common')
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [adminSession, setAdminSession] = useState<{ email?: string; name?: string } | null>(null)
  const [scrolled, setScrolled] = useState(false)

  // Scroll detection for header style change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 현재 언어 설정 (기본값: 한국어)
  const currentLanguage = router.locale || i18n.language || 'ko'
  const fontClass = currentLanguage === 'ko' ? 'font-korean' : 'font-english'

  // 라우터 로케일과 i18n 언어를 동기화
  useEffect(() => {
    const activeLocale = router.locale || 'ko'
    if (i18n.language !== activeLocale) {
      i18n.changeLanguage(activeLocale)
    }
  }, [i18n, router.locale])

  const languageShortLabels: Record<string, string> = {
    ko: t('language.short_ko', { defaultValue: '한' }),
    en: t('language.short_en', { defaultValue: 'EN' }),
  }
  const languageFullLabels: Record<string, string> = {
    ko: t('language.full_ko', { defaultValue: '한국어' }),
    en: t('language.full_en', { defaultValue: 'English' }),
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
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Failed to sign out from Supabase:', error)
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
    if (router.locale === lng) {
      return
    }
    router.push(router.asPath, router.asPath, { locale: lng })
  }

  // Nav label translations
  const getNavLabel = (labelKey: string): string => {
    return t(labelKey)
  }

  return (
    <div className="min-h-screen bg-church-neutral-50 font-korean">
      {/* Glass Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'header-glass shadow-church'
            : 'bg-transparent'
        }`}
      >
        {/* Gold Accent Line */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{
            background: 'linear-gradient(90deg, oklch(0.72 0.10 75) 0%, oklch(0.45 0.12 265) 50%, transparent 100%)',
          }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-24 justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center group">
                <div className="relative h-14 w-36 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/images/logo.png"
                    alt="Church Logo"
                    fill
                    priority
                    className="object-contain"
                    sizes="144px"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-1">
              {navigationItems.map((item) =>
                item.dropdown ? (
                  <Menu as="div" key={item.labelKey} className="relative">
                    <Menu.Button
                      className={`nav-link inline-flex items-center px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 ${fontClass}`}
                      style={{ color: 'var(--church-primary-700)' }}
                    >
                      <span>{getNavLabel(item.labelKey)}</span>
                      <ChevronDownIcon className="ml-1 h-4 w-4 opacity-60" />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-2"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-2"
                    >
                      <Menu.Items
                        className="absolute -right-4 top-full mt-3 w-56 origin-top-right overflow-hidden focus:outline-none z-50"
                        style={{
                          background: 'var(--church-neutral-50)',
                          boxShadow: 'var(--shadow-card)',
                          borderRadius: '0',
                        }}
                      >
                        {/* Dropdown accent line */}
                        <div
                          className="h-0.5 w-full"
                          style={{
                            background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))',
                          }}
                        />
                        <div className="py-2">
                          {item.dropdown.map((subItem) => (
                            <Menu.Item key={subItem.labelKey}>
                              {({ active }) => (
                                <Link
                                  href={subItem.href!}
                                  className={`block px-5 py-2.5 text-sm transition-all duration-200 ${fontClass}`}
                                  style={{
                                    color: active ? 'var(--church-primary-500)' : 'var(--church-primary-700)',
                                    background: active ? 'oklch(0.97 0.01 265)' : 'transparent',
                                  }}
                                >
                                  {t(subItem.labelKey)}
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <Link
                    key={item.labelKey}
                    href={item.href!}
                    className={`nav-link px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 ${fontClass}`}
                    style={{ color: 'var(--church-primary-700)' }}
                  >
                    {t(item.labelKey)}
                  </Link>
                )
              )}
            </div>

            {/* Admin / Language / Mobile Menu */}
            <div className="flex items-center space-x-3">
              {/* Admin Buttons - Desktop */}
              <div className="hidden lg:flex items-center space-x-2">
                {adminSession ? (
                  <>
                    <button
                      onClick={handleAdminNavigate}
                      className={`px-4 py-2 text-xs font-medium tracking-wide transition-all duration-300 ${fontClass}`}
                      style={{
                        color: 'var(--church-primary-600)',
                        border: '1px solid oklch(0.45 0.12 265 / 0.2)',
                      }}
                    >
                      {t('admin.dashboard')}
                    </button>
                    <button
                      onClick={handleAdminLogout}
                      className={`px-4 py-2 text-xs font-medium tracking-wide transition-all duration-300 ${fontClass}`}
                      style={{
                        color: 'var(--church-primary-600)',
                        border: '1px solid oklch(0.45 0.12 265 / 0.2)',
                      }}
                    >
                      {t('admin.logout')}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleAdminNavigate}
                    className={`px-4 py-2 text-xs font-medium tracking-wide transition-all duration-300 ${fontClass}`}
                    style={{
                      color: 'var(--church-primary-600)',
                      border: '1px solid oklch(0.45 0.12 265 / 0.2)',
                    }}
                  >
                    {t('admin.login')}
                  </button>
                )}
              </div>

              {/* Language Switcher */}
              <div className="hidden sm:flex items-center">
                <div
                  className="flex overflow-hidden"
                  style={{ border: '1px solid oklch(0.45 0.12 265 / 0.15)' }}
                >
                  <button
                    onClick={() => changeLanguage('ko')}
                    className={`px-3 py-1.5 text-xs font-medium tracking-wider transition-all duration-300 ${fontClass}`}
                    style={{
                      background: i18n.language === 'ko' ? 'var(--church-primary-500)' : 'transparent',
                      color: i18n.language === 'ko' ? 'var(--church-neutral-50)' : 'var(--church-primary-600)',
                    }}
                  >
                    {languageShortLabels.ko}
                  </button>
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`px-3 py-1.5 text-xs font-medium tracking-wider transition-all duration-300 ${fontClass}`}
                    style={{
                      background: i18n.language === 'en' ? 'var(--church-primary-500)' : 'transparent',
                      color: i18n.language === 'en' ? 'var(--church-neutral-50)' : 'var(--church-primary-600)',
                    }}
                  >
                    {languageShortLabels.en}
                  </button>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-2 transition-colors duration-300"
                  style={{ color: 'var(--church-primary-700)' }}
                >
                  <MenuIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <div className="lg:hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-400"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-400"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 transition-opacity z-40"
              style={{ background: 'oklch(0.15 0.05 265 / 0.6)' }}
              onClick={() => setMobileMenuOpen(false)}
            />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transform transition ease-out duration-400"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in duration-300"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto sm:max-w-sm"
              style={{ background: 'var(--church-neutral-50)' }}
            >
              {/* Mobile Header */}
              <div
                className="flex items-center justify-between p-5"
                style={{ borderBottom: '1px solid oklch(0.92 0.005 75)' }}
              >
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
                <button
                  type="button"
                  className="p-2"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ color: 'var(--church-primary-700)' }}
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Mobile Nav Items */}
              <div className="px-5 py-6 space-y-1">
                {navigationItems.map((item) => (
                  <div key={item.labelKey}>
                    {item.dropdown ? (
                      <div className="mb-4">
                        <p
                          className={`${fontClass} font-bold text-sm tracking-wide uppercase mb-3`}
                          style={{ color: 'var(--church-accent)' }}
                        >
                          {getNavLabel(item.labelKey)}
                        </p>
                        <div
                          className="pl-4 space-y-1"
                          style={{ borderLeft: '2px solid oklch(0.72 0.10 75 / 0.3)' }}
                        >
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.labelKey}
                              href={subItem.href!}
                              className={`block py-2 text-sm transition-colors duration-200 ${fontClass}`}
                              style={{ color: 'var(--church-primary-700)' }}
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
                        className={`block py-3 text-base font-medium ${fontClass}`}
                        style={{ color: 'var(--church-primary-800)' }}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t(item.labelKey)}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Admin */}
              <div
                className="px-5 py-4 space-y-2"
                style={{ borderTop: '1px solid oklch(0.92 0.005 75)' }}
              >
                {adminSession ? (
                  <>
                    <button
                      onClick={handleMobileAdminNavigate}
                      className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors duration-200 ${fontClass}`}
                      style={{
                        color: 'var(--church-primary-700)',
                        border: '1px solid oklch(0.45 0.12 265 / 0.2)',
                      }}
                    >
                      {t('admin.dashboard')}
                    </button>
                    <button
                      onClick={handleMobileAdminLogout}
                      className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors duration-200 ${fontClass}`}
                      style={{
                        color: 'var(--church-primary-700)',
                        border: '1px solid oklch(0.45 0.12 265 / 0.2)',
                      }}
                    >
                      {t('admin.logout')}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleMobileAdminNavigate}
                    className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors duration-200 ${fontClass}`}
                    style={{
                      color: 'var(--church-primary-700)',
                      border: '1px solid oklch(0.45 0.12 265 / 0.2)',
                    }}
                  >
                    {t('admin.login')}
                  </button>
                )}
              </div>

              {/* Mobile Language */}
              <div
                className="px-5 py-4 flex space-x-2"
                style={{ borderTop: '1px solid oklch(0.92 0.005 75)' }}
              >
                <button
                  onClick={() => { changeLanguage('ko'); setMobileMenuOpen(false); }}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${fontClass}`}
                  style={{
                    background: i18n.language === 'ko' ? 'var(--church-primary-500)' : 'transparent',
                    color: i18n.language === 'ko' ? 'var(--church-neutral-50)' : 'var(--church-primary-600)',
                    border: '1px solid oklch(0.45 0.12 265 / 0.2)',
                  }}
                >
                  {languageFullLabels.ko}
                </button>
                <button
                  onClick={() => { changeLanguage('en'); setMobileMenuOpen(false); }}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${fontClass}`}
                  style={{
                    background: i18n.language === 'en' ? 'var(--church-primary-500)' : 'transparent',
                    color: i18n.language === 'en' ? 'var(--church-neutral-50)' : 'var(--church-primary-600)',
                    border: '1px solid oklch(0.45 0.12 265 / 0.2)',
                  }}
                >
                  {languageFullLabels.en}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Transition.Root>

      {/* Breadcrumb Navigation */}
      {router.pathname !== '/' && (
        <nav
          className="py-4"
          style={{
            background: 'var(--church-neutral-100)',
            borderBottom: '1px solid oklch(0.92 0.005 75)',
          }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.name}>
                  {index > 0 && (
                    <ChevronRight
                      className="h-3.5 w-3.5"
                      style={{ color: 'var(--church-secondary-400)' }}
                    />
                  )}
                  {crumb.href && index < breadcrumbs.length - 1 ? (
                    <Link
                      href={crumb.href}
                      className={`transition-colors duration-200 hover:underline ${fontClass}`}
                      style={{ color: 'var(--church-secondary-500)' }}
                    >
                      {crumb.name}
                    </Link>
                  ) : (
                    <span
                      className={`font-medium ${fontClass}`}
                      style={{ color: 'var(--church-primary-700)' }}
                    >
                      {crumb.name}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </nav>
      )}

      <main>{children}</main>

      {/* Footer - Editorial Style with Grain */}
      <footer
        className="relative overflow-hidden"
        style={{ background: 'var(--church-neutral-950)' }}
      >
        {/* Grain Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Gold Accent Line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, oklch(0.72 0.10 75), transparent)',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
            {/* Church Info - 5 cols */}
            <div className="md:col-span-5">
              <h3
                className={`font-headline font-bold text-2xl mb-6 ${fontClass}`}
                style={{ color: 'var(--church-neutral-50)' }}
              >
                {t('church_name', { defaultValue: '스테이트 칼리지 한인교회' })}
              </h3>
              <div className="space-y-3">
                <p
                  className={`text-sm leading-relaxed ${fontClass}`}
                  style={{ color: 'oklch(0.85 0.02 75)' }}
                >
                  {t('full_address', { defaultValue: '758 Glenn Rd, State College, PA 16803' })}
                </p>
                <p className={`text-sm ${fontClass}`} style={{ color: 'oklch(0.85 0.02 75)' }}>
                  <span style={{ color: 'var(--church-accent)' }}>
                    {t('phone', { defaultValue: '전화' })}:
                  </span>{' '}
                  {t('phone_number', { defaultValue: '814-380-9393' })}
                </p>
                <p className={`text-sm ${fontClass}`} style={{ color: 'oklch(0.85 0.02 75)' }}>
                  <span style={{ color: 'var(--church-accent)' }}>
                    {t('email', { defaultValue: '이메일' })}:
                  </span>{' '}
                  {t('email_address', { defaultValue: 'KyuHongYeon@gmail.com' })}
                </p>
              </div>
            </div>

            {/* Service Times - 3 cols */}
            <div className="md:col-span-3">
              <h3
                className={`text-xs font-medium tracking-[0.2em] uppercase mb-6 ${fontClass}`}
                style={{ color: 'var(--church-accent)' }}
              >
                {t('service_times', { defaultValue: '예배 시간' })}
              </h3>
              <div className="space-y-3">
                <p className={`text-sm ${fontClass}`} style={{ color: 'oklch(0.85 0.02 75)' }}>
                  <span style={{ color: 'var(--church-neutral-50)' }}>
                    {t('sunday', { defaultValue: '주일' })}:
                  </span>{' '}
                  {t('sunday_time', { defaultValue: '오전 11:00' })}
                </p>
                <p className={`text-sm ${fontClass}`} style={{ color: 'oklch(0.85 0.02 75)' }}>
                  <span style={{ color: 'var(--church-neutral-50)' }}>
                    {t('wednesday', { defaultValue: '수요일' })}:
                  </span>{' '}
                  {t('wednesday_time', { defaultValue: '오후 7:30' })}
                </p>
              </div>
            </div>

            {/* Quick Links - 4 cols */}
            <div className="md:col-span-4">
              <h3
                className={`text-xs font-medium tracking-[0.2em] uppercase mb-6 ${fontClass}`}
                style={{ color: 'var(--church-accent)' }}
              >
                {t('quick_links', { defaultValue: '바로가기' })}
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <Link
                  href="/about/greeting"
                  className={`text-sm transition-colors duration-200 hover:text-white ${fontClass}`}
                  style={{ color: 'oklch(0.85 0.02 75)' }}
                >
                  {t('church_guide', { defaultValue: '교회안내' })}
                </Link>
                <Link
                  href="/sermons/sunday"
                  className={`text-sm transition-colors duration-200 hover:text-white ${fontClass}`}
                  style={{ color: 'oklch(0.85 0.02 75)' }}
                >
                  {t('sermons_praise', { defaultValue: '설교/찬양' })}
                </Link>
                <Link
                  href="/announcements"
                  className={`text-sm transition-colors duration-200 hover:text-white ${fontClass}`}
                  style={{ color: 'oklch(0.85 0.02 75)' }}
                >
                  {t('nav_links.announcements', { defaultValue: '공지사항' })}
                </Link>
                <Link
                  href="/giving"
                  className={`text-sm transition-colors duration-200 hover:text-white ${fontClass}`}
                  style={{ color: 'oklch(0.85 0.02 75)' }}
                >
                  {t('online_giving', { defaultValue: '온라인헌금' })}
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div
            className="mt-16 pt-8 flex flex-col md:flex-row md:items-center md:justify-between"
            style={{ borderTop: '1px solid oklch(0.35 0.006 75 / 0.5)' }}
          >
            <p
              className={`text-xs tracking-wide ${fontClass}`}
              style={{ color: 'oklch(0.70 0.02 75)' }}
            >
              © {new Date().getFullYear()} {t('church_name')}. All rights reserved.
            </p>
            <p
              className={`text-xs tracking-wide mt-2 md:mt-0 ${fontClass}`}
              style={{ color: 'oklch(0.65 0.02 75)' }}
            >
              Designed with faith & care
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
