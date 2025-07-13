import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, X, ChevronRight, Eye } from "lucide-react";
import axios from "setup/configAxios";
import { format, startOfMonth, endOfMonth, addMonths, parse } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "../../ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../../ui/pagination";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../../ui/dialog";

const AllAppointmentChanges = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        pageNo: 0,
        pageSize: 10,
        totalPages: 0,
        totalElements: 0,
    });
    const [sortConfig, setSortConfig] = useState({
        sortBy: "id",
        sortDir: "asc",
    });
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const getMonthRange = () => {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        return {
            startTime: start.toISOString(),
            endTime: end.toISOString(),
        };
    };

    const fetchAllChanges = async () => {
        setLoading(true);
        setError(null);

        try {
            const { startTime, endTime } = getMonthRange();
            const response = await axios.get("api/v1/appointment-changes/all", {
                params: {
                    pageNo: pagination.pageNo,
                    pageSize: pagination.pageSize,
                    sortBy: sortConfig.sortBy,
                    sortDir: sortConfig.sortDir,
                    status: "ALL",
                    type: "ALL",
                    startTime,
                    endTime,
                },
            });

            const pageData = response.data.appointment_change_responses;
            setRequests(pageData.content || []);
            setPagination({
                ...pagination,
                totalPages: pageData.total_pages,
                totalElements: pageData.total_elements,
            });
        } catch (err) {
            setError("Không thể tải dữ liệu");
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "N/A";
        try {
            const date = parse(dateStr, "yyyy-MM-dd HH:mm:ss.SSS", new Date());
            return format(date, "HH:mm dd/MM/yyyy", { locale: vi });
        } catch {
            return dateStr;
        }
    };

    const handleView = async (request) => {
        const appointmentDetail = await getAppointmentDetail(request.appointment_id);

        const start = parse(appointmentDetail?.start_time, "MM/dd/yyyy HH:mm:ss", new Date());
        const end = parse(appointmentDetail?.end_time, "MM/dd/yyyy HH:mm:ss", new Date());

        const dayOfWeek = format(start, "EEEE", { locale: vi }); // Thứ Hai, Thứ Ba...
        const startTime = format(start, "HH:mm");
        const endTime = format(end, "HH:mm");

        setSelectedRequest({
            ...request,
            appointmentDetail: {
                full_name: appointmentDetail?.is_anonymous ? "Bệnh nhân ẩn danh" : appointmentDetail?.full_name,
                chief_complaint: appointmentDetail?.chief_complaint || "Không rõ",
                dayOfWeek,
                startTime,
                endTime,
            },
        });
        setDialogOpen(true);
    };

    const handlePrevMonth = () => {
        setCurrentDate((prev) => addMonths(prev, -1));
    };

    const handleNextMonth = () => {
        setCurrentDate((prev) => addMonths(prev, 1));
    };

    const handlePageChange = (pageNo) => {
        setPagination({ ...pagination, pageNo });
    };

    useEffect(() => {
        fetchAllChanges();
    }, [currentDate, pagination.pageNo, sortConfig]);

    const getAppointmentDetail = async (appointmentId) => {
        try {
            const res = await axios.get("api/v1/appointments", {
                params: { appointmentId },
            });
            return res.data;
        } catch (err) {
            console.error("Lỗi lấy thông tin lịch hẹn:", err);
            return null;
        }
    };


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto p-4"
        >
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center p-6 pb-4 gap-4">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Tất cả yêu cầu chuyển lịch
                    </h2>
                    {/* Month Navigation */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handlePrevMonth}
                                className="h-8 w-8"
                                disabled={loading}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="font-medium text-gray-700 min-w-[120px] text-center">
                                Tháng {format(currentDate, "MM/yyyy")}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleNextMonth}
                                className="h-8 w-8"
                                disabled={loading}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Error Message */}
                {error && (
                    <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}
                {/* Loading Indicator */}
                {loading ? (
                    <div className="text-center py-6 text-blue-600">Đang tải dữ liệu...</div>
                ) : (
                    <div className="overflow-x-auto px-6 pb-6">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-blue-50">
                                    <th className="p-3 border border-gray-200 font-medium text-center text-blue-700">STT</th>
                                    <th className="p-3 border border-gray-200 font-medium text-center text-blue-700">Bác sĩ gửi</th>
                                    <th className="p-3 border border-gray-200 font-medium text-center text-blue-700">Bác sĩ nhận</th>
                                    <th className="p-3 border border-gray-200 font-medium text-center text-blue-700">Lý do</th>
                                    <th className="p-3 border border-gray-200 font-medium text-center text-blue-700">Ngày yêu cầu</th>
                                    <th className="p-3 border border-gray-200 font-medium text-center text-blue-700">Trạng thái</th>
                                    <th className="p-3 border border-gray-200 font-medium text-center text-blue-700">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center p-6">
                                            <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                                            Không có yêu cầu chuyển lịch hẹn nào trong tháng này
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((request, index) => (
                                        <tr key={request.appointment_change_id}
                                            className="bg-white hover:bg-gray-50">
                                            <td className="p-3 border border-gray-200 border-gray-200 text-center">
                                                {pagination.pageNo * pagination.pageSize + index + 1}
                                            </td>
                                            <td className="p-3 border border-gray-200">
                                                <span className="font-medium">{request.old_doctor.full_name}</span>
                                                <br />
                                                <span className="text-sm text-gray-500">
                                                    {request.old_doctor.phone} – {request.old_doctor.gender === "MALE" ? "Nam" : "Nữ"}
                                                </span>
                                            </td>
                                            <td className="p-3 border border-gray-200">
                                                <span className="font-medium">{request.new_doctor.full_name}</span>
                                                <br />
                                                <span className="text-sm text-gray-500">
                                                    {request.new_doctor.phone} – {request.new_doctor.gender === "MALE" ? "Nam" : "Nữ"}
                                                </span>
                                            </td>
                                            <td className="p-3 border border-gray-200">{
                                                request.reason}
                                            </td>
                                            <td className="p-3 border border-gray-200 text-center">
                                                {formatDateTime(request.created_date)}
                                            </td>
                                            <td className="p-3 border border-gray-200 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap
                                                 ${request.status === "PENDING" ? "bg-yellow-100 text-yellow-800"
                                                        : request.status === "ACCEPTED" ? "bg-green-100 text-green-800"
                                                            : request.status === "REJECTED" ? "bg-red-100 text-red-800"
                                                                : request.status === "CANCELLED" ? "bg-gray-100 text-gray-600"
                                                                    : "bg-gray-200 text-gray-800"
                                                    }`}>
                                                    {request.status === "PENDING" ? "Chờ xử lý" :
                                                        request.status === "ACCEPTED" ? "Đã chấp nhận" :
                                                            request.status === "REJECTED" ? "Đã từ chối" :
                                                                request.status === "CANCELLED" ? "Đã hủy" : request.status}
                                                </span>
                                            </td>
                                            <td className="p-3 border border-gray-200 text-center">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleView(request)}
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    Xem
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {requests.length > 0 && (
                    <div className="px-6 py-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500 bg-gray-50">
                        <div>
                            <p>
                                Hiển thị {pagination.pageNo * pagination.pageSize + 1}-
                                {Math.min((pagination.pageNo + 1) * pagination.pageSize, pagination.totalElements)} trên tổng số {pagination.totalElements} yêu cầu
                            </p>
                        </div>
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => handlePageChange(Math.max(pagination.pageNo - 1, 0))}
                                        disabled={pagination.pageNo === 0}
                                    />
                                </PaginationItem>

                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    const pageNumber = i + Math.max(0, pagination.pageNo - 2);
                                    if (pageNumber >= pagination.totalPages) return null;
                                    return (
                                        <PaginationItem key={pageNumber}>
                                            <PaginationLink
                                                isActive={pageNumber === pagination.pageNo}
                                                onClick={() => handlePageChange(pageNumber)}
                                            >
                                                {pageNumber + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => handlePageChange(Math.min(pagination.pageNo + 1, pagination.totalPages - 1))}
                                        disabled={pagination.pageNo >= pagination.totalPages - 1}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>

            {/* View Detail Dialog */}
            <AnimatePresence>
                {dialogOpen && selectedRequest && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={() => setDialogOpen(false)}
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800">Yêu cầu chuyển lịch hẹn</h3>
                                    <button
                                        onClick={() => setDialogOpen(false)}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Tình trạng */}
                                    <div>
                                        <p className="text-sm text-gray-500">Tình trạng</p>
                                        <p className={`font-medium inline-block px-2 py-1 rounded-full text-xs mt-1
                ${selectedRequest.status === "PENDING" ? "bg-yellow-100 text-yellow-800"
                                                : selectedRequest.status === "ACCEPTED" ? "bg-green-100 text-green-800"
                                                    : selectedRequest.status === "REJECTED" ? "bg-red-100 text-red-800"
                                                        : selectedRequest.status === "CANCELLED" ? "bg-gray-100 text-gray-600"
                                                            : "bg-gray-200 text-gray-800"}`}>
                                            {selectedRequest.status === "PENDING" ? "Chờ xử lý"
                                                : selectedRequest.status === "ACCEPTED" ? "Đã chấp nhận"
                                                    : selectedRequest.status === "REJECTED" ? "Đã từ chối"
                                                        : selectedRequest.status === "CANCELLED" ? "Đã hủy"
                                                            : selectedRequest.status}
                                        </p>
                                    </div>

                                    {/* Thông tin lịch hẹn */}
                                    <h4 className="text-lg font-medium text-blue-600 border-b pb-2 mb-4">
                                        Thông tin lịch hẹn
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Bệnh nhân</p>
                                            <p className="font-medium">
                                                {selectedRequest?.appointmentDetail?.full_name || "Không rõ"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Thời gian</p>
                                            <p className="font-medium">
                                                {selectedRequest?.appointmentDetail?.dayOfWeek},{" "}
                                                {selectedRequest?.appointmentDetail?.startTime} - {selectedRequest?.appointmentDetail?.endTime}
                                            </p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <p className="text-sm text-gray-500">Lý do khám</p>
                                            <p className="font-medium">
                                                {selectedRequest?.appointmentDetail?.chief_complaint || "Không rõ"}
                                            </p>
                                        </div>
                                    </div>




                                    {/* Thông tin bác sĩ gửi */}
                                    <div>
                                        <h4 className="text-lg font-medium text-blue-600 border-b pb-2 mb-4">
                                            Bác sĩ gửi
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Họ tên</p>
                                                <p className="font-medium">{selectedRequest.old_doctor.full_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Giới tính</p>
                                                <p className="font-medium">
                                                    {selectedRequest.old_doctor.gender === "MALE" ? "Nam" : "Nữ"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Số điện thoại</p>
                                                <p className="font-medium">{selectedRequest.old_doctor.phone}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Ngày yêu cầu</p>
                                                <p className="font-medium">{formatDateTime(selectedRequest.created_date)}</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <p className="text-sm text-gray-500">Lý do chuyển</p>
                                                <p className="font-medium">{selectedRequest.reason}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Thông tin bác sĩ nhận */}
                                    <div>
                                        <h4 className="text-lg font-medium text-blue-600 border-b pb-2 mb-4">
                                            Bác sĩ nhận
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Họ tên</p>
                                                <p className="font-medium">{selectedRequest.new_doctor.full_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Giới tính</p>
                                                <p className="font-medium">
                                                    {selectedRequest.new_doctor.gender === "MALE" ? "Nam" : "Nữ"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Số điện thoại</p>
                                                <p className="font-medium">{selectedRequest.new_doctor.phone}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Button đóng */}
                                    <div className="flex justify-end pt-4">
                                        <Button onClick={() => setDialogOpen(false)}>Đóng</Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
};

export default AllAppointmentChanges;
