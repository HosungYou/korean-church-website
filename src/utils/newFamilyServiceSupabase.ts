import { createSupabaseClient } from '@/lib/supabaseClient'
import type { Database } from '@/types/supabase'

type NewFamilyRow = Database['public']['Tables']['new_families']['Row']
type NewFamilyInsert = Database['public']['Tables']['new_families']['Insert']
type NewFamilyUpdate = Database['public']['Tables']['new_families']['Update']

export interface NewFamily extends NewFamilyRow {
  id: string
}

export interface CreateNewFamilyInput {
  name: string
  email?: string
  phone: string
  address?: string
  birthDate?: string
  gender?: 'male' | 'female' | 'other'
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed'
  previousChurch?: string
  baptized?: boolean
  baptismDate?: string
  introductionMethod?: string
  notes?: string
}

export const newFamilyService = {
  async createNewFamily(input: CreateNewFamilyInput): Promise<NewFamily | null> {
    const supabase = createSupabaseClient()

    const familyData: NewFamilyInsert = {
      name: input.name,
      email: input.email || null,
      phone: input.phone,
      address: input.address || null,
      birth_date: input.birthDate || null,
      gender: input.gender || null,
      marital_status: input.maritalStatus || null,
      previous_church: input.previousChurch || null,
      baptized: input.baptized || false,
      baptism_date: input.baptismDate || null,
      introduction_method: input.introductionMethod || null,
      notes: input.notes || null,
      status: 'pending'
    }

    const { data, error } = await supabase
      .from('new_families')
      .insert(familyData)
      .select()
      .single()

    if (error) {
      console.error('Error creating new family:', error)
      return null
    }

    // Send notification email to admin
    await this.sendNewFamilyNotification(data as NewFamily)

    return data as NewFamily
  },

  async getNewFamilies(
    status?: 'pending' | 'contacted' | 'visiting' | 'registered' | 'inactive'
  ): Promise<NewFamily[]> {
    const supabase = createSupabaseClient()

    let query = supabase
      .from('new_families')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching new families:', error)
      return []
    }

    return (data || []) as NewFamily[]
  },

  async getNewFamily(id: string): Promise<NewFamily | null> {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
      .from('new_families')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching new family:', error)
      return null
    }

    return data as NewFamily
  },

  async updateNewFamilyStatus(
    id: string,
    status: 'pending' | 'contacted' | 'visiting' | 'registered' | 'inactive'
  ): Promise<boolean> {
    const supabase = createSupabaseClient()

    const { error } = await supabase
      .from('new_families')
      .update({ status })
      .eq('id', id)

    if (error) {
      console.error('Error updating new family status:', error)
      return false
    }

    return true
  },

  async assignNewFamily(id: string, assignedToId: string): Promise<boolean> {
    const supabase = createSupabaseClient()

    const { error } = await supabase
      .from('new_families')
      .update({ assigned_to: assignedToId })
      .eq('id', id)

    if (error) {
      console.error('Error assigning new family:', error)
      return false
    }

    return true
  },

  async updateNewFamily(id: string, updates: Partial<NewFamilyUpdate>): Promise<boolean> {
    const supabase = createSupabaseClient()

    const { error } = await supabase
      .from('new_families')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('Error updating new family:', error)
      return false
    }

    return true
  },

  async deleteNewFamily(id: string): Promise<boolean> {
    const supabase = createSupabaseClient()

    const { error } = await supabase
      .from('new_families')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting new family:', error)
      return false
    }

    return true
  },

  async sendNewFamilyNotification(family: NewFamily): Promise<void> {
    // TODO: Implement email notification using your preferred email service
    // For now, just log to console
    console.log('New family registration notification:', {
      name: family.name,
      phone: family.phone,
      email: family.email
    })
  },

  async getStatistics(): Promise<{
    total: number
    pending: number
    contacted: number
    visiting: number
    registered: number
    inactive: number
  }> {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
      .from('new_families')
      .select('status')

    if (error) {
      console.error('Error fetching statistics:', error)
      return {
        total: 0,
        pending: 0,
        contacted: 0,
        visiting: 0,
        registered: 0,
        inactive: 0
      }
    }

    const families = data || []
    return {
      total: families.length,
      pending: families.filter(f => f.status === 'pending').length,
      contacted: families.filter(f => f.status === 'contacted').length,
      visiting: families.filter(f => f.status === 'visiting').length,
      registered: families.filter(f => f.status === 'registered').length,
      inactive: families.filter(f => f.status === 'inactive').length
    }
  }
}