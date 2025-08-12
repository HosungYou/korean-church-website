import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation('common')
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false)
  const buildSha = (process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 7)

  const changeLanguage = (lng: string) => {
    router.push(router.pathname, router.asPath, { locale: lng })
  }

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.services'), href: '/services' },
    { name: t('nav.sermons'), href: '/sermons' },
    { 
      name: t('nav.resources'), 
      href: '#',
      dropdown: [
        { name: t('nav.announcements'), href: '/announcements' },
        { name: t('nav.gallery'), href: '/gallery' },
        { name: t('nav.bulletin'), href: '/bulletin' }
      ]
    },
    { name: t('nav.prayer_requests'), href: '/prayer-requests' },
    { name: t('nav.directions'), href: '/directions' },
    { name: t('nav.giving'), href: '/giving' },
  ]

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 border-b border-black/10">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <img
                  src="/images/logo.png"
                  alt="Church Logo"
                  className="h-12 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:space-x-8">
              {navigation.map((item) => (
                item.dropdown ? (
                  <div key={item.name} className="relative">
                    <button
                      onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium text-black hover:opacity-70 ${
                        i18n.language === 'ko' ? 'font-korean' : 'font-english'
                      }`}
                    >
                      {item.name}
                      <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {resourcesDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-black/20 rounded-md shadow-lg z-50 min-w-48">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className={`block px-4 py-2 text-sm text-black/80 hover:bg-black/5 ${
                              i18n.language === 'ko' ? 'font-korean' : 'font-english'
                            }`}
                            onClick={() => setResourcesDropdownOpen(false)}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      router.pathname === item.href
                        ? 'border-b border-black text-black'
                        : 'text-black hover:opacity-70'
                    } ${i18n.language === 'ko' ? 'font-korean' : 'font-english'}`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>

            {/* Language Toggle */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => changeLanguage('ko')}
                  className={`px-3 py-1 text-sm font-medium rounded-md border ${
                    i18n.language === 'ko'
                      ? 'bg-black text-white border-black'
                      : 'text-black border-black/20 hover:bg-black/5'
                  }`}
                >
                  한국어
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-3 py-1 text-sm font-medium rounded-md border ${
                    i18n.language === 'en'
                      ? 'bg-black text-white border-black'
                      : 'text-black border-black/20 hover:bg-black/5'
                  }`}
                >
                  ENG
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <span className="sr-only">Open main menu</span>
                  <svg
                    className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                  <svg
                    className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                item.dropdown ? (
                  <div key={item.name}>
                    <div className="border-l-4 border-transparent text-black/70 py-2 pl-3 pr-4 text-base font-medium">
                      {item.name}
                    </div>
                    {item.dropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.name}
                        href={dropdownItem.href}
                        className={`block py-2 pl-6 pr-4 text-sm font-medium ${
                          router.pathname === dropdownItem.href
                            ? 'border-l-4 border-black bg-black/5 text-black'
                            : 'border-l-4 border-transparent text-black/70 hover:bg-black/5 hover:text-black'
                        } ${i18n.language === 'ko' ? 'font-korean' : 'font-english'}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {dropdownItem.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block py-2 pl-3 pr-4 text-base font-medium ${
                      router.pathname === item.href
                        ? 'border-l-4 border-black bg-black/5 text-black'
                        : 'border-l-4 border-transparent text-black/70 hover:bg-black/5 hover:text-black'
                    } ${i18n.language === 'ko' ? 'font-korean' : 'font-english'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-black text-white mt-12">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('church_name')}
              </h3>
              <p className={`text-gray-300 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('full_address')}
              </p>
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('contact_us')}
              </h3>
              <p className="text-gray-300">
                {t('phone')}: {t('phone_number')}
              </p>
              <p className="text-gray-300">
                {t('email')}: {t('email_address')}
              </p>
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('service_times')}
              </h3>
              <p className={`text-gray-300 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('sunday')}: 11:00 AM
              </p>
              <p className={`text-gray-300 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('wednesday')}: 7:30 PM
              </p>
              <p className={`text-gray-300 text-sm ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {i18n.language === 'ko' ? '새벽기도: 화-금 6:30 AM (ZOOM)' : 'Dawn Prayer: Tue-Fri 6:30 AM (ZOOM)'}
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">© 2024 {t('church_name')}. All rights reserved.</p>
            {buildSha && (
              <p className="text-gray-500 text-xs mt-2">Build {buildSha}</p>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
