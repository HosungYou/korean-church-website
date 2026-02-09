-- Create training storage bucket for file uploads (PDF, video, audio materials)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'training',
  'training',
  true,
  52428800, -- 50MB limit
  ARRAY[
    'application/pdf',
    'video/mp4',
    'video/webm',
    'audio/mpeg',
    'audio/mp4',
    'audio/webm',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for training bucket
CREATE POLICY "Public read access for training files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'training');

CREATE POLICY "Authenticated users can upload training files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'training' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update training files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'training' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete training files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'training' AND auth.role() = 'authenticated');
