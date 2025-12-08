import { createSupabaseClient } from '@/lib/supabaseClient'
import type { Database } from '@/types/supabase'

type PrayerRequestRow = Database['public']['Tables']['prayer_requests']['Row']
type PrayerRequestInsert = Database['public']['Tables']['prayer_requests']['Insert']
type PrayerRequestUpdate = Database['public']['Tables']['prayer_requests']['Update']

export interface PrayerRequest extends PrayerRequestRow {
  id: string
}

export interface CreatePrayerRequestInput {
  name: string
  email?: string
  phone?: string
  title: string
  content: string
  isUrgent?: boolean
  isPrivate?: boolean
}

export const prayerService = {
  async createPrayerRequest(input: CreatePrayerRequestInput): Promise<PrayerRequest | null> {
    const supabase = createSupabaseClient()

    const requestData: PrayerRequestInsert = {
      name: input.name,
      email: input.email || null,
      phone: input.phone || null,
      title: input.title,
      content: input.content,
      is_urgent: input.isUrgent || false,
      is_private: input.isPrivate || false,
      status: 'pending'
    }

    const { data, error } = await supabase
      .from('prayer_requests')
      .insert(requestData)
      .select()
      .single()

    if (error) {
      console.error('Error creating prayer request:', error)
      return null
    }

    return data as PrayerRequest
  },

  async getPrayerRequests(includePrivate = false): Promise<PrayerRequest[]> {
    const supabase = createSupabaseClient()

    let query = supabase
      .from('prayer_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (!includePrivate) {
      query = query.eq('is_private', false)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching prayer requests:', error)
      return []
    }

    return (data || []) as PrayerRequest[]
  },

  async getUrgentPrayerRequests(): Promise<PrayerRequest[]> {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
      .from('prayer_requests')
      .select('*')
      .eq('is_urgent', true)
      .eq('is_private', false)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching urgent prayer requests:', error)
      return []
    }

    return (data || []) as PrayerRequest[]
  },

  async updatePrayerRequestStatus(
    id: string,
    status: 'pending' | 'approved' | 'completed' | 'cancelled'
  ): Promise<boolean> {
    const supabase = createSupabaseClient()

    const { error } = await supabase
      .from('prayer_requests')
      .update({ status })
      .eq('id', id)

    if (error) {
      console.error('Error updating prayer request status:', error)
      return false
    }

    return true
  },

  async deletePrayerRequest(id: string): Promise<boolean> {
    const supabase = createSupabaseClient()

    const { error } = await supabase
      .from('prayer_requests')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting prayer request:', error)
      return false
    }

    return true
  }
}