import { Button } from "../../ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import axios from "setup/configAxios";
import { decodeToken } from "../../../utils/tokenUtils";
import { format, startOfWeek, endOfWeek, addWeeks, parse } from "date-fns";
import { vi } from "date-fns/locale";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../../ui/pagination";

const AppointmentTransferRequests = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [requestType, setRequestType] = useState("received"); // 'received' or 'sent'
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
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

    // Get doctor ID from token
    const getDoctorId = () => {
        const token = localStorage.getItem("access_token");
        if (!token) return null;
        const decoded = decodeToken(token);
        return decoded?.id || null;
    };

    // Get current week range (Monday to Sunday)
    const getCurrentWeekRange = () => {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
        const end = endOfWeek(currentDate, { weekStartsOn: 1 }); // Sunday
        return {
            startTime: format(start, "yyyy-MM-dd") + "T00:00:00",
            endTime: format(end, "yyyy-MM-dd") + "T23:59:59",
        };
    };

    const fetchReceivedRequests = async () => {
        const doctorId = getDoctorId();
        if (!doctorId) {
            setError("Không thể lấy thông tin bác sĩ từ token");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { startTime, endTime } = getCurrentWeekRange();

            const response = await axios.get("api/v1/appointment-changes/received-requests", {
                params: {
                    pageNo: pagination.pageNo,
                    pageSize: pagination.pageSize,
                    sortBy: sortConfig.sortBy,
                    sortDir: sortConfig.sortDir,
                    doctorId,
                    startTime,
                    endTime
                },
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                }
            });

            // Filter out PENDING requests with is_approved = false
            const filteredRequests = (response.data.content || []).filter(
                request => !(request.status === "PENDING" && request.is_approved === false)
            );

            setReceivedRequests(filteredRequests);
            setPagination({
                ...pagination,
                totalPages: response.data.total_pages,
                totalElements: response.data.total_elements,
            });
        } catch (err) {
            console.error("Error fetching received transfer requests:", err);
            setError("Không thể tải dữ liệu yêu cầu chuyển lịch hẹn nhận được");
            setReceivedRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchSentRequests = async () => {
        const doctorId = getDoctorId();
        if (!doctorId) {
            setError("Không thể lấy thông tin bác sĩ từ token");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { startTime, endTime } = getCurrentWeekRange();

            const response = await axios.get("api/v1/appointment-changes/sent-requests", {
                params: {
                    pageNo: pagination.pageNo,
                    pageSize: pagination.pageSize,
                    sortBy: sortConfig.sortBy,
                    sortDir: sortConfig.sortDir,
                    doctorId,
                    startTime,
                    endTime
                },
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                }
            });

            // Filter out PENDING requests with is_approved = false
            const filteredRequests = (response.data.content || []).filter(
                request => !(request.status === "PENDING" && request.is_approved === false)
            );

            setSentRequests(filteredRequests);
            setPagination({
                ...pagination,
                totalPages: response.data.total_pages,
                totalElements: response.data.total_elements,
            });
        } catch (err) {
            console.error("Error fetching sent transfer requests:", err);
            setError("Không thể tải dữ liệu yêu cầu chuyển lịch hẹn đã gửi");
            setSentRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRequestStatus = async (appointmentChangeId, status) => {
        try {
            setLoading(true);
            await axios.put(
                `api/v1/appointment-changes?appointmentChangeId=${appointmentChangeId}&status=${status}`,
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                    }
                }
            );

            // Refresh the list after successful update
            await fetchReceivedRequests();
        } catch (err) {
            console.error("Error updating request status:", err);
            setError(`Không thể ${status === "ACCEPTED" ? "chấp nhận" : "từ chối"} yêu cầu`);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = (appointmentChangeId) => {
        handleUpdateRequestStatus(appointmentChangeId, "ACCEPTED");
    };

    const handleRejectRequest = (appointmentChangeId) => {
        handleUpdateRequestStatus(appointmentChangeId, "REJECTED");
    };

    const handlePrevWeek = () => {
        setCurrentDate(addWeeks(currentDate, -1));
    };

    const handleNextWeek = () => {
        setCurrentDate(addWeeks(currentDate, 1));
    };

    const handlePageChange = (pageNo) => {
        setPagination({ ...pagination, pageNo });
    };

    const handleSortChange = (sortBy) => {
        setSortConfig({
            sortBy,
            sortDir: sortConfig.sortDir === "asc" ? "desc" : "asc",
        });
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return "N/A";
        try {
            const date = parse(dateTimeString, "yyyy-MM-dd HH:mm:ss.SSS", new Date());
            return format(date, "HH:mm dd/MM/yyyy", { locale: vi });
        } catch {
            return dateTimeString;
        }
    };

    const getWeekRangeDisplay = () => {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 });
        const end = endOfWeek(currentDate, { weekStartsOn: 1 });
        return `${format(start, "dd/MM")} - ${format(end, "dd/MM/yyyy")}`;
    };

    useEffect(() => {
        if (requestType === "received") {
            fetchReceivedRequests();
        } else {
            fetchSentRequests();
        }
    }, [currentDate, pagination.pageNo, sortConfig, requestType]);

    const currentRequests = requestType === "received" ? receivedRequests : sentRequests;

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
                    <h2 className="text-2xl font-semibold text-gray-800">Yêu Cầu Chuyển Lịch Hẹn</h2>

                    <div className="flex items-center gap-4">
                        {/* Request Type Selector */}
                        <div className="w-[200px]">
                            <Select value={requestType} onValueChange={setRequestType}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Loại yêu cầu">
                                        {requestType === "received" ? "Yêu cầu nhận được" : "Yêu cầu đã gửi"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="received">Yêu cầu nhận được</SelectItem>
                                    <SelectItem value="sent">Yêu cầu đã gửi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Week Navigation */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handlePrevWeek}
                                className="h-8 w-8"
                                disabled={loading}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <span className="font-medium text-gray-700 min-w-[150px] text-center">
                                Tuần {getWeekRangeDisplay()}
                            </span>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleNextWeek}
                                className="h-8 w-8"
                                disabled={loading}
                            >
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
                {loading && (
                    <div className="mx-6 mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-blue-600 text-sm">Đang tải dữ liệu...</p>
                    </div>
                )}

                {/* Requests Table */}
                <div className="overflow-x-auto px-6 pb-6">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-blue-50">
                                <th className="p-3 border border-gray-200 font-medium text-center text-blue-700">
                                    STT
                                </th>
                                {requestType === "received" ? (
                                    <th className="p-3 border border-gray-200 font-medium text-center text-blue-700">
                                        Bác Sĩ Gửi
                                    </th>
                                ) : (
                                    <th className="p-3 border border-gray-200 font-medium text-center text-blue-700">
                                        Bác Sĩ Nhận
                                    </th>
                                )}
                                <th className="p-3 border border-gray-200 font-medium text-center text-blue-700">
                                    Lý Do
                                </th>
                                <th className="p-3 border border-gray-200 font-medium text-center text-blue-700">
                                    Ngày Yêu Cầu
                                </th>
                                <th className="p-3 border border-gray-200 font-medium text-center text-blue-700">
                                    Trạng Thái
                                </th>
                                {requestType === "received" && (
                                    <th className="p-3 border border-gray-200 font-medium text-center text-blue-700">
                                        Hành Động
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {currentRequests.length === 0 && !loading ? (
                                <tr>
                                    <td
                                        colSpan={requestType === "received" ? 6 : 5}
                                        className="p-8 text-center text-gray-500"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            <CalendarIcon className="h-12 w-12 text-gray-400 mb-4" />
                                            <p className="text-gray-500 text-lg">
                                                {requestType === "received"
                                                    ? "Không có yêu cầu chuyển lịch hẹn nhận được nào trong tuần này"
                                                    : "Không có yêu cầu chuyển lịch hẹn đã gửi nào trong tuần này"}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                currentRequests.map((request, index) => (
                                    <tr
                                        key={request.appointment_change_id}
                                        className="bg-white hover:bg-gray-50"
                                    >
                                        <td className="p-3 border border-gray-200 text-center">
                                            {pagination.pageNo * pagination.pageSize + index + 1}
                                        </td>
                                        <td className="p-3 border border-gray-200">
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {requestType === "received"
                                                        ? request.old_doctor.full_name
                                                        : request.new_doctor.full_name}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {requestType === "received"
                                                        ? request.old_doctor.phone
                                                        : request.new_doctor.phone}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {requestType === "received"
                                                        ? (request.old_doctor.gender === "MALE" ? "Nam" : "Nữ")
                                                        : (request.new_doctor.gender === "MALE" ? "Nam" : "Nữ")}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-3 border border-gray-200">
                                            <div className="line-clamp-2" title={request.reason}>
                                                {request.reason}
                                            </div>
                                        </td>
                                        <td className="p-3 border border-gray-200 text-center">
                                            {formatDateTime(request.created_date)}
                                        </td>
                                        <td className="p-3 border border-gray-200 text-center">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${request.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                                                request.status === "ACCEPTED" ? "bg-green-100 text-green-800" :
                                                    request.status === "REJECTED" ? "bg-red-100 text-red-800" :
                                                        request.status === "CANCELLED" ? "bg-gray-100 text-gray-800" :
                                                            "bg-gray-100 text-gray-800"
                                                }`}>
                                                {request.status === "PENDING" ? "Chờ xử lý" :
                                                    request.status === "ACCEPTED" ? "Đã chấp nhận" :
                                                        request.status === "REJECTED" ? "Đã từ chối" :
                                                            request.status === "CANCELLED" ? "Đã hủy" : request.status}
                                            </span>
                                        </td>
                                        {requestType === "received" && (
                                            <td className="p-3 border border-gray-200 text-center">
                                                {request.status === "PENDING" && (
                                                    <div className="flex gap-2 justify-center">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-green-600 border-green-300"
                                                            onClick={() => handleAcceptRequest(request.appointment_change_id)}
                                                            disabled={loading}
                                                        >
                                                            Chấp nhận
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-red-600 border-red-300"
                                                            onClick={() => handleRejectRequest(request.appointment_change_id)}
                                                            disabled={loading}
                                                        >
                                                            Từ chối
                                                        </Button>
                                                    </div>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {currentRequests.length > 0 && (
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
        </motion.div>
    );
};

export default AppointmentTransferRequests;