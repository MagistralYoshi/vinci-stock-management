import axios from 'axios'

// Get API URL from environment or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('app_currentUser')
  if (user) {
    const { token } = JSON.parse(user)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export default {
  items: {
    getAll: () => api.get('/items'),
    create: (data) => api.post('/items', data),
    update: (id, data) => api.put(`/items/${id}`, data),
    delete: (id) => api.delete(`/items/${id}`)
  },
  history: {
    getAll: () => api.get('/history'),
    getByItem: (itemId) => api.get(`/history/item/${itemId}`)
  },
  health: {
    check: () => api.get('/health')
  }
}
