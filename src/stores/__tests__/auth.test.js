import './setup'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthStore } from '../auth'
import { auth } from '@/utils/api'

// Mock the API module
vi.mock('@/utils/api', () => ({
  auth: {
    register: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    getUser: vi.fn()
  }
}))

describe('Auth Store', () => {
  let store

  beforeEach(() => {
    store = useAuthStore()
    // Clear localStorage before each test
    localStorage.clear()
    // Reset all mocks
    vi.clearAllMocks()
  })

  describe('setUser', () => {
    it('should set user data and authentication state', () => {
      const userData = { id: 1, email: 'test@example.com' }
      store.setUser(userData)
      
      expect(store.user).toEqual(userData)
      expect(store.isAuthenticated).toBe(true)
    })
  })

  describe('clearUser', () => {
    it('should clear user data and authentication state', () => {
      store.setUser({ id: 1 })
      store.clearUser()
      
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('register', () => {
    it('should register user successfully', async () => {
      const userData = { email: 'test@example.com', password: 'password' }
      const response = {
        data: {
          token: 'fake-token',
          user: { id: 1, email: userData.email }
        }
      }
      
      auth.register.mockResolvedValue(response)
      
      await store.register(userData)
      
      expect(auth.register).toHaveBeenCalledWith(userData)
      expect(localStorage.getItem('token')).toBe('fake-token')
      expect(store.user).toEqual(response.data.user)
      expect(store.isAuthenticated).toBe(true)
    })

    it('should handle registration error', async () => {
      const error = new Error('Registration failed')
      auth.register.mockRejectedValue(error)
      
      await expect(store.register({})).rejects.toThrow('Registration failed')
    })
  })

  describe('login', () => {
    it('should login user successfully', async () => {
      const credentials = { email: 'test@example.com', password: 'password' }
      const response = {
        data: {
          token: 'fake-token',
          user: { id: 1, email: credentials.email }
        }
      }
      
      auth.login.mockResolvedValue(response)
      
      await store.login(credentials)
      
      expect(auth.login).toHaveBeenCalledWith(credentials)
      expect(localStorage.getItem('token')).toBe('fake-token')
      expect(store.user).toEqual(response.data.user)
      expect(store.isAuthenticated).toBe(true)
    })

    it('should handle login error', async () => {
      const error = new Error('Login failed')
      auth.login.mockRejectedValue(error)
      
      await expect(store.login({})).rejects.toThrow('Login failed')
    })
  })

  describe('logout', () => {
    it('should logout user successfully', async () => {
      // Setup initial authenticated state
      store.setUser({ id: 1 })
      localStorage.setItem('token', 'fake-token')
      
      auth.logout.mockResolvedValue({ status: 200 })
      
      await store.logout()
      
      expect(auth.logout).toHaveBeenCalled()
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })

    it('should handle logout error', async () => {
      auth.logout.mockResolvedValue({ status: 400 })
      
      await expect(store.logout()).rejects.toThrow('Logout failed')
    })
  })
})
