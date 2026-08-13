import api from './api';

export const guideService = {
  getGuides: async (params = {}) => {
    const response = await api.get('/guides', { params });
    return response.data;
  },

  getGuideById: async (id) => {
    const response = await api.get(`/guides/${id}`);
    return response.data;
  },

  updateGuide: async (id, data) => {
    const response = await api.put(`/guides/${id}`, data);
    return response.data;
  },
};
