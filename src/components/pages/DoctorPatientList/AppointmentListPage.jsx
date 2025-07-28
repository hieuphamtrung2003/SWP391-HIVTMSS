import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "../../../components/ui/pagination";
import { Loader2, Search, Eye, ChevronDown, ChevronUp, Calendar, ChevronFirst, ChevronLast, X, AlertCircle } from 'lucide-react';
import { Badge } from "../../../components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { useAppointmentStore } from '../../stores/appointmentStore';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'setup/configAxios';
import { decodeToken } from "../../../utils/tokenUtils";

const AppointmentListPage = () => {
    const {
        accounts,
        loading,
        pagination,
        filters,
        fetchAccounts,
        handlePageChange,
        updateFilter,
        setLoading,
        handleResetFilters,
        setPagination
    } = useAppointmentStore();

    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);
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



    const handleSubmit = (e) => {
        e.preventDefault(); // Ngăn reload trang
        fetchAccounts();    // Gọi API lấy dữ liệu mới theo searchTerm
    };

    // Fetch appointments from API
    const fetchAppointments = async () => {
        try {
            const response = await axios.get('api/v1/appointments/all', {

            });

            // Handle response safely
            if (response.data) {
                const data = response.data || {};
                setAppointments(data.content || []);

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

    // Fixed handleViewDetails to open modal with appointment data
    const handleViewDetails = async (appointment) => {
        setSelectedAppointment(appointment);
        setIsModalOpen(true);

        // Reset previous data
        setDiagnosis(null);
        setDiagnosisError(null);
        setTreatment(null);
        setTreatmentError(null);
        setTreatmentPrognosis(null);

        // Fetch diagnosis if exists
        if (appointment.diagnosis_id) {
            await fetchDiagnosis(appointment.appointment_id);
        }

        // Fetch treatment if exists
        if (appointment.treatment_id) {
            await fetchTreatment(appointment.appointment_id);
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

    // Get page information
    const getPageInfo = () => {
        const start = pagination.pageNo * pagination.pageSize + 1;
        const end = Math.min((pagination.pageNo + 1) * pagination.pageSize, pagination.totalElements);
        return {
            start,
            end,
            total: pagination.totalElements,
            currentPage: pagination.pageNo + 1,
            totalPages: pagination.totalPages
        };
    };

    // Navigation functions
    const canGoPrevious = () => pagination.pageNo > 0;
    const canGoNext = () => pagination.pageNo < pagination.totalPages - 1;

    const goToFirstPage = () => {
        if (canGoPrevious()) {
            handlePageChange(0);
        }
    };

    const goToLastPage = () => {
        if (canGoNext()) {
            handlePageChange(pagination.totalPages - 1);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchAccounts();
    };

    const pageInfo = getPageInfo();

    // Status badge component (chỉ hiển thị "Đã hoàn thành")
    const StatusBadge = ({ status }) => {
        return (
            <Badge className="text-xs py-1 px-2 rounded-full bg-green-100 text-green-800">
                Đã hoàn thành
            </Badge>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Danh sách lịch khám</h1>
                    </div>
                </div>

                {/* Filters Card */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Bộ lọc và tìm kiếm</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Sắp xếp theo</label>
                                <Select
                                    value={filters.sortBy}
                                    onValueChange={(value) => updateFilter('sortBy', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trường" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        <SelectItem value="id">ID</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Thứ tự</label>
                                <Select
                                    value={filters.sortDir}
                                    onValueChange={(value) => updateFilter('sortDir', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn thứ tự" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        <SelectItem value="asc">
                                            <div className="flex items-center gap-2">
                                                <ChevronUp className="h-4 w-4" />
                                                <span>Tăng dần</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="desc">
                                            <div className="flex items-center gap-2">
                                                <ChevronDown className="h-4 w-4" />
                                                <span>Giảm dần</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Tìm kiếm</label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Tìm kiếm"
                                        value={filters.searchTerm}
                                        onChange={(e) => updateFilter('searchTerm', e.target.value)}
                                    />
                                    <Button type="submit">
                                        <Search className="h-4 w-4 mr-2" />
                                        Tìm kiếm
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Appointments Table Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Danh sách lịch khám
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <span className="ml-2">Đang tải...</span>
                            </div>
                        ) : (
                            <>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead className="w-[100px]">ID</TableHead>
                                                <TableHead className="w-[200px]">Bệnh nhân</TableHead>
                                                <TableHead className="w-[180px]">Bác sĩ</TableHead>
                                                <TableHead className="w-[300px]">Triệu chứng</TableHead>
                                                <TableHead className="w-[120px]">Trạng thái</TableHead>
                                                <TableHead className="text-right">Thao tác</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {accounts.length > 0 ? (
                                                accounts.map((appointment) => (
                                                    <TableRow key={appointment.appointment_id}>
                                                        <TableCell className="font-medium">
                                                            {appointment.appointment_id}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">
                                                                    {appointment.full_name || 'N/A'}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {appointment.customer_email}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {appointment.customer_phone}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">
                                                                    {appointment.doctor_full_name || 'N/A'}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {appointment.doctor_phone}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="max-w-xs">
                                                                <p className="max-w-[200px] truncate" title={appointment.chief_complaint}>
                                                                    {appointment.chief_complaint || 'Không có thông tin'}
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <StatusBadge status={appointment.status} />
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleViewDetails(appointment)}
                                                                className="hover:bg-muted"
                                                            >
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Xem
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-8">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Search className="h-8 w-8 text-muted-foreground" />
                                                            <p className="text-muted-foreground">Không tìm thấy lịch khám nào</p>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={handleResetFilters}
                                                            >
                                                                Đặt lại bộ lọc
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="mt-4">
                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        onClick={() => handlePageChange(pagination.pageNo - 1)}
                                                        disabled={pagination.pageNo === 0}
                                                    />
                                                </PaginationItem>

                                                <PaginationItem>
                                                    <span className="text-sm text-muted-foreground">
                                                        Page {pagination.pageNo + 1} of {pagination.totalPages}
                                                    </span>
                                                </PaginationItem>

                                                <PaginationItem>
                                                    <PaginationNext
                                                        onClick={() => handlePageChange(pagination.pageNo + 1)}
                                                        disabled={pagination.pageNo === pagination.totalPages - 1 || pagination.last}
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

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
                                        {/* Patient Information - FIXED VERSION */}
                                        <div className="space-y-4">
                                            <h4 className="text-lg font-medium text-blue-600 border-b pb-2">Thông tin bệnh nhân</h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-gray-500">Họ tên</p>
                                                    <p className="font-medium">{selectedAppointment.full_name || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Giới tính</p>
                                                    <p className="font-medium">{formatGender(selectedAppointment.customer_gender)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Email</p>
                                                    <p className="font-medium">{selectedAppointment.customer_email || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Số điện thoại</p>
                                                    <p className="font-medium">{selectedAppointment.customer_phone || 'N/A'}</p>
                                                </div>
                                                {/* Loại bỏ các field không tồn tại như dob, applicable, is_anonymous */}
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

                                        {/* Doctor Information - FIXED VERSION */}
                                        <div className="space-y-4">
                                            <h4 className="text-lg font-medium text-blue-600 border-b pb-2">Thông tin bác sĩ</h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-gray-500">Họ tên</p>
                                                    <p className="font-medium">{selectedAppointment.doctor_full_name || 'Chưa chỉ định'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Giới tính</p>
                                                    <p className="font-medium">{formatGender(selectedAppointment.doctor_gender)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Số điện thoại</p>
                                                    <p className="font-medium">{selectedAppointment.doctor_phone || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Mã bác sĩ</p>
                                                    <p className="font-medium">{selectedAppointment.doctor_id || 'N/A'}</p>
                                                </div>
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
                                                        <p className="text-sm text-gray-500">Hướng dẫn uống thuốc</p>
                                                        <ul className="list-disc list-inside text-sm text-gray-800">
                                                            {treatmentPrognosis.dosage
                                                                ? treatmentPrognosis.dosage
                                                                    .split('\n')
                                                                    .filter(line => line.trim()) // Loại bỏ dòng trống
                                                                    .map((line, index) => (
                                                                        <li key={index} className="text-sm text-gray-800">
                                                                            {line.trim()}
                                                                        </li>
                                                                    ))
                                                                : <li>N/A</li>
                                                            }
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
        </div >
    );
};

export default AppointmentListPage;