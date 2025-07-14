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

  const changeLanguage = (lng: string) => {
    router.push(router.pathname, router.asPath, { locale: lng })
  }

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.services'), href: '/services' },
    { name: t('nav.sermons'), href: '/sermons' },
    { name: t('nav.news'), href: '/news' },
    { name: t('nav.directions'), href: '/directions' },
    { name: t('nav.new_here'), href: '/new-here' },
    { name: t('nav.giving'), href: '/giving' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <img
                  src="/images/logo.png"
                  alt={t('church_name')}
                  className="h-10 w-auto mr-3"
                />
                <span className={`text-2xl font-bold text-church-primary ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('church_name')}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    router.pathname === item.href
                      ? 'border-b-2 border-church-primary text-gray-900'
                      : 'text-gray-500 hover:text-gray-900'
                  } ${i18n.language === 'ko' ? 'font-korean' : 'font-english'}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Language Toggle */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => changeLanguage('ko')}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    i18n.language === 'ko'
                      ? 'bg-church-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  한국어
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    i18n.language === 'en'
                      ? 'bg-church-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
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
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block py-2 pl-3 pr-4 text-base font-medium ${
                    router.pathname === item.href
                      ? 'border-l-4 border-church-primary bg-blue-50 text-church-primary'
                      : 'border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  } ${i18n.language === 'ko' ? 'font-korean' : 'font-english'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
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
                {t('address')}: 123 Main St, City, State ZIP
              </p>
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('contact_us')}
              </h3>
              <p className="text-gray-300">
                {t('phone')}: (123) 456-7890
              </p>
              <p className="text-gray-300">
                {t('email')}: info@koreanchurch.org
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
                {t('sunday')}: 8:00 AM, 11:00 AM
              </p>
              <p className={`text-gray-300 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('wednesday')}: 7:30 PM
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 {t('church_name')}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout