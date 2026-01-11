// 이 페이지는 /news/bulletin으로 리다이렉트됩니다
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/news/bulletin',
      permanent: true,
    },
  }
}

export default function BulletinRedirect() {
  return null
}
