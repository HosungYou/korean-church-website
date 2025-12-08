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
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}