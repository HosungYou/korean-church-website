import { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Base64로 인코딩된 파일 데이터를 받아서 처리
    // 실제 프로덕션에서는 Firebase Storage나 AWS S3 사용 권장
    const { fileName, fileData, fileSize } = req.body

    // 간단한 시뮬레이션 - 실제로는 스토리지에 저장
    const mockUrl = `https://storage.example.com/${Date.now()}_${fileName}`

    res.status(200).json({
      file: {
        name: fileName,
        url: mockUrl,
        size: fileSize
      }
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Upload failed' })
  }
}