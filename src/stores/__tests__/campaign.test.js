import './setup'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCampaignStore } from '../campaign'
import { campaigns } from '@/utils/api'

// Mock the API module
vi.mock('@/utils/api', () => ({
  campaigns: {
    create: vi.fn(),
    list: vi.fn(),
    update: vi.fn(),
    get: vi.fn(),
    delete: vi.fn()
  }
}))

describe('Campaign Store', () => {
  let store

  beforeEach(() => {
    store = useCampaignStore()
    vi.clearAllMocks()
  })

  describe('createCampaign', () => {
    it('should create campaign successfully', async () => {
      const campaignData = {
        name: 'Test Campaign',
        description: 'Test Description'
      }
      
      campaigns.create.mockResolvedValue({ data: campaignData })
      
      await store.createCampaign(campaignData)
      
      expect(campaigns.create).toHaveBeenCalledWith(campaignData)
    })

    it('should handle creation error', async () => {
      const error = new Error('Creation failed')
      campaigns.create.mockRejectedValue(error)
      
      await expect(store.createCampaign({})).rejects.toThrow('Creation failed')
    })
  })

  describe('getCampaigns', () => {
    it('should fetch campaigns with default parameters', async () => {
      const response = {
        data: {
          items: [
            { id: 1, name: 'Campaign 1' },
            { id: 2, name: 'Campaign 2' }
          ]
        }
      }
      
      campaigns.list.mockResolvedValue(response)
      
      const result = await store.getCampaigns()
      
      expect(campaigns.list).toHaveBeenCalledWith({
        page: 1,
        search: '',
        status: ''
      })
      expect(result).toEqual(response.data)
    })

    it('should fetch campaigns with custom parameters', async () => {
      const params = {
        page: 2,
        search: 'test',
        status: 'active'
      }
      
      campaigns.list.mockResolvedValue({ data: [] })
      
      await store.getCampaigns(params)
      
      expect(campaigns.list).toHaveBeenCalledWith(params)
    })

    it('should handle fetch error', async () => {
      const error = new Error('Fetch failed')
      campaigns.list.mockRejectedValue(error)
      
      await expect(store.getCampaigns()).rejects.toThrow('Fetch failed')
    })
  })

  describe('updateCampaign', () => {
    it('should update campaign successfully', async () => {
      const id = 1
      const updateData = { name: 'Updated Campaign' }
      const response = { data: { id, ...updateData } }
      
      campaigns.update.mockResolvedValue(response)
      
      const result = await store.updateCampaign(id, updateData)
      
      expect(campaigns.update).toHaveBeenCalledWith(id, updateData)
      expect(result).toEqual(response.data)
    })

    it('should handle update error', async () => {
      const error = new Error('Update failed')
      campaigns.update.mockRejectedValue(error)
      
      await expect(store.updateCampaign(1, {})).rejects.toThrow('Update failed')
    })
  })

  describe('getCampaign', () => {
    it('should fetch single campaign successfully', async () => {
      const id = 1
      const response = {
        data: { id, name: 'Test Campaign' }
      }
      
      campaigns.get.mockResolvedValue(response)
      
      const result = await store.getCampaign(id)
      
      expect(campaigns.get).toHaveBeenCalledWith(id)
      expect(result).toEqual(response.data)
    })

    it('should handle fetch error', async () => {
      const error = new Error('Fetch failed')
      campaigns.get.mockRejectedValue(error)
      
      await expect(store.getCampaign(1)).rejects.toThrow('Fetch failed')
    })
  })

  describe('deleteCampaign', () => {
    it('should delete campaign successfully', async () => {
      const id = 1
      campaigns.delete.mockResolvedValue({})
      
      await store.deleteCampaign(id)
      
      expect(campaigns.delete).toHaveBeenCalledWith(id)
    })

    it('should handle delete error', async () => {
      const error = new Error('Delete failed')
      campaigns.delete.mockRejectedValue(error)
      
      await expect(store.deleteCampaign(1)).rejects.toThrow('Delete failed')
    })
  })
})
