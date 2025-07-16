
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, AlertCircle, MessageSquare, X, CheckCircle } from 'lucide-react';
import axios from 'setup/configAxios';
import { decodeToken } from "../../../utils/tokenUtils";
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const DoctorSchedule = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        pageNo: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        last: true
    });
    const [sortConfig, setSortConfig] = useState({
        sortBy: 'id',
        sortDir: 'desc'
    });
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [diagnosis, setDiagnosis] = useState(null);
    const [diagnosisLoading, setDiagnosisLoading] = useState(false);
    const [diagnosisError, setDiagnosisError] = useState(null);
    const [treatment, setTreatment] = useState(null);
    const [treatmentLoading, setTreatmentLoading] = useState(false);
    const [treatmentError, setTreatmentError] = useState(null);
    const [treatmentPrognosis, setTreatmentPrognosis] = useState(null);

    // Get doctor ID from token
    const getDoctorId = () => {
        const token = localStorage.getItem('access_token');
        if (!token) return null;

        try {
            const decoded = decodeToken(token);
            return decoded?.id;
        } catch (error) {
            console.error("Token không hợp lệ:", error);
            return null;
        }
    };

    // Fetch appointments from API
    const fetchAppointments = async () => {
        const doctorId = getDoctorId();
        if (!doctorId) {
            setError('Không thể lấy thông tin bác sĩ từ token');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('api/v1/appointments/all', {
                params: {
                    pageNo: pagination.pageNo,
                    pageSize: pagination.pageSize,
                    sortBy: sortConfig.sortBy,
                    sortDir: sortConfig.sortDir
                },
            });

            // Handle response safely
            if (response.data) {
                const data = response.data || {};
                const allAppointments = data.content || [];

                // Filter appointments for current doctor and completed status
                const doctorAppointments = allAppointments.filter(app =>
                    app.doctor?.doctor_id === doctorId && app.status === 'COMPLETED'
                );

                setAppointments(doctorAppointments);
                setPagination({
                    pageNo: data.page_no || 0,
                    pageSize: data.page_size || 10,
                    totalElements: doctorAppointments.length, // Use filtered count
                    totalPages: Math.ceil(doctorAppointments.length / (data.page_size || 10)),
                    last: data.last || true
                });
            } else {
                setError(response.data?.message || 'Không thể tải dữ liệu lịch hẹn');
                setAppointments([]);
            }
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError(err.response?.data?.message || 'Không thể tải dữ liệu lịch hẹn');
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch diagnosis data
    const fetchDiagnosis = async (appointmentId) => {
        setDiagnosisLoading(true);
        setDiagnosisError(null);

        try {
            const response = await axios.get('/api/v1/diagnosis/appointment', {
                params: { appointmentId }
            });
            setDiagnosis(response.data);
        } catch (error) {
            console.error('Error fetching diagnosis:', error);
            setDiagnosisError(error.response?.data?.message || 'Không thể tải dữ liệu chẩn đoán');
        } finally {
            setDiagnosisLoading(false);
        }
    };

    // Fetch treatment data
    const fetchTreatment = async (appointmentId) => {
        setTreatmentLoading(true);
        setTreatmentError(null);

        try {
            const treatmentRes = await axios.get('/api/v1/treatments/appointment', {
                params: { appointmentId }
            });
            setTreatment(treatmentRes.data);

            const appointmentRes = await axios.get('/api/v1/appointments', {
                params: { appointmentId },
            });
            setTreatmentPrognosis(appointmentRes.data);

        } catch (error) {
            console.error('Error fetching treatment:', error);
            setTreatmentError(error.response?.data?.message || 'Không thể tải dữ liệu điều trị');
        } finally {
            setTreatmentLoading(false);
        }
    };

    // Format date to Vietnamese format
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN');
        } catch (e) {
            return 'N/A';
        }
    };

    // Format time to Vietnamese format
    const formatTime = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return 'N/A';
        }
    };

    // Format status to Vietnamese
    const formatStatus = (status) => {
        if (!status) return 'N/A';
        switch (status) {
            case 'PENDING': return 'Chờ xác nhận';
            case 'COMPLETED': return 'Đã hoàn thành';
            case 'CANCELLED': return 'Đã hủy';
            default: return status;
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        if (!status) return 'bg-gray-100 text-gray-800';
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'COMPLETED': return 'bg-green-100 text-green-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Format gender to Vietnamese
    const formatGender = (gender) => {
        if (!gender) return 'N/A';
        return gender === 'MALE' ? 'Nam' : 'Nữ';
    };

    // Handle page change
    const handlePageChange = (newPageNo) => {
        setPagination(prev => ({ ...prev, pageNo: newPageNo }));
    };

    // Handle sort change
    const handleSortChange = (sortBy) => {
        setSortConfig(prev => ({
            sortBy,
            sortDir: prev.sortBy === sortBy ? (prev.sortDir === 'asc' ? 'desc' : 'asc') : 'desc'
        }));
    };

    // handleAppointmentClick
    const handleAppointmentClick = async (appointment) => {
        setSelectedAppointment(appointment);
        setIsModalOpen(true);

        if (appointment.diagnosis_id) {
            await fetchDiagnosis(appointment.appointment_id);
        } else {
            setDiagnosis(null);
        }

        if (appointment.treatment_id) {
            await fetchTreatment(appointment.appointment_id);
        } else {
            setTreatment(null);
            setTreatmentPrognosis(null);
        }
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setDiagnosis(null);
        setDiagnosisError(null);
        setTreatment(null);
        setTreatmentError(null);
        setTreatmentPrognosis(null);
        setTimeout(() => setSelectedAppointment(null), 300);
    };

    // Fetch appointments when component mounts or pagination/sort changes
    useEffect(() => {
        fetchAppointments();
    }, [pagination.pageNo, sortConfig]);

    // Get total completed appointments count
    const completedAppointments = Array.isArray(appointments) ? appointments.length : 0;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Lịch hẹn khám bệnh</h1>
                            <p className="text-gray-600 mt-1">Các lịch hẹn khám bệnh của bệnh nhân</p>
                        </div>
                    </div>
                </div>

                {/* Loading and Error States */}
                {loading && (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center mb-6">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải dữ liệu lịch hẹn...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertCircle className="h-5 w-5 text-red-500" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Appointments List */}
                {!loading && !error && (
                    <div className="space-y-4">
                        {Array.isArray(appointments) && appointments.length > 0 ? (
                            appointments.map((appointment) => (
                                <div
                                    key={appointment?.appointment_id || Math.random()}
                                    className={`bg-white rounded-lg shadow-sm border-l-4 ${appointment?.status === 'PENDING' ? 'border-yellow-500' :
                                        appointment?.status === 'COMPLETED' ? 'border-green-500' :
                                            'border-red-500'
                                        } p-6 hover:shadow-md transition-shadow cursor-pointer`}
                                    onClick={() => handleAppointmentClick(appointment)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            {/* Appointment Info */}
                                            <div className="flex items-center space-x-4 mb-4">
                                                <div className="flex items-center space-x-2">
                                                    <User className="h-5 w-5 text-gray-400" />
                                                    <span className="font-semibold text-gray-900">
                                                        {appointment?.full_name || 'Không có tên'}
                                                    </span>
                                                    {appointment?.is_anonymous && (
                                                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                                                            Ẩn danh
                                                        </span>
                                                    )}
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment?.status)}`}>
                                                    {formatStatus(appointment?.status)}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                {/* Patient Info */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <User className="h-4 w-4" />
                                                        <span>Giới tính: {formatGender(appointment?.gender)}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>Ngày sinh: {formatDate(appointment?.dob)}</span>
                                                    </div>
                                                </div>

                                                {/* Appointment Details */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>Ngày hẹn: {formatDate(appointment?.start_time)}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <Clock className="h-4 w-4" />
                                                        <span>Giờ hẹn: {formatTime(appointment?.start_time)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-sm text-gray-600">
                                                <span>Bác sĩ: </span>
                                                <span className="font-medium">{appointment?.doctor?.full_name || 'Chưa chỉ định'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có lịch hẹn nào</h3>
                                <p className="text-gray-600">Bạn chưa có lịch hẹn khám bệnh nào.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {!loading && Array.isArray(appointments) && appointments.length > 0 && (
                    <div className="flex items-center justify-between mt-6 bg-white rounded-lg shadow-sm p-4">
                        <div className="text-sm text-gray-700">
                            Hiển thị <span className="font-medium">{(pagination.pageNo * pagination.pageSize) + 1}</span> đến{' '}
                            <span className="font-medium">
                                {Math.min((pagination.pageNo + 1) * pagination.pageSize, pagination.totalElements)}
                            </span>{' '}
                            trong tổng số <span className="font-medium">{pagination.totalElements}</span> lịch hẹn
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handlePageChange(pagination.pageNo - 1)}
                                disabled={pagination.pageNo === 0}
                                className={`px-3 py-1 rounded-md ${pagination.pageNo === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            >
                                Trước
                            </button>
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                let pageNum;
                                if (pagination.totalPages <= 5) {
                                    pageNum = i;
                                } else if (pagination.pageNo <= 2) {
                                    pageNum = i;
                                } else if (pagination.pageNo >= pagination.totalPages - 3) {
                                    pageNum = pagination.totalPages - 5 + i;
                                } else {
                                    pageNum = pagination.pageNo - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`px-3 py-1 rounded-md ${pagination.pageNo === pageNum ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        {pageNum + 1}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => handlePageChange(pagination.pageNo + 1)}
                                disabled={pagination.last}
                                className={`px-3 py-1 rounded-md ${pagination.last ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Appointment Detail Modal */}
            <AnimatePresence>
                {isModalOpen && selectedAppointment && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800">Chi tiết lịch hẹn</h3>
                                    <button
                                        onClick={closeModal}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Patient Information */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-medium text-blue-600 border-b pb-2">Thông tin bệnh nhân</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-500">Họ tên</p>
                                                <p className="font-medium">{selectedAppointment.full_name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Giới tính</p>
                                                <p className="font-medium">{formatGender(selectedAppointment.gender)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Ngày sinh</p>
                                                <p className="font-medium">{formatDate(selectedAppointment.dob)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Đối tượng</p>
                                                <p className="font-medium">
                                                    {selectedAppointment.applicable === 'Adults' ? 'Người lớn' : 'Trẻ em'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Ẩn danh</p>
                                                <p className="font-medium">{selectedAppointment.is_anonymous ? 'Có' : 'Không'}</p>
                                            </div>
                                            {!selectedAppointment.is_anonymous && selectedAppointment.customer && (
                                                <>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Số điện thoại</p>
                                                        <p className="font-medium">{selectedAppointment.customer.phone || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Email</p>
                                                        <p className="font-medium">{selectedAppointment.customer.email || 'N/A'}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Appointment Information */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-medium text-blue-600 border-b pb-2">Thông tin lịch hẹn</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-500">Mã lịch hẹn</p>
                                                <p className="font-medium">{selectedAppointment.appointment_id || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Ngày hẹn</p>
                                                <p className="font-medium">{formatDate(selectedAppointment.start_time)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Thời gian</p>
                                                <p className="font-medium">{formatTime(selectedAppointment.start_time)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Trạng thái</p>
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(selectedAppointment.status)}`}>
                                                    {formatStatus(selectedAppointment.status)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Doctor Information */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-medium text-blue-600 border-b pb-2">Thông tin bác sĩ</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-500">Họ tên</p>
                                                <p className="font-medium">{selectedAppointment.doctor?.full_name || 'Chưa chỉ định'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Giới tính</p>
                                                <p className="font-medium">
                                                    {selectedAppointment.doctor?.gender === 'MALE' ? 'Nam' :
                                                        selectedAppointment.doctor?.gender === 'FEMALE' ? 'Nữ' : 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Số điện thoại</p>
                                                <p className="font-medium">
                                                    {selectedAppointment.doctor?.phone ? (
                                                        <p className="font-medium">
                                                            {selectedAppointment.doctor.phone}
                                                        </p>
                                                    ) : 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Mã bác sĩ</p>
                                                <p className="font-medium">{selectedAppointment.doctor?.doctor_id || 'N/A'}</p>
                                            </div>
                                            {selectedAppointment.doctor?.introduction && (
                                                <div>
                                                    <p className="text-sm text-gray-500">Giới thiệu</p>
                                                    <p className="font-medium">{selectedAppointment.doctor.introduction}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Medical Information */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-medium text-blue-600 border-b pb-2">Thông tin y tế</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-500">Triệu chứng chính</p>
                                                <p className="font-medium">{selectedAppointment.chief_complaint || 'Không có thông tin'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Tiền sử bệnh</p>
                                                <p className="font-medium">{selectedAppointment.medical_history || 'Không có thông tin'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Phụ nữ mang thai</p>
                                                <p className="font-medium">{selectedAppointment.is_pregnant ? 'Có' : 'Không'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Ngày tạo lịch hẹn</p>
                                                <p className="font-medium">
                                                    {formatDate(selectedAppointment.created_date)} {formatTime(selectedAppointment.created_date)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Diagnosis Information */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-medium text-blue-600 border-b pb-2">Thông tin chẩn đoán</h4>
                                        {diagnosisLoading ? (
                                            <div className="flex justify-center py-4">
                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                            </div>
                                        ) : diagnosisError ? (
                                            <div className="bg-red-50 border-l-4 border-red-500 p-4">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm text-red-700">{diagnosisError}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : diagnosis ? (
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-gray-500">Loại xét nghiệm</p>
                                                    <p className="font-medium">{diagnosis.testType?.test_type_name || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Kết quả</p>
                                                    <p className="font-medium">
                                                        {diagnosis.result === 'POSITIVE' ? 'Dương tính' :
                                                            diagnosis.result === 'NEGATIVE' ? 'Âm tính' : 'N/A'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Loại virus</p>
                                                    <p className="font-medium">
                                                        {diagnosis.virus_type === 'HIV_1' ? 'HIV-1' :
                                                            diagnosis.virus_type === 'HIV_2' ? 'HIV-2' : 'N/A'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Giai đoạn lâm sàng</p>
                                                    <p className="font-medium">
                                                        {diagnosis.clinical_stage === 'STAGE_I' ? 'Giai đoạn I' :
                                                            diagnosis.clinical_stage === 'STAGE_II' ? 'Giai đoạn II' :
                                                                diagnosis.clinical_stage === 'STAGE_III' ? 'Giai đoạn III' :
                                                                    diagnosis.clinical_stage === 'STAGE_IV' ? 'Giai đoạn IV' : 'N/A'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Ngày chuẩn đoán</p>
                                                    <p className="font-medium">{formatDate(diagnosis.createdDate)} {formatTime(diagnosis.createdDate)}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">Không có thông tin chẩn đoán</p>
                                        )}
                                    </div>

                                    {/* Treatment Information */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-medium text-blue-600 border-b pb-2">Phương pháp điều trị</h4>
                                        {treatmentLoading ? (
                                            <div className="flex justify-center py-4">
                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                            </div>
                                        ) : treatmentError ? (
                                            <div className="bg-red-50 border-l-4 border-red-500 p-4">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm text-red-700">{treatmentError}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : treatment ? (
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-gray-500">Đơn thuốc</p>

                                                    <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                                                        {(treatment.drugs || []).map(drug => (
                                                            <li key={drug.drug_id}>{drug.drug_name} ({drug.short_name}) - {drug.drug_type}</li>
                                                        ))}
                                                    </ul>

                                                </div>


                                                <div>
                                                    <p className="text-sm text-gray-500">Tiên lượng</p>
                                                    <p className="font-medium">{treatmentPrognosis.prognosis || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Phòng ngừa</p>
                                                    <p className="font-medium">{treatmentPrognosis.prevention || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Lịch tái khám</p>
                                                    <p className="font-medium">{formatDate(treatmentPrognosis.next_follow_up)}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">Không có thông tin điều trị</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-between">

                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ml-auto"
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


        </div>
    );
};

export default DoctorSchedule;