// stores/treatmentRegimenStore.js
import { create } from 'zustand';
import axios from 'setup/configAxios';
import { toast } from 'react-toastify';

const useTreatmentRegimenStore = create((set, get) => ({
    regimens: [],
    loading: true,
    filters: {
        searchTerm: '',
        status: 'ALL',
        sortBy: 'id',
        sortDir: 'asc',
    },
    pagination: {
        pageNo: 0,
        pageSize: 10,
        totalPages: 1,
        totalElements: 0,
        last: false,
    },

    setFilters: (filters) => set({ filters }),
    updateFilter: (key, value) => {
        set((state) => ({
            filters: { ...state.filters, [key]: value },
            pagination: { ...state.pagination, pageNo: 0 }
        }));
        get().fetchRegimens();
    },
    handlePageChange: (newPage) => {
        const { pagination } = get();
        if (newPage >= 0 && newPage < pagination.totalPages) {
            set({ pagination: { ...pagination, pageNo: newPage } });
            get().fetchRegimens();
        }
    },

    fetchRegimens: async () => {
        const { pagination, filters } = get();
        try {
            set({ loading: true });
            const res = await axios.get('/api/v1/treatment-regimens/list', {
                params: {
                    pageNo: pagination.pageNo,
                    pageSize: pagination.pageSize,
                    keyword: filters.searchTerm,
                    sortBy: filters.sortBy,
                    sortDir: filters.sortDir,
                    status: filters.status !== 'ALL' ? filters.status : null,
                }
            });

            set({
                regimens: res.data.content,
                pagination: {
                    pageNo: res.data.page_no,
                    pageSize: res.data.page_size,
                    totalPages: res.data.total_pages,
                    totalElements: res.data.total_elements,
                    last: res.data.last,
                }
            });
        } catch (err) {
            toast.error('Không thể tải danh sách phác đồ');
        } finally {
            set({ loading: false });
        }
    }
}));

export default useTreatmentRegimenStore;
