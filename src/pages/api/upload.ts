import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

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
    const { fileName, fileData, fileSize } = req.body

    if (!fileName || !fileData || !fileSize) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // public/uploads 디렉토리 확인/생성
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    // Base64 데이터에서 실제 파일 데이터 추출
    const base64Data = fileData.replace(/^data:[^;]+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    // 파일명 중복 방지를 위한 타임스탬프 추가
    const timestamp = Date.now()
    const fileExtension = path.extname(fileName)
    const baseName = path.basename(fileName, fileExtension)
    const uniqueFileName = `${timestamp}_${baseName}${fileExtension}`

    const filePath = path.join(uploadsDir, uniqueFileName)

    // 파일 저장
    fs.writeFileSync(filePath, buffer)

    const fileUrl = `/uploads/${uniqueFileName}`

    res.status(200).json({
      file: {
        name: fileName,
        url: fileUrl,
        size: fileSize
      }
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Upload failed' })
  }
}