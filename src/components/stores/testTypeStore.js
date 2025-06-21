// stores/testTypeStore.js
import { create } from 'zustand';
import axios from 'setup/configAxios';
import { toast } from 'react-toastify';

const useTestTypeStore = create((set, get) => ({
  // State
  testTypes: [],
  filteredTestTypes: [],
  loading: true,
  currentTestType: null,
  searchTerm: '',
  statusFilter: 'ALL',
  currentPage: 1,
  itemsPerPage: 10,
  isDialogOpen: false,
  isDeleteDialogOpen: false,
  isSubmitting: false,
  formData: {
    applicable: '',
    test_type_name: '',
    test_type_description: '',
    test_type_code: '',
  },

  // Actions
  setFormData: (data) => set({ formData: data }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
  setIsDialogOpen: (isDialogOpen) => set({ isDialogOpen }),
  setIsDeleteDialogOpen: (isDeleteDialogOpen) => set({ isDeleteDialogOpen }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

  // API Actions
  fetchTestTypes: async () => {
    try {
      set({ loading: true });
      const response = await axios.get('/api/v1/test-types/all');
      set({ 
        testTypes: response.data,
        filteredTestTypes: response.data,
        loading: false 
      });
    } catch (error) {
      toast.error('Failed to fetch test types');
      set({ loading: false });
    }
  },

  submitTestType: async () => {
    try {
      set({ isSubmitting: true });
      const { currentTestType, formData } = get();

      if (currentTestType) {
        await axios.put(`/api/v1/test-types?id=${currentTestType.test_type_id}`, formData);
        toast.success('Test type updated successfully');
      } else {
        await axios.post('/api/v1/test-types', formData);
        toast.success('Test type created successfully');
      }
      
      get().fetchTestTypes();
      set({ 
        isDialogOpen: false,
        isSubmitting: false,
        formData: {
          applicable: '',
          test_type_name: '',
          test_type_description: '',
          test_type_code: '',
        },
        currentTestType: null
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
      set({ isSubmitting: false });
    }
  },

  toggleStatus: async (testTypeId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await axios.patch(`/api/v1/test-types/status?id=${testTypeId}`, {
        status: newStatus,
      });
      toast.success(`Test type status updated to ${newStatus}`);
      get().fetchTestTypes();
    } catch (error) {
      toast.error('Failed to update status');
    }
  },

  // Helper functions
  editTestType: (testType) => {
    set({
      currentTestType: testType,
      formData: {
        applicable: testType.applicable,
        test_type_name: testType.test_type_name,
        test_type_description: testType.test_type_description,
        test_type_code: testType.test_type_code,
      },
      isDialogOpen: true
    });
  },

  resetForm: () => {
    set({
      formData: {
        applicable: '',
        test_type_name: '',
        test_type_description: '',
        test_type_code: '',
      },
      currentTestType: null
    });
  },

  // Computed values
  get totalPages() {
    return Math.ceil(get().filteredTestTypes.length / get().itemsPerPage);
  },

  get paginatedData() {
    const { filteredTestTypes, currentPage, itemsPerPage } = get();
    return filteredTestTypes.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }
}));

export default useTestTypeStore;