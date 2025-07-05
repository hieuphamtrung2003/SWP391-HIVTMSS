import { create } from 'zustand';
import axios from 'setup/configAxios';
import { toast } from 'react-toastify';

const useTestTypeStore = create((set, get) => ({
  // State
  testTypes: [],
  filteredTestTypes: [],
  loading: true,
  currentTestType: null,
  formData: {
    applicable: '',
    test_type_name: '',
    test_type_description: '',
    test_type_code: '',
  },
  searchTerm: '',
  statusFilter: 'ALL',
  sortBy: 'test_type_id',
  sortDirection: 'asc',
  currentPage: 1,
  itemsPerPage: 10,
  isDialogOpen: false,
  isSubmitting: false,

  // Setters
  setSearchTerm: (value) => {
    set({ searchTerm: value, currentPage: 1 });
    get().applyFilters();
  },
  setStatusFilter: (value) => {
    set({ statusFilter: value, currentPage: 1 });
    get().applyFilters();
  },
  setSortBy: (value) => {
    set({ sortBy: value });
    get().applyFilters();
  },
  setSortDirection: (value) => {
    set({ sortDirection: value });
    get().applyFilters();
  },
  setCurrentPage: (page) => set({ currentPage: page }),
  setFormData: (data) => set({ formData: data }),
  setIsDialogOpen: (open) => set({ isDialogOpen: open }),
  setIsSubmitting: (val) => set({ isSubmitting: val }),

  // API
  fetchTestTypes: async () => {
    try {
      set({ loading: true });
      const res = await axios.get('/api/v1/test-types/all');
      set({ testTypes: res.data || [] });
      get().applyFilters();
    } catch (err) {
      toast.error('Không thể tải danh sách loại xét nghiệm');
    } finally {
      set({ loading: false });
    }
  },

  submitTestType: async () => {
    const { currentTestType, formData } = get();
    try {
      set({ isSubmitting: true });

      if (currentTestType) {
        await axios.put(`/api/v1/test-types?id=${currentTestType.test_type_id}`, formData);
        toast.success('Cập nhật thành công');
      } else {
        await axios.post('/api/v1/test-types', formData);
        toast.success('Tạo mới thành công');
      }

      await get().fetchTestTypes();
      set({ isDialogOpen: false });
      get().resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Thao tác thất bại');
    } finally {
      set({ isSubmitting: false });
    }
  },

  toggleStatus: async (id, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await axios.patch(`/api/v1/test-types/status?id=${id}`, { status: newStatus });
      toast.success('Cập nhật trạng thái thành công');
      await get().fetchTestTypes();
    } catch {
      toast.error('Không thể cập nhật trạng thái');
    }
  },

  // Edit + Reset
  editTestType: (item) => {
    set({
      currentTestType: item,
      formData: {
        applicable: item.applicable,
        test_type_name: item.test_type_name,
        test_type_description: item.test_type_description,
        test_type_code: item.test_type_code,
      },
      isDialogOpen: true
    });
  },

  resetForm: () => {
    set({
      currentTestType: null,
      formData: {
        applicable: '',
        test_type_name: '',
        test_type_description: '',
        test_type_code: '',
      }
    });
  },

  // Filter + Sort
  applyFilters: () => {
    const {
      testTypes, searchTerm, statusFilter, sortBy, sortDirection
    } = get();

    let filtered = [...testTypes];

    if (searchTerm.trim() !== '') {
      const keyword = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.test_type_name?.toLowerCase().includes(keyword) ||
        item.applicable?.toLowerCase().includes(keyword)
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(item => item.is_active === statusFilter);
    }

    filtered.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    set({ filteredTestTypes: filtered });
  },

  // Computed
  get totalPages() {
    return Math.ceil(get().filteredTestTypes.length / get().itemsPerPage);
  },
}));

export default useTestTypeStore;
