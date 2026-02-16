import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// ⭐ ADD: Simple cache for GET requests (30 second TTL)
const requestCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000, // ⭐ FIX: 10 second timeout - prevents infinite loading
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token and handle caching
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ⭐ ADD: Check cache for GET requests only
    if (config.method === 'get' && config.url) {
      const cacheKey = config.url;
      const cached = requestCache.get(cacheKey);
      
      // Return cached data if still valid
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('✅ Cache hit:', cacheKey);
        // Override adapter to return cached data immediately
        config.adapter = () => {
          return Promise.resolve({
            data: cached.data,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: config,
          } as AxiosResponse);
        };
      }
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and cache successful GET responses
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // ⭐ ADD: Cache successful GET responses
    if (response.config.method === 'get' && response.config.url && response.status === 200) {
      const cacheKey = response.config.url;
      requestCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });
      console.log('💾 Cached:', cacheKey);
    }

    return response;
  },
  (error: AxiosError) => {
    // ⭐ FIX: Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - is your backend running?');
    }

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }
    
    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found');
    }
    
    // Handle 422 Validation Error
    if (error.response?.status === 422) {
      console.error('Validation error', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// ⭐ ADD: Function to clear cache (call after mutations)
export const clearCache = (pattern?: string) => {
  if (pattern) {
    // Clear specific entries matching pattern
    const keysToDelete: string[] = [];
    requestCache.forEach((_, key) => {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => requestCache.delete(key));
    console.log('🗑️ Cleared cache for:', pattern);
  } else {
    // Clear all cache
    requestCache.clear();
    console.log('🗑️ Cleared all cache');
  }
};

export default api;