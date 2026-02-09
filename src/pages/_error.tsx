import { NextPageContext } from 'next'
import Link from 'next/link'

interface ErrorProps {
  statusCode?: number
}

function Error({ statusCode }: ErrorProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: 'oklch(0.985 0.003 75)'
      }}
    >
      <h1 style={{ fontSize: '3rem', margin: '0 0 1rem', color: 'oklch(0.25 0.05 265)' }}>
        {statusCode ? `${statusCode}` : '오류'}
      </h1>
      <p style={{ color: 'oklch(0.55 0.01 75)', margin: 0 }}>
        {statusCode
          ? `서버에서 ${statusCode} 오류가 발생했습니다.`
          : '클라이언트에서 오류가 발생했습니다.'}
      </p>
      <Link
        href="/"
        style={{
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          background: 'oklch(0.45 0.12 265)',
          color: 'oklch(0.98 0.003 75)',
          textDecoration: 'none',
          borderRadius: '2px'
        }}
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
