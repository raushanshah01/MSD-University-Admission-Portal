// Use environment variable for backend URL, or fallback to same domain in production
const API_BASE = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');
const API = `${API_BASE}/api`;
export default API;
