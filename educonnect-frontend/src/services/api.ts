import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { API_CONFIG } from '../constants/api';

class ApiClient {
  private client: AxiosInstance;
  private refreshTokenPromise: Promise<string> | null = null;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newAccessToken = await this.refreshAccessToken();
            if (newAccessToken) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.handleAuthError();
            return Promise.reject(refreshError);
          }
        }

        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  private getAccessToken(): string | null {
    return localStorage.getItem('accessToken') || Cookies.get('accessToken') || null;
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken') || Cookies.get('refreshToken') || null;
  }

  private setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    Cookies.set('accessToken', accessToken, { expires: 1 }); // 1 day
    Cookies.set('refreshToken', refreshToken, { expires: 7 }); // 7 days
  }

  private clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    this.refreshTokenPromise = this.performTokenRefresh(refreshToken);

    try {
      const newAccessToken = await this.refreshTokenPromise;
      return newAccessToken;
    } finally {
      this.refreshTokenPromise = null;
    }
  }

  private async performTokenRefresh(refreshToken: string): Promise<string> {
    const response = await axios.post(
      `${API_CONFIG.AUTH_SERVICE.BASE_URL}${API_CONFIG.AUTH_SERVICE.ENDPOINTS.REFRESH_TOKEN}`,
      { refreshToken }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    this.setTokens(accessToken, newRefreshToken);
    return accessToken;
  }

  private handleAuthError() {
    this.clearTokens();
    window.location.href = '/login';
    toast.error('Session expired. Please login again.');
  }

  private handleError(error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { status: number; data?: { message?: string } }; request?: unknown };
      const status = axiosError.response.status;
      const message = axiosError.response.data?.message || 'An error occurred';

      switch (status) {
        case 400:
          toast.error(`Bad Request: ${message}`);
          break;
        case 403:
          toast.error('Access denied. You do not have permission to perform this action.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 429:
          toast.error('Too many requests. Please try again later.');
          break;
        case 500:
          toast.error('Internal server error. Please try again later.');
          break;
        default:
          toast.error(message);
      }
    } else if (error && typeof error === 'object' && 'request' in error) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred.');
    }
  }

  // Public methods
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  public setAuthTokens(accessToken: string, refreshToken: string) {
    this.setTokens(accessToken, refreshToken);
  }

  public clearAuthTokens() {
    this.clearTokens();
  }

  public isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

// Create API clients for each service
export const authApiClient = new ApiClient(API_CONFIG.AUTH_SERVICE.BASE_URL);
export const assessmentApiClient = new ApiClient(API_CONFIG.ASSESSMENT_SERVICE.BASE_URL);
export const discussionApiClient = new ApiClient(API_CONFIG.DISCUSSION_SERVICE.BASE_URL);

// Utility function to replace path parameters
export const replacePath = (path: string, params: Record<string, string | number>): string => {
  let result = path;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`{${key}}`, String(value));
  });
  return result;
};

// File upload utility
export const uploadFile = async (file: File, apiClient: ApiClient, endpoint: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<{ url: string }>(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.url;
};

// Error handler for async operations
export const handleAsyncError = (error: unknown, defaultMessage = 'An error occurred') => {
  console.error('Async operation error:', error);
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response: { data?: { message?: string } } };
    if (axiosError.response?.data?.message) {
      toast.error(axiosError.response.data.message);
      return;
    }
  }
  toast.error(defaultMessage);
};