// stores/accountStore.js
import { create } from 'zustand';
import axios from 'setup/configAxios';
import { toast } from 'react-toastify';

export const useAccountStore = create((set, get) => ({
  // State
  accounts: [],
  selectedAccount: null,
  accountDetails: null,
  loading: true,
  detailsLoading: false,
  isDetailsOpen: false,
  isCreateOpen: false,
  isEditMode: false,
  pagination: {
    pageNo: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 1,
    last: false
  },
  filters: {
    role: 'ALL',
    searchTerm: '',
    sortDir: 'asc',
    sortBy: 'id',
  },
  formValue: {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    role_name: "",
  },
  editFormData: {
    last_name: '',
    first_name: '',
    gender: '',
    phone: '',
    address: '',
    dob: '',
    role_id: 1,
  },

  // Actions
  setAccounts: (accounts) => set({ accounts }),
  setSelectedAccount: (account) => set({ selectedAccount: account }),
  setAccountDetails: (details) => set({ accountDetails: details }),
  setLoading: (loading) => set({ loading }),
  setDetailsLoading: (loading) => set({ detailsLoading: loading }),
  setIsDetailsOpen: (isOpen) => set({ isDetailsOpen: isOpen }),
  setIsCreateOpen: (isOpen) => set({ isCreateOpen: isOpen }),
  setIsEditMode: (isEdit) => set({ isEditMode: isEdit }),
  setPagination: (pagination) => set({ pagination }),
  setFilters: (filters) => set({ filters }),
  setFormValue: (formValue) => set({ formValue }),
  setEditFormData: (editFormData) => set({ editFormData }),

  // Combined actions
  updateFilter: (key, value) => {
    set(state => ({
      filters: { ...state.filters, [key]: value },
      pagination: { ...state.pagination, pageNo: 0 }
    }));
    get().fetchAccounts();
  },

  handlePageChange: (newPage) => {
    const { pagination } = get();
    if (newPage >= 0 && newPage < pagination.totalPages) {
      set({ pagination: { ...pagination, pageNo: newPage } });
      get().fetchAccounts();
    }
  },

  handleResetFilters: () => {
    set({
      filters: {
        role: 'ALL',
        searchTerm: '',
        sortDir: 'asc',
        sortBy: 'id',
      },
      pagination: {
        pageNo: 0,
        pageSize: 10,
        totalPages: 1,
        totalElements: 0,
        last: false,
      }
    });
    get().fetchAccounts();
  },

  fetchAccounts: async () => {
    const { pagination, filters } = get();
    try {
      set({ loading: true });
      const response = await axios.get('/api/v1/accounts/admin/all', {
        params: {
          pageNo: pagination.pageNo,
          pageSize: pagination.pageSize,
          role: filters.role,
          sortBy: filters.sortBy,
          sortDir: filters.sortDir,
          keyword: filters.searchTerm,
        },
      });

      set({
        accounts: response.data.content,
        pagination: {
          pageNo: response.data.page_no,
          pageSize: response.data.page_size,
          totalElements: response.data.total_elements,
          totalPages: response.data.total_pages,
          last: response.data.last
        }
      });
    } catch (error) {
      toast.error('Failed to fetch accounts');
      console.error('Error fetching accounts:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchAccountDetails: async (accountId) => {
    try {
      set({ detailsLoading: true });
      const response = await axios.get(`api/v1/accounts/admin?id=${accountId}`);
      set({ accountDetails: response.data });
    } catch (error) {
      toast.error('Failed to fetch account details');
      console.error('Error fetching account details:', error);
    } finally {
      set({ detailsLoading: false });
    }
  },

  handleViewDetails: async (account) => {
    set({
      selectedAccount: account,
      isDetailsOpen: true,
      isEditMode: false
    });
    await get().fetchAccountDetails(account.account_id);
  },

  handleUpdateAccount: async () => {
    const { accountDetails, editFormData } = get();
    try {
      set({ detailsLoading: true });
      await axios.put(`/api/v1/accounts/admin?id=${accountDetails.account_id}`, editFormData);
      toast.success('Đã cập nhật tài khoản thành công!');
      get().fetchAccounts();
      await get().fetchAccountDetails(accountDetails.account_id);
      set({ isEditMode: false });
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi cập nhật tài khoản');
      console.error('Error updating account:', error);
    } finally {
      set({ detailsLoading: false });
    }
  },

  handleCreateStaff: async (e) => {
    e.preventDefault();
    const { formValue } = get();

    // Validation
    if (!formValue.first_name.trim() || !formValue.last_name.trim() || !formValue.email.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const res = await axios.post("/api/v1/accounts/admin/new-account", formValue);
      if (res?.http_status === 201) {
        toast.success("Đăng ký thành công!");
        set({ isCreateOpen: false });
        get().fetchAccounts();
      } else {
        toast.error("Đăng ký không thành công. Vui lòng thử lại!");
      }
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;
        toast.error(message || "Lỗi máy chủ. Đăng ký không thành công!");
      } else {
        toast.error("Không thể kết nối đến máy chủ!");
      }
      console.error("Registration failed:", error);
    }
  }
}));