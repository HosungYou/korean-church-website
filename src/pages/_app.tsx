import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import '@/styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  // 기본 언어를 한국어로 강제 설정
  useEffect(() => {
    // 모든 경우에 한국어로 강제 설정
    if (router.locale !== 'ko') {
      const currentPath = router.asPath
      router.replace(currentPath, currentPath, { locale: 'ko' })
    }
  }, [router])

  return <Component {...pageProps} />
}

export default appWithTranslation(MyApp)