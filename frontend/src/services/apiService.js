import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://thesisurs-backend-apsi0hcwa-kims-projects-c1e203af.vercel.app/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  getProfile: () => apiClient.get('/auth/profile'),
  getDepartments: () => apiClient.get('/auth/departments'),
};

export const submissionService = {
  submitThesis: (data) => apiClient.post('/submission/submit', data),
  getMyTheses: () => apiClient.get('/submission/my-theses'),
  getThesisById: (id) => apiClient.get(`/submission/${id}`),
  downloadThesis: (id) => apiClient.get(`/submission/${id}/download`, { responseType: 'blob' }),
};

export const reviewService = {
  submitReview: (data) => apiClient.post('/review/submit-review', data),
  getReviewsForThesis: (thesisId) => apiClient.get(`/review/thesis/${thesisId}`),
  getReviewerDashboard: () => apiClient.get('/review/reviewer/dashboard'),
  addComment: (data) => apiClient.post('/review/add-comment', data),
};

export const searchService = {
  searchTheses: (params) => apiClient.get('/search/theses', { params }),
  getFilters: () => apiClient.get('/search/filters'),
};

export const dashboardService = {
  getAdminDashboard: () => apiClient.get('/dashboard/admin'),
  getStudentDashboard: () => apiClient.get('/dashboard/student'),
  getReviewerDashboard: () => apiClient.get('/dashboard/reviewer'),
};

export default apiClient;
