import {
  getAllNewFamilyRegistrations,
  getNewFamilyStats,
  updateNewFamilyStatus as updateStatus,
  deleteNewFamilyRegistration,
  type NewFamilyStatus
} from './newFamilyService'
import type { NewFamilyRegistration } from '../../types/supabase'

export type NewFamily = NewFamilyRegistration

export const newFamilyService = {
  async getNewFamilies(status?: NewFamilyStatus): Promise<NewFamily[]> {
    return getAllNewFamilyRegistrations(status)
  },

  async getStatistics() {
    return getNewFamilyStats()
  },

  async updateNewFamilyStatus(id: string, status: NewFamilyStatus, notes?: string) {
    return updateStatus(id, status, notes)
  },

  async deleteNewFamily(id: string) {
    return deleteNewFamilyRegistration(id)
  }
}

export default newFamilyService
