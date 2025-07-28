import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosError } from 'axios'

// API Configuration - Dynamic IP detection
const getApiBaseUrl = () => {
  // In production, use the current hostname (VM IP)
  // In development, use environment variable or localhost
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // If running on localhost (development), use localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'localhost';
    }
    
    // If running on VM or any other host, use that hostname
    return hostname;
  }
  
  // Fallback to environment variable or default
  return import.meta.env.VITE_VM_IP || '35.188.75.223';
};

const API_BASE_HOST = getApiBaseUrl();
const API_CONFIG = {
  AUTH_SERVICE: `http://${API_BASE_HOST}:8081/api/v1`,
  ASSESSMENT_SERVICE: `http://${API_BASE_HOST}:8083/api/v1`, 
  DISCUSSION_SERVICE: `http://${API_BASE_HOST}:8082/api/v1`,
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