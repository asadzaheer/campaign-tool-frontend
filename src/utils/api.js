import axios from "axios";

const api = axios.create({
  withCredentials: true, // Important for CSRF cookie
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: (credentials) => api.post("/api/login", credentials),
  register: (userData) => api.post("/api/register", userData),
  logout: () => api.post("/api/logout"),
  getUser: () => api.get("/api/user"),
};

// Campaign endpoints
export const campaigns = {
  list: (params) => api.get("/api/campaigns", { params }),
  get: (id) => api.get(`/api/campaigns/${id}`),
  create: (campaign) => api.post("/api/campaigns", campaign),
  update: (id, campaign) => api.put(`/api/campaigns/${id}`, campaign),
  delete: (id) => api.delete(`/api/campaigns/${id}`),
};

export default api;
