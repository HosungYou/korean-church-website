import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// Database types
export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          title: string
          content: string
          type: 'announcement' | 'event' | 'general'
          status: 'draft' | 'published' | 'scheduled'
          author_email: string | null
          author_name: string | null
          cover_image_url: string | null
          excerpt: string | null
          created_at: string
          updated_at: string
          published_at: string | null
          scheduled_for: string | null
        }
        Insert: Omit<Database['public']['Tables']['posts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['posts']['Insert']>
      }
      email_subscribers: {
        Row: {
          id: string
          email: string
          subscribed_at: string
          is_active: boolean
          unsubscribed_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['email_subscribers']['Row'], 'id' | 'subscribed_at'>
        Update: Partial<Database['public']['Tables']['email_subscribers']['Insert']>
      }
      newsletter_sent: {
        Row: {
          id: string
          title: string
          content: string
          type: 'announcement' | 'event' | 'general'
          published_at: string
          sent_at: string
          recipient_count: number
          recipients: string[]
        }
        Insert: Omit<Database['public']['Tables']['newsletter_sent']['Row'], 'id' | 'sent_at'>
        Update: Partial<Database['public']['Tables']['newsletter_sent']['Insert']>
      }
      admin_users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'editor'
          created_at: string
          last_login: string | null
        }
        Insert: Omit<Database['public']['Tables']['admin_users']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['admin_users']['Insert']>
      }
    }
  }
}

export default supabase
