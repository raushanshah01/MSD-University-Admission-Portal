
// Use environment variable for backend URL, or fallback to same domain in production
const API_BASE ='https://msd-university-admission-portal-wd7d.onrender.com';

const API_URL = `${API_BASE}/api`;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // Handle token expiration
    if (response.status === 401) {
      // Try to refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${API_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          });
          
          if (refreshResponse.ok) {
            const { token } = await refreshResponse.json();
            localStorage.setItem('token', token);
            // Retry original request
            return { retry: true };
          }
        } catch (err) {
          console.error('Token refresh failed:', err);
        }
      }
      
      // Clear storage and redirect to login
      localStorage.clear();
      window.location.href = '/login';
    }
    
    throw new Error(data.msg || 'An error occurred');
  }
  
  return data;
};

// API methods
export const api = {
  // Auth
  register: (data) => 
    fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),
  
  login: (data) =>
    fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),
  
  logout: () =>
    fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    }).then(handleResponse),
  
  forgotPassword: (email) =>
    fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    }).then(handleResponse),
  
  resetPassword: (token, password) =>
    fetch(`${API_URL}/auth/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    }).then(handleResponse),
  
  verifyEmail: (token) =>
    fetch(`${API_URL}/auth/verify-email/${token}`)
      .then(handleResponse),
  
  // Profile
  getProfile: () =>
    fetch(`${API_URL}/profile`, {
      headers: getAuthHeaders()
    }).then(handleResponse),
  
  updateProfile: (data) =>
    fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),
  
  // Applications
  submitApplication: (formData) =>
    fetch(`${API_URL}/applications`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData
    }).then(handleResponse),
  
  getMyApplications: () =>
    fetch(`${API_URL}/applications/me`, {
      headers: getAuthHeaders()
    }).then(handleResponse),
  
  getApplication: (id) =>
    fetch(`${API_URL}/applications/me/${id}`, {
      headers: getAuthHeaders()
    }).then(handleResponse),
  
  getAllApplications: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return fetch(`${API_URL}/applications?${params}`, {
      headers: getAuthHeaders()
    }).then(handleResponse);
  },
  
  updateApplicationStatus: (id, status, remarks) =>
    fetch(`${API_URL}/applications/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, remarks })
    }).then(handleResponse),
  
  getStatistics: () =>
    fetch(`${API_URL}/applications/admin/statistics`, {
      headers: getAuthHeaders()
    }).then(handleResponse),
  
  // Courses
  getCourses: () =>
    fetch(`${API_URL}/courses`).then(handleResponse),
  
  createCourse: (data) =>
    fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),
  
  updateCourse: (id, data) =>
    fetch(`${API_URL}/courses/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),
  
  deleteCourse: (id) =>
    fetch(`${API_URL}/courses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).then(handleResponse),
  
  // Notifications
  getNotifications: () =>
    fetch(`${API_URL}/notifications`, {
      headers: getAuthHeaders()
    }).then(handleResponse),
  
  markAsRead: (id) =>
    fetch(`${API_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    }).then(handleResponse),
  
  markAllAsRead: () =>
    fetch(`${API_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: getAuthHeaders()
    }).then(handleResponse),
  
  // Announcements
  getAnnouncements: (targetAudience) => {
    const params = targetAudience ? `?targetAudience=${targetAudience}` : '';
    return fetch(`${API_URL}/announcements${params}`).then(handleResponse);
  },
  
  createAnnouncement: (data) =>
    fetch(`${API_URL}/announcements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),
  
  updateAnnouncement: (id, data) =>
    fetch(`${API_URL}/announcements/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),
  
  deleteAnnouncement: (id) =>
    fetch(`${API_URL}/announcements/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).then(handleResponse),
  
  // Contact/Queries
  submitQuery: (data) =>
    fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),
  
  getMyQueries: () =>
    fetch(`${API_URL}/contact/my-queries`, {
      headers: getAuthHeaders()
    }).then(handleResponse),
  
  getAllQueries: (status) => {
    const params = status ? `?status=${status}` : '';
    return fetch(`${API_URL}/contact${params}`, {
      headers: getAuthHeaders()
    }).then(handleResponse);
  },
  
  replyToQuery: (id, reply, status) =>
    fetch(`${API_URL}/contact/${id}/reply`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reply, status })
    }).then(handleResponse),
  
  // Form Progress
  getFormProgress: () =>
    fetch(`${API_URL}/form-progress`, {
      headers: getAuthHeaders()
    }).then(handleResponse),
  
  saveFormProgress: (step, formData) =>
    fetch(`${API_URL}/form-progress`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ step, formData })
    }).then(handleResponse),
  
  clearFormProgress: () =>
    fetch(`${API_URL}/form-progress`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).then(handleResponse)
};

export default API_URL;
