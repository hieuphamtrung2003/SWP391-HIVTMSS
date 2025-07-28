// stores/appointmentStore.js
import { create } from 'zustand';
import axios from 'setup/configAxios';
import { toast } from 'react-toastify';

export const useAppointmentStore = create((set, get) => ({
    // State
    accounts: [],
    selectedAccount: null,
    accountDetails: null,
    loading: true,
    detailsLoading: false,
    isDetailsOpen: false,
    pagination: {
        pageNo: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 1,
        last: false
    },
    filters: {
        searchTerm: '',
        sortDir: 'asc',
        sortBy: 'id', // API uses 'id' as default
        status: 'COMPLETED' // Chỉ lấy các appointment đã hoàn thành
    },

    // Actions
    setIsDetailsOpen: (isOpen) => set({ isDetailsOpen: isOpen }),
    setPagination: (pagination) => set({ pagination }),
    setFilters: (filters) => set({ filters }),
    setLoading: (value) => set({ loading: value }),

    // Helper function to process appointments data
    processAppointmentsData: (appointments) => {
        const completedAppointments = appointments.filter(appointment =>
            appointment.status === 'COMPLETED'
        );

        return completedAppointments.map(appointment => {
            const customer = appointment.customer || {};
            const doctor = appointment.doctor || {};

            const customerNameParts = customer.full_name ? customer.full_name.trim().split(' ') : [];
            const customerFirstName = customerNameParts.pop() || '';
            const customerLastName = customerNameParts.join(' ') || '';

            return {
                // Appointment info
                appointment_id: appointment.appointment_id,
                chief_complaint: appointment.chief_complaint,
                medical_history: appointment.medical_history,
                status: appointment.status,
                start_time: appointment.start_time,
                end_time: appointment.end_time,
                created_date: appointment.created_date,
                full_name: appointment.full_name,

                // Customer info - với đầy đủ fields từ API
                customer_id: customer.customer_id,
                customer_full_name: customer.full_name,
                customer_first_name: customerFirstName,
                customer_last_name: customerLastName,
                customer_email: customer.email,
                customer_phone: customer.phone,
                customer_gender: customer.gender,
                customer_dob: customer.dob,
                customer_address: customer.address,

                // Doctor info
                doctor_id: doctor.doctor_id,
                doctor_full_name: doctor.full_name,
                doctor_phone: doctor.phone,
                doctor_gender: doctor.gender,


                // Medical info
                is_pregnant: appointment.is_pregnant,
                is_anonymous: appointment.is_anonymous,
                applicable: appointment.applicable,

                // IDs for fetching related data
                diagnosis_id: appointment.diagnosis_id,
                treatment_id: appointment.treatment_id,
            };
        });
    },

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
                searchTerm: '',
                sortDir: 'asc',
                sortBy: 'id',
                status: 'COMPLETED' // Luôn giữ filter status là COMPLETED
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

            // Lấy tất cả appointments với pageSize lớn để có thể lọc đúng
            const params = {
                pageNo: 0,
                pageSize: 1000, // Lấy một lượng lớn để lọc
                sortBy: filters.sortBy,
                sortDir: filters.sortDir,
            };

            // Only add searchTerm if it's not empty
            if (filters.searchTerm && filters.searchTerm.trim()) {
                params.searchTerm = filters.searchTerm.trim();
            }

            console.log('API call params:', params);

            const response = await axios.get('/api/v1/appointments/all', { params });

            console.log('API response:', response);

            if (response.http_status === 200 && response.data) {
                const responseData = response.data;

                // Process và lọc chỉ completed appointments
                const allAppointments = responseData.content ?
                    get().processAppointmentsData(responseData.content) : [];

                console.log('All completed appointments:', allAppointments.length);

                // Tính toán pagination cho completed appointments
                const totalCompleted = allAppointments.length;
                const totalPages = Math.ceil(totalCompleted / pagination.pageSize) || 1;
                const startIndex = pagination.pageNo * pagination.pageSize;
                const endIndex = startIndex + pagination.pageSize;
                const currentPageAppointments = allAppointments.slice(startIndex, endIndex);

                // Update state với pagination đúng
                set({
                    accounts: currentPageAppointments,
                    pagination: {
                        pageNo: pagination.pageNo,
                        pageSize: pagination.pageSize,
                        totalElements: totalCompleted,
                        totalPages: totalPages,
                        last: pagination.pageNo >= totalPages - 1,
                    }
                });
            } else {
                // No data found or error
                set({
                    accounts: [],
                    pagination: {
                        pageNo: 0,
                        pageSize: pagination.pageSize,
                        totalElements: 0,
                        totalPages: 0,
                        last: true
                    }
                });
            }
        } catch (error) {
            toast.error('Không thể tải danh sách lịch khám đã hoàn thành');
            console.error('Error fetching completed appointments:', error);
            set({
                accounts: [],
                pagination: {
                    pageNo: 0,
                    pageSize: pagination.pageSize,
                    totalElements: 0,
                    totalPages: 0,
                    last: true
                }
            });
        } finally {
            set({ loading: false });
        }
    },

    fetchAccountDetails: async (appointmentId) => {
        try {
            set({ detailsLoading: true });
            const { accounts } = get();
            const appointmentDetails = accounts.find(account => account.appointment_id === appointmentId);

            if (appointmentDetails) {
                set({ accountDetails: appointmentDetails });
            } else {
                toast.error('Không tìm thấy thông tin lịch khám');
            }
        } catch (error) {
            toast.error('Không thể tải thông tin chi tiết lịch khám');
            console.error('Error fetching appointment details:', error);
        } finally {
            set({ detailsLoading: false });
        }
    },

    handleViewDetails: async (account) => {
        set({
            selectedAccount: account,
            isDetailsOpen: true,
        });
        await get().fetchAccountDetails(account.appointment_id);
    },
}));