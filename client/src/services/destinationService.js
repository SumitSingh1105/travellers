import api from './api';

export const destinationService = {
  getDestinations: async (params = {}) => {
    const response = await api.get('/destinations', { params });
    return response.data;
  },

  getDestinationById: async (id) => {
    const response = await api.get(`/destinations/${id}`);
    return response.data;
  },

  createDestination: async (data) => {
    const response = await api.post('/destinations', data);
    return response.data;
  },

  updateDestination: async (id, data) => {
    const response = await api.put(`/destinations/${id}`, data);
    return response.data;
  },

  deleteDestination: async (id) => {
    const response = await api.delete(`/destinations/${id}`);
    return response.data;
  },
};
