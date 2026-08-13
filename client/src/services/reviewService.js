import api from './api';

export const reviewService = {
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  getGuideReviews: async (guideId) => {
    const response = await api.get(`/reviews/guide/${guideId}`);
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};

export const userService = {
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateProfile: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  toggleSaveDestination: async (destinationId) => {
    const response = await api.post(`/users/saved-destinations/${destinationId}`);
    return response.data;
  },

  getSavedDestinations: async () => {
    const response = await api.get('/users/saved-destinations');
    return response.data;
  },

  getGuideStats: async () => {
    const response = await api.get('/users/stats/guide');
    return response.data;
  },

  getTravelerStats: async () => {
    const response = await api.get('/users/stats/traveler');
    return response.data;
  },
};
