import axios from 'axios'

// ─── Base Configuration ───────────────────────────────────────────────────────

const BASE_URL = 'https://uzbekneftegaz-backend.onrender.com'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// ─── Request Interceptor (attach token) ──────────────────────────────────────
// Read directly from localStorage to avoid a circular dependency with store.js

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor (handle 401) ───────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authAPI = {
  login: async (credentials) => {
    const response = await apiClient.post('/api/auth/login', credentials)
    return response.data
  },
  
  register: async (data) => {
    const response = await apiClient.post('/api/auth/register', data)
    return response.data
  },
}

// ─── News / Posts API ────────────────────────────────────────────────────────

export const newsAPI = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/api/news', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/news/${id}`)
    return response.data
  },

  create: async (data) => {
    // If data contains files, use FormData
    const isFormData = data instanceof FormData
    const response = await apiClient.post('/api/news', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    })
    return response.data
  },

  update: async (id, data) => {
    const isFormData = data instanceof FormData
    const response = await apiClient.put(`/api/news/${id}`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    })
    return response.data
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/api/news/${id}`)
    return response.data
  },
}

// ─── Generic CRUD Factory ─────────────────────────────────────────────────────
// Creates a standard CRUD service for any resource endpoint

export const createResourceAPI = (endpoint) => ({
  getAll: async (params = {}) => {
    const response = await apiClient.get(endpoint, { params })
    return response.data
  },
  getById: async (id) => {
    const response = await apiClient.get(`${endpoint}/${id}`)
    return response.data
  },
  create: async (data) => {
    const isFormData = data instanceof FormData
    const response = await apiClient.post(endpoint, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    })
    return response.data
  },
  update: async (id, data) => {
    const isFormData = data instanceof FormData
    const response = await apiClient.put(`${endpoint}/${id}`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    })
    return response.data
  },
  delete: async (id) => {
    const response = await apiClient.delete(`${endpoint}/${id}`)
    return response.data
  },
})

export const postsAPI = createResourceAPI('/api/posts')
export const productsAPI = createResourceAPI('/api/products')
export const announcementsAPI = createResourceAPI('/api/announcements')
