export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: 'super_admin' | 'admin'
          last_login: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          role?: 'super_admin' | 'admin'
          last_login?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: 'super_admin' | 'admin'
          last_login?: string | null
          created_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          title: string
          content: string
          type: 'announcement' | 'event' | 'general'
          category: 'general' | 'wednesday' | 'sunday' | 'bible'
          status: 'draft' | 'published' | 'scheduled'
          author_id: string | null
          author_email: string | null
          author_name: string | null
          cover_image_url: string | null
          excerpt: string | null
          attachment_url: string | null
          attachment_name: string | null
          published_at: string | null
          scheduled_for: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          type: 'announcement' | 'event' | 'general'
          category?: 'general' | 'wednesday' | 'sunday' | 'bible'
          status?: 'draft' | 'published' | 'scheduled'
          author_id?: string | null
          author_email?: string | null
          author_name?: string | null
          cover_image_url?: string | null
          excerpt?: string | null
          attachment_url?: string | null
          attachment_name?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          type?: 'announcement' | 'event' | 'general'
          category?: 'general' | 'wednesday' | 'sunday' | 'bible'
          status?: 'draft' | 'published' | 'scheduled'
          author_id?: string | null
          author_email?: string | null
          author_name?: string | null
          cover_image_url?: string | null
          excerpt?: string | null
          attachment_url?: string | null
          attachment_name?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      prayer_requests: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          title: string
          content: string
          is_urgent: boolean
          is_private: boolean
          status: 'pending' | 'approved' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          title: string
          content: string
          is_urgent?: boolean
          is_private?: boolean
          status?: 'pending' | 'approved' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          title?: string
          content?: string
          is_urgent?: boolean
          is_private?: boolean
          status?: 'pending' | 'approved' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_subscribers: {
        Row: {
          id: string
          email: string
          name: string | null
          is_active: boolean
          subscribed_at: string
          unsubscribed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_sent: {
        Row: {
          id: string
          title: string
          content: string
          type: 'announcement' | 'event' | 'general'
          published_at: string
          recipient_count: number
          recipients: string[]
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          type: 'announcement' | 'event' | 'general'
          published_at: string
          recipient_count: number
          recipients: string[]
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          type?: 'announcement' | 'event' | 'general'
          published_at?: string
          recipient_count?: number
          recipients?: string[]
          created_at?: string
        }
        Relationships: []
      }
      new_families: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string
          address: string | null
          birth_date: string | null
          gender: 'male' | 'female' | 'other' | null
          marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
          previous_church: string | null
          baptized: boolean
          baptism_date: string | null
          introduction_method: string | null
          notes: string | null
          status: 'pending' | 'contacted' | 'visiting' | 'registered' | 'inactive'
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone: string
          address?: string | null
          birth_date?: string | null
          gender?: 'male' | 'female' | 'other' | null
          marital_status?: 'single' | 'married' | 'divorced' | 'widowed' | null
          previous_church?: string | null
          baptized?: boolean
          baptism_date?: string | null
          introduction_method?: string | null
          notes?: string | null
          status?: 'pending' | 'contacted' | 'visiting' | 'registered' | 'inactive'
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string
          address?: string | null
          birth_date?: string | null
          gender?: 'male' | 'female' | 'other' | null
          marital_status?: 'single' | 'married' | 'divorced' | 'widowed' | null
          previous_church?: string | null
          baptized?: boolean
          baptism_date?: string | null
          introduction_method?: string | null
          notes?: string | null
          status?: 'pending' | 'contacted' | 'visiting' | 'registered' | 'inactive'
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      // ========== 새로 추가된 테이블 ==========
      sermons: {
        Row: {
          id: string
          title: string
          speaker: string
          scripture: string
          sermon_date: string
          youtube_url: string | null
          youtube_video_id: string | null
          sermon_type: 'sunday' | 'wednesday' | 'friday' | 'special'
          series_name: string | null
          description: string | null
          thumbnail_url: string | null
          is_featured: boolean
          view_count: number
          status: 'draft' | 'published'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          speaker?: string
          scripture: string
          sermon_date: string
          youtube_url?: string | null
          youtube_video_id?: string | null
          sermon_type: 'sunday' | 'wednesday' | 'friday' | 'special'
          series_name?: string | null
          description?: string | null
          thumbnail_url?: string | null
          is_featured?: boolean
          view_count?: number
          status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          speaker?: string
          scripture?: string
          sermon_date?: string
          youtube_url?: string | null
          youtube_video_id?: string | null
          sermon_type?: 'sunday' | 'wednesday' | 'friday' | 'special'
          series_name?: string | null
          description?: string | null
          thumbnail_url?: string | null
          is_featured?: boolean
          view_count?: number
          status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_albums: {
        Row: {
          id: string
          title: string
          description: string | null
          cover_image_url: string | null
          album_date: string
          year: number
          month: number
          category: 'sunday' | 'event' | 'education' | 'missions' | 'general'
          department: 'children' | 'youth' | 'young_adults' | 'district' | 'general' | null
          district_number: number | null
          is_visible: boolean
          sort_order: number
          photo_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          cover_image_url?: string | null
          album_date: string
          category?: 'sunday' | 'event' | 'education' | 'missions' | 'general'
          department?: 'children' | 'youth' | 'young_adults' | 'district' | 'general' | null
          district_number?: number | null
          is_visible?: boolean
          sort_order?: number
          photo_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          cover_image_url?: string | null
          album_date?: string
          category?: 'sunday' | 'event' | 'education' | 'missions' | 'general'
          department?: 'children' | 'youth' | 'young_adults' | 'district' | 'general' | null
          district_number?: number | null
          is_visible?: boolean
          sort_order?: number
          photo_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_photos: {
        Row: {
          id: string
          album_id: string
          image_url: string
          thumbnail_url: string | null
          caption: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          album_id: string
          image_url: string
          thumbnail_url?: string | null
          caption?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          album_id?: string
          image_url?: string
          thumbnail_url?: string | null
          caption?: string | null
          sort_order?: number
          created_at?: string
        }
        Relationships: []
      }
      training_programs: {
        Row: {
          id: string
          title: string
          description: string | null
          cover_image_url: string | null
          category: 'new_family' | 'discipleship' | 'bible_study' | 'leadership' | 'baptism' | 'general'
          total_weeks: number
          is_visible: boolean
          sort_order: number
          material_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          cover_image_url?: string | null
          category?: 'new_family' | 'discipleship' | 'bible_study' | 'leadership' | 'baptism' | 'general'
          total_weeks?: number
          is_visible?: boolean
          sort_order?: number
          material_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          cover_image_url?: string | null
          category?: 'new_family' | 'discipleship' | 'bible_study' | 'leadership' | 'baptism' | 'general'
          total_weeks?: number
          is_visible?: boolean
          sort_order?: number
          material_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      training_materials: {
        Row: {
          id: string
          program_id: string
          title: string
          description: string | null
          week_number: number
          material_type: 'pdf' | 'video' | 'audio'
          file_url: string | null
          file_name: string | null
          file_size: number | null
          video_url: string | null
          duration_minutes: number | null
          thumbnail_url: string | null
          is_visible: boolean
          sort_order: number
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          program_id: string
          title: string
          description?: string | null
          week_number: number
          material_type: 'pdf' | 'video' | 'audio'
          file_url?: string | null
          file_name?: string | null
          file_size?: number | null
          video_url?: string | null
          duration_minutes?: number | null
          thumbnail_url?: string | null
          is_visible?: boolean
          sort_order?: number
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          program_id?: string
          title?: string
          description?: string | null
          week_number?: number
          material_type?: 'pdf' | 'video' | 'audio'
          file_url?: string | null
          file_name?: string | null
          file_size?: number | null
          video_url?: string | null
          duration_minutes?: number | null
          thumbnail_url?: string | null
          is_visible?: boolean
          sort_order?: number
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      bible_reading_plans: {
        Row: {
          id: string
          title: string
          description: string | null
          year: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          year: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          year?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      bible_reading_entries: {
        Row: {
          id: string
          plan_id: string
          reading_date: string
          old_testament: string | null
          new_testament: string | null
          psalms: string | null
          proverbs: string | null
          notes: string | null
          // New devotional fields
          title: string | null
          scripture_reference: string | null
          pastor_notes: string | null
          application: string | null
          prayer: string | null
          day_of_week: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          plan_id: string
          reading_date: string
          old_testament?: string | null
          new_testament?: string | null
          psalms?: string | null
          proverbs?: string | null
          notes?: string | null
          // New devotional fields
          title?: string | null
          scripture_reference?: string | null
          pastor_notes?: string | null
          application?: string | null
          prayer?: string | null
          day_of_week?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          plan_id?: string
          reading_date?: string
          old_testament?: string | null
          new_testament?: string | null
          psalms?: string | null
          proverbs?: string | null
          notes?: string | null
          // New devotional fields
          title?: string | null
          scripture_reference?: string | null
          pastor_notes?: string | null
          application?: string | null
          prayer?: string | null
          day_of_week?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      bible_materials: {
        Row: {
          id: string
          title: string
          description: string | null
          category: 'old_testament' | 'new_testament'
          book_name: string | null
          chapter_range: string | null
          content: string | null
          file_url: string | null
          file_name: string | null
          video_url: string | null
          author_name: string | null
          is_visible: boolean
          sort_order: number
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: 'old_testament' | 'new_testament'
          book_name?: string | null
          chapter_range?: string | null
          content?: string | null
          file_url?: string | null
          file_name?: string | null
          video_url?: string | null
          author_name?: string | null
          is_visible?: boolean
          sort_order?: number
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: 'old_testament' | 'new_testament'
          book_name?: string | null
          chapter_range?: string | null
          content?: string | null
          file_url?: string | null
          file_name?: string | null
          video_url?: string | null
          author_name?: string | null
          is_visible?: boolean
          sort_order?: number
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      hero_slides: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          bible_verse: string | null
          image_url: string | null
          link_url: string | null
          link_text: string | null
          is_active: boolean
          sort_order: number
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          bible_verse?: string | null
          image_url?: string | null
          link_url?: string | null
          link_text?: string | null
          is_active?: boolean
          sort_order?: number
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          bible_verse?: string | null
          image_url?: string | null
          link_url?: string | null
          link_text?: string | null
          is_active?: boolean
          sort_order?: number
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      church_members: {
        Row: {
          id: string
          korean_name: string
          english_name: string | null
          email: string | null
          phone: string | null
          address: string | null
          birth_date: string | null
          gender: 'male' | 'female' | 'other' | null
          member_type: 'member' | 'deacon' | 'elder' | 'pastor' | 'staff'
          department: string | null
          baptized: boolean
          baptism_date: string | null
          registered_date: string
          notes: string | null
          status: 'active' | 'inactive' | 'transferred' | 'deceased'
          profile_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          korean_name: string
          english_name?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          birth_date?: string | null
          gender?: 'male' | 'female' | 'other' | null
          member_type?: 'member' | 'deacon' | 'elder' | 'pastor' | 'staff'
          department?: string | null
          baptized?: boolean
          baptism_date?: string | null
          registered_date?: string
          notes?: string | null
          status?: 'active' | 'inactive' | 'transferred' | 'deceased'
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          korean_name?: string
          english_name?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          birth_date?: string | null
          gender?: 'male' | 'female' | 'other' | null
          member_type?: 'member' | 'deacon' | 'elder' | 'pastor' | 'staff'
          department?: string | null
          baptized?: boolean
          baptism_date?: string | null
          registered_date?: string
          notes?: string | null
          status?: 'active' | 'inactive' | 'transferred' | 'deceased'
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      bulletins: {
        Row: {
          id: string
          title: string
          bulletin_date: string
          file_url: string
          thumbnail_url: string | null
          is_visible: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          bulletin_date: string
          file_url: string
          thumbnail_url?: string | null
          is_visible?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          bulletin_date?: string
          file_url?: string
          thumbnail_url?: string | null
          is_visible?: boolean
          created_at?: string
        }
        Relationships: []
      }
      new_family_registrations: {
        Row: {
          id: string
          korean_name: string
          english_name: string | null
          birth_date: string | null
          baptism_date: string | null
          gender: string | null
          country: string | null
          address1: string
          address2: string | null
          city: string
          state: string
          zip_code: string
          email: string | null
          phone: string
          previous_church_position: string | null
          previous_church: string | null
          introduction: string | null
          family_info: string | null
          status: 'pending' | 'contacted' | 'visiting' | 'registered' | 'inactive'
          admin_notes: string | null
          submitted_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          korean_name: string
          english_name?: string | null
          birth_date?: string | null
          baptism_date?: string | null
          gender?: string | null
          country?: string | null
          address1: string
          address2?: string | null
          city: string
          state: string
          zip_code: string
          email?: string | null
          phone: string
          previous_church_position?: string | null
          previous_church?: string | null
          introduction?: string | null
          family_info?: string | null
          status?: 'pending' | 'contacted' | 'visiting' | 'registered' | 'inactive'
          admin_notes?: string | null
          submitted_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          korean_name?: string
          english_name?: string | null
          birth_date?: string | null
          baptism_date?: string | null
          gender?: string | null
          country?: string | null
          address1?: string
          address2?: string | null
          city?: string
          state?: string
          zip_code?: string
          email?: string | null
          phone?: string
          previous_church_position?: string | null
          previous_church?: string | null
          introduction?: string | null
          family_info?: string | null
          status?: 'pending' | 'contacted' | 'visiting' | 'registered' | 'inactive'
          admin_notes?: string | null
          submitted_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_logs: {
        Row: {
          id: string
          title: string
          content: string
          type: 'announcement' | 'event' | 'general' | null
          recipient_count: number
          failed_count: number
          sent_at: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          type?: 'announcement' | 'event' | 'general' | null
          recipient_count?: number
          failed_count?: number
          sent_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          type?: 'announcement' | 'event' | 'general' | null
          recipient_count?: number
          failed_count?: number
          sent_at?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_sermon_views: {
        Args: { sermon_id: string }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// 편의를 위한 타입 별칭
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type PrayerRequest = Database['public']['Tables']['prayer_requests']['Row']
export type NewFamily = Database['public']['Tables']['new_families']['Row']
export type Sermon = Database['public']['Tables']['sermons']['Row']
export type GalleryAlbum = Database['public']['Tables']['gallery_albums']['Row']
export type GalleryPhoto = Database['public']['Tables']['gallery_photos']['Row']
export type BibleReadingPlan = Database['public']['Tables']['bible_reading_plans']['Row']
export type BibleReadingEntry = Database['public']['Tables']['bible_reading_entries']['Row']
export type HeroSlide = Database['public']['Tables']['hero_slides']['Row']
export type EmailSubscriber = Database['public']['Tables']['email_subscribers']['Row']
export type ChurchMember = Database['public']['Tables']['church_members']['Row']
export type Bulletin = Database['public']['Tables']['bulletins']['Row']
export type NewsletterSent = Database['public']['Tables']['newsletter_sent']['Row']
export type NewFamilyRegistration = Database['public']['Tables']['new_family_registrations']['Row']
export type NewsletterLog = Database['public']['Tables']['newsletter_logs']['Row']
export type AdminUser = Database['public']['Tables']['admin_users']['Row']
export type AdminUserInsert = Database['public']['Tables']['admin_users']['Insert']

// Insert 타입 별칭
export type SermonInsert = Database['public']['Tables']['sermons']['Insert']
export type GalleryAlbumInsert = Database['public']['Tables']['gallery_albums']['Insert']
export type GalleryPhotoInsert = Database['public']['Tables']['gallery_photos']['Insert']
export type BibleReadingPlanInsert = Database['public']['Tables']['bible_reading_plans']['Insert']
export type BibleReadingEntryInsert = Database['public']['Tables']['bible_reading_entries']['Insert']
export type HeroSlideInsert = Database['public']['Tables']['hero_slides']['Insert']
export type EmailSubscriberInsert = Database['public']['Tables']['email_subscribers']['Insert']
export type ChurchMemberInsert = Database['public']['Tables']['church_members']['Insert']
export type BulletinInsert = Database['public']['Tables']['bulletins']['Insert']
export type NewFamilyRegistrationInsert = Database['public']['Tables']['new_family_registrations']['Insert']
export type NewsletterLogInsert = Database['public']['Tables']['newsletter_logs']['Insert']
export type TrainingProgram = Database['public']['Tables']['training_programs']['Row']
export type TrainingProgramInsert = Database['public']['Tables']['training_programs']['Insert']
export type TrainingMaterial = Database['public']['Tables']['training_materials']['Row']
export type TrainingMaterialInsert = Database['public']['Tables']['training_materials']['Insert']
