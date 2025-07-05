// stores/patientStore.js
import { create } from 'zustand';
import axios from 'setup/configAxios';
import { toast } from 'react-toastify';

export const usePatientStore = create((set, get) => ({
    // State
    patients: [],
    selectedPatient: null,
    patientDetails: null,
    loading: true,
    detailsLoading: false,
    isDetailsOpen: false,
    pagination: {
        pageNo: 0,
        pageSize: 30,
        totalElements: 0,
        totalPages: 1,
        last: false,
        first: true
    },
    filters: {
        searchTerm: '',
        sortDir: 'asc',
        sortBy: 'id',
    },

    // Actions
    setPatients: (patients) => set({ patients }),
    setSelectedPatient: (patient) => set({ selectedPatient: patient }),
    setPatientDetails: (details) => set({ patientDetails: details }),
    setLoading: (loading) => set({ loading }),
    setDetailsLoading: (loading) => set({ detailsLoading: loading }),
    setIsDetailsOpen: (isOpen) => set({ isDetailsOpen: isOpen }),
    setPagination: (pagination) => set({ pagination }),
    setFilters: (filters) => set({ filters }),

    // Combined actions
    updateFilter: (key, value) => {
        set(state => ({
            filters: { ...state.filters, [key]: value },
            pagination: { ...state.pagination, pageNo: 0 }
        }));
    },

    handlePageChange: (newPage) => {
        const { pagination } = get();
        if (newPage >= 0 && newPage < pagination.totalPages) {
            set({ pagination: { ...pagination, pageNo: newPage } });
            get().fetchPatients();
        }
    },

    handleResetFilters: () => {
        set({
            filters: {
                searchTerm: '',
                sortDir: 'asc',
                sortBy: 'id',
            },
            pagination: {
                pageNo: 0,
                pageSize: 30,
                totalPages: 1,
                totalElements: 0,
                last: false,
                first: true
            }
        });
        get().fetchPatients();
    },

    fetchPatients: async () => {
        const { pagination, filters } = get();
        try {
            set({ loading: true });
            const response = await axios.get('/api/v1/accounts/admin/all', {
                params: {
                    pageNo: pagination.pageNo,
                    pageSize: pagination.pageSize,
                    role: 'CUSTOMER',
                    sortBy: filters.sortBy,
                    sortDir: filters.sortDir,
                    keyword: filters.searchTerm,
                },
            });

            // Handle response data
            const responseData = response.data;

            set({
                patients: responseData.content || [],
                pagination: {
                    pageNo: responseData.page_no || 0,
                    pageSize: responseData.page_size || 30,
                    totalElements: responseData.total_elements || 0,
                    totalPages: responseData.total_pages || 1,
                    last: responseData.last || false,
                    first: responseData.first || true
                }
            });
        } catch (error) {
            toast.error('Không thể tải danh sách bệnh nhân');
            console.error('Error fetching patients:', error);
            set({ patients: [] });
        } finally {
            set({ loading: false });
        }
    },

    fetchPatientDetails: async (patientId) => {
        try {
            set({ detailsLoading: true });
            const response = await axios.get(`/api/v1/accounts/admin?id=${patientId}`);
            set({ patientDetails: response.data });
        } catch (error) {
            toast.error('Không thể tải chi tiết bệnh nhân');
            console.error('Error fetching patient details:', error);
            set({ patientDetails: null });
        } finally {
            set({ detailsLoading: false });
        }
    },

    handleViewDetails: async (patient) => {
        set({
            selectedPatient: patient,
            isDetailsOpen: true,
        });
        await get().fetchPatientDetails(patient.account_id);
    },

    // Search function
    handleSearch: () => {
        const { pagination } = get();
        set({
            pagination: { ...pagination, pageNo: 0 }
        });
        get().fetchPatients();
    },

    // Navigate to specific page
    goToPage: (pageNumber) => {
        const { pagination } = get();
        const targetPage = Math.max(0, Math.min(pageNumber, pagination.totalPages - 1));
        set({
            pagination: { ...pagination, pageNo: targetPage }
        });
        get().fetchPatients();
    },

    // Navigate to first page
    goToFirstPage: () => {
        const { pagination } = get();
        set({
            pagination: { ...pagination, pageNo: 0 }
        });
        get().fetchPatients();
    },

    // Navigate to last page
    goToLastPage: () => {
        const { pagination } = get();
        set({
            pagination: { ...pagination, pageNo: pagination.totalPages - 1 }
        });
        get().fetchPatients();
    },

    // Change page size
    changePageSize: (newSize) => {
        set({
            pagination: {
                ...get().pagination,
                pageSize: newSize,
                pageNo: 0
            }
        });
        get().fetchPatients();
    },

    // Utility functions
    getTotalPages: () => {
        const { pagination } = get();
        return pagination.totalPages;
    },

    getCurrentPage: () => {
        const { pagination } = get();
        return pagination.pageNo + 1; // Display page number (1-based)
    },

    getTotalElements: () => {
        const { pagination } = get();
        return pagination.totalElements;
    },

    getPageInfo: () => {
        const { pagination } = get();
        const start = pagination.pageNo * pagination.pageSize + 1;
        const end = Math.min((pagination.pageNo + 1) * pagination.pageSize, pagination.totalElements);
        return {
            start,
            end,
            total: pagination.totalElements,
            currentPage: pagination.pageNo + 1,
            totalPages: pagination.totalPages
        };
    },

    // Check if can navigate
    canGoNext: () => {
        const { pagination } = get();
        return !pagination.last && pagination.pageNo < pagination.totalPages - 1;
    },

    canGoPrevious: () => {
        const { pagination } = get();
        return !pagination.first && pagination.pageNo > 0;
    },

    // Filter patients by status
    filterByStatus: (status) => {
        const { patients } = get();
        if (status === 'all') return patients;
        return patients.filter(patient => {
            if (status === 'active') return !patient.is_locked;
            if (status === 'locked') return patient.is_locked;
            return true;
        });
    },

    // Get patient statistics
    getPatientStats: () => {
        const { patients } = get();
        const total = patients.length;
        const active = patients.filter(p => !p.is_locked).length;
        const locked = patients.filter(p => p.is_locked).length;

        return {
            total,
            active,
            locked,
            activePercentage: total > 0 ? ((active / total) * 100).toFixed(1) : 0,
            lockedPercentage: total > 0 ? ((locked / total) * 100).toFixed(1) : 0
        };
    }
}));