// src/features/booking/store/useBookingStore.js
import { create } from 'zustand';
import axios from '../../setup/configAxios';

// Zustand store for booking state
const useBookingStore = create((set, get) => ({
  availableDoctors: [],
  selectedDoctor: null,
  appointmentData: {
    gender: '',
    dob: '',
    applicable: 'Adults',
    first_name: '',
    last_name: '',
    start_time: '',
    chief_complaint: '',
    is_pregnant: false,
    is_anonymous: false
  },
  isLoading: false,
  error: null,

  setAvailableDoctors: (doctors) => set({ availableDoctors: doctors }),
  setSelectedDoctor: (doctor) => set({ selectedDoctor: doctor }),
  updateAppointmentData: (data) => set((state) => ({
    appointmentData: { ...state.appointmentData, ...data }
  })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // Fetch available doctors
  fetchAvailableDoctors: async (startTime) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`api/v1/appointments/available-doctors`, {
        params: { startTime }
      });

      // Add validation for the response structure
      if (response.data && Array.isArray(response.data)) {
        set({ availableDoctors: response.data, loading: false });
      } else {
        set({
          availableDoctors: [],
          loading: false,
          error: 'Unexpected response format from server'
        });
      }
    } catch (error) {
      set({
        availableDoctors: [],
        error: error.response?.data?.message || 'Failed to fetch doctors',
        loading: false
      });
    }
  },

  // Create appointment
  createAppointment: async () => {
    const { appointmentData, selectedDoctor } = get();
    set({ isLoading: true, error: null });

    try {
      // Decode token to get customer_id (simplified - you might need to use jwt-decode library)
      const token = localStorage.getItem('access_token');
      let customer_id = null;

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          customer_id = payload.id;
        } catch (e) {
          console.error('Error decoding token:', e);
        }
      }

      const appointmentPayload = {
        ...appointmentData,
        customer_id,
        doctor_id: selectedDoctor?.doctor_id
      };

      const response = await axios.post(
        '/api/v1/appointments',
        appointmentPayload
      );

      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: 'Không thể đặt lịch hẹn', isLoading: false });
      throw error;
    }
  }
}));

export default useBookingStore;