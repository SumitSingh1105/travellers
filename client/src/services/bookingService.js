import api from './api';

export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  getBookings: async (params = {}) => {
    const response = await api.get('/bookings', { params });
    return response.data;
  },

  getMyBookings: async () => {
    const response = await api.get('/bookings/my');
    return response.data;
  },

  getGuideBookings: async () => {
    const response = await api.get('/bookings/guide');
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  updateBookingStatus: async (id, status) => {
    const response = await api.put(`/bookings/${id}`, { status });
    return response.data;
  },
};
