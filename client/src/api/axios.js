import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'https://airchat-production-309d.up.railway.app/api',
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle different status codes
      if (error.response.status === 401) {
        toast.error('Unauthorized - Please login');
      } else if (error.response.status === 403) {
        toast.error('Forbidden - You do not have permission');
      } else if (error.response.status === 404) {
        toast.error('Not Found - The requested resource was not found');
      } else if (error.response.status >= 500) {
        toast.error('Server Error - Please try again later');
      }
    } else if (error.request) {
      toast.error('Network Error - Please check your connection');
    } else {
      toast.error('Error - Something went wrong');
    }
    
    return Promise.reject(error);
  }
);

export default api;