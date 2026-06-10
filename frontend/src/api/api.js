import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

export const authApi = {
  login: async (credentials) => {
    const response = await api.post("/v1/auth/login", credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/v1/auth/register", userData);
    return response.data;
  },

  me: async () => {
    const response = await api.get("/v1/auth/me");
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/v1/auth/logout");
    return response.data;
  }
};

export const cafeApi = {
  getCafes: async () => {
    const response = await api.get("/cafes");
    return response.data;
  },
  vote: async (id) => {
    const response = await api.post(`/cafes/${id}/vote`);
    return response.data;
  },
  addReview: async (id, reviewData) => {
    const response = await api.post(`/cafes/${id}/reviews`, reviewData);
    return response.data;
  },
};

export const favoriteApi = {
  getFavorites: async () => {
    const response = await api.get(`/favorites`);
    return response.data;
  },
  toggle: async (cafeId) => {
    const response = await api.post(`/favorites/${cafeId}/toggle`);
    return response.data;
  },
};

export const adminApi = {
  getUsers: async () => api.get('/v1/admin/users'),
  updateUserRole: async (userId, role) => api.put(`/v1/admin/users/${userId}/role`, { role }),
  deleteUser: async (userId) => api.delete(`/v1/admin/users/${userId}`),
  getCafes: async () => api.get('/v1/admin/cafes'),
  createCafe: async (cafeData) => api.post('/v1/admin/cafes', cafeData),
  updateCafe: async (cafeId, cafeData) => api.put(`/v1/admin/cafes/${cafeId}`, cafeData),
  deleteCafe: async (cafeId) => api.delete(`/v1/admin/cafes/${cafeId}`),
  getReviews: async () => api.get('/v1/admin/reviews'),
  deleteReview: async (reviewId) => api.delete(`/v1/admin/reviews/${reviewId}`),
};

export default api;
