import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosError } from 'axios'

// API Configuration
const API_CONFIG = {
  AUTH_SERVICE: 'http://localhost:8081/api/v1',
  ASSESSMENT_SERVICE: 'http://localhost:8083/api/v1', 
  DISCUSSION_SERVICE: 'http://localhost:8082/api/v1',
}

// Create axios instances for each service
export const authApi = axios.create({
  baseURL: API_CONFIG.AUTH_SERVICE,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const assessmentApi = axios.create({
  baseURL: API_CONFIG.ASSESSMENT_SERVICE,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const discussionApi = axios.create({
  baseURL: API_CONFIG.DISCUSSION_SERVICE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptors to add auth token
const addAuthToken = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

authApi.interceptors.request.use(addAuthToken)
assessmentApi.interceptors.request.use(addAuthToken)
discussionApi.interceptors.request.use(addAuthToken)

// Response interceptors for error handling
const handleAuthError = (error: AxiosError) => {
  // Only logout on auth service 401 errors, not other services
  if (error.response?.status === 401) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
  }
  return Promise.reject(error)
}

const handleServiceError = (error: AxiosError) => {
  // For assessment/discussion services, don't auto-logout on 401
  // Just return the error for the component to handle
  if (error.response?.status === 401) {
    console.warn('Service authentication failed, but keeping user logged in')
  }
  return Promise.reject(error)
}

authApi.interceptors.response.use((response) => response, handleAuthError)
assessmentApi.interceptors.response.use((response) => response, handleServiceError)
discussionApi.interceptors.response.use((response) => response, handleServiceError)

export { API_CONFIG }