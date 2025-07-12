import { Button } from "../../ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon } from "lucide-react";
import axios from "setup/configAxios";
import { decodeToken } from "../../../utils/tokenUtils";
import { format, startOfWeek, endOfWeek, addWeeks, startOfMonth, endOfMonth, parse } from "date-fns";
import { vi } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Textarea } from "../../ui/textarea";
import { toast } from "react-toastify";

const DoctorRequestsManager = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("week");
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDoctorInfo, setSelectedDoctorInfo] = useState(null);
  const [transferReason, setTransferReason] = useState("");
  const navigate = useNavigate();

  const days = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const monthNames = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
    "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
    "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];

  const getDateForDay = (currentDate, dayIndex) => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const dayDate = new Date(weekStart);
    dayDate.setDate(weekStart.getDate() + dayIndex);
    return format(dayDate, "dd/MM");
  };

  const getDoctorId = () => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;
    const decoded = decodeToken(token);
    return decoded?.id || null;
  };

  const getDayOfWeekVietnamese = (dateString) => {
    const date = parse(dateString, "MM/dd/yyyy HH:mm:ss", new Date());
    return format(date, "EEEE", { locale: vi });
  };

  const getTimeRange = (startTimeString, endTimeString) => {
    if (!startTimeString) return "N/A";

    const startDate = parse(startTimeString, "MM/dd/yyyy HH:mm:ss", new Date());
    let formattedTime = format(startDate, "HH:mm");

    if (endTimeString) {
      const endDate = parse(endTimeString, "MM/dd/yyyy HH:mm:ss", new Date());
      formattedTime += ` - ${format(endDate, "HH:mm")}`;
    }

    return formattedTime;
  };

  const formatAppointmentsForDisplay = (appointmentData) => {
    const formatted = {};

    // Filter out cancelled appointments entirely
    const filteredAppointments = appointmentData.filter(
      appointment => appointment.status !== "CANCELLED"
    );

    filteredAppointments.forEach(appointment => {
      const dayOfWeek = getDayOfWeekVietnamese(appointment.start_time);
      const timeRange = getTimeRange(appointment.start_time, appointment.end_time);

      if (dayOfWeek && timeRange) {
        if (!formatted[dayOfWeek]) {
          formatted[dayOfWeek] = {};
        }

        formatted[dayOfWeek][timeRange] = {
          patientName: appointment.is_anonymous ? "Bệnh nhân ẩn danh" : appointment.full_name,
          patientId: appointment.customer?.customer_id || "N/A",
          doctor: appointment.doctor?.full_name || "N/A",
          reason: appointment.chief_complaint || "Khám tổng quát",
          status: appointment.status === "PENDING" ? "Chờ xác nhận" :
            appointment.status === "COMPLETED" ? "Đã hoàn thành" : appointment.status,
          gender: appointment.gender === "MALE" ? "Nam" : "Nữ",
          dob: format(new Date(appointment.dob), "dd/MM/yyyy") || "N/A",
          appointmentId: appointment.appointment_id,
          startTime: appointment.start_time,
          endTime: appointment.end_time,
          medicalHistory: appointment.medical_history || "Không có",
          isPregnant: appointment.is_pregnant ? "Có" : "Không",
          diagnosis: appointment.prognosis || "Chưa chẩn đoán",
          prevention: appointment.prevention || "Không có",
          isAnonymous: appointment.is_anonymous,
          applicable: appointment.applicable === "Adults" ? "Người lớn" : "Trẻ em",
          createdDate: format(new Date(appointment.created_date), "dd/MM/yyyy HH:mm"),
          phone: appointment.customer?.phone || appointment.doctor?.phone || "N/A",
          rawStatus: appointment.status,
          timeRange
        };
      }
    });

    return formatted;
  };

  const fetchAppointments = async () => {
    const doctorId = getDoctorId();
    if (!doctorId) {
      setError("Không thể lấy thông tin bác sĩ từ token");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let startTime, endTime;

      if (viewMode === "week") {
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        startTime = format(weekStart, "yyyy-MM-dd") + "T00:00:00";
        endTime = format(weekEnd, "yyyy-MM-dd") + "T23:59:59";
      } else {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        startTime = format(monthStart, "yyyy-MM-dd") + "T00:00:00";
        endTime = format(monthEnd, "yyyy-MM-dd") + "T23:59:59";
      }

      const response = await axios.get("api/v1/appointments/by-range", {
        params: {
          startTime,
          endTime,
          doctorId
        },
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
      });

      if (response.data) {
        setAppointments(response.data);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Không thể tải dữ liệu lịch hẹn");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableDoctors = async (startTimeString) => {
    try {
      const date = parse(startTimeString, "MM/dd/yyyy HH:mm:ss", new Date());
      const formattedStartTime = format(date, "yyyy-MM-dd'T'HH:mm:ss");

      const response = await axios.get("api/v1/appointments/available-doctors", {
        params: { startTime: formattedStartTime },
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      setAvailableDoctors(response.data || []);
    } catch (err) {
      console.error("Error fetching available doctors:", err);
      setAvailableDoctors([]);
    }
  };

  const handleDoctorSelect = (doctorId) => {
    setSelectedDoctorId(doctorId);
    const doctor = availableDoctors.find(d => d.doctor_id === doctorId);
    setSelectedDoctorInfo(doctor);
  };

  const handleTransferAppointment = async () => {
    if (!selectedDoctorId || !transferReason) {
      setTransferError("Vui lòng chọn bác sĩ và nhập lý do");
      return;
    }

    setTransferLoading(true);
    setTransferError(null);

    try {
      await axios.post("api/v1/appointment-changes", null, {
        params: {
          appointmentId: selectedAppointment.appointmentId,
          doctorId: selectedDoctorId,
          reason: transferReason
        },
      });

      await fetchAppointments();
      toast.success("Chuyển lịch hẹn thành công");
      setIsTransferModalOpen(false);
      setSelectedDoctorId("");
      setSelectedDoctorInfo(null);
      setTransferReason("");
      closeModal();
    } catch (err) {
      console.error("Error transferring appointment:", err);
      setTransferError("Có lỗi xảy ra khi chuyển lịch hẹn. Vui lòng thử lại.");
    } finally {
      setTransferLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentDate, viewMode]);

  const formattedAppointments = formatAppointmentsForDisplay(appointments);

  // Get filtered appointments (non-cancelled) for counting
  const filteredAppointments = appointments.filter(appointment => appointment.status !== "CANCELLED");

  const handlePrevPeriod = () => {
    if (viewMode === "week") {
      setCurrentDate(addWeeks(currentDate, -1));
    } else {
      setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    }
  };

  const handleNextPeriod = () => {
    if (viewMode === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    }
  };

  const handleYearChange = (year) => {
    setCurrentDate(new Date(year, currentMonth, 1));
  };

  const handleCellClick = async (day, timeRange) => {
    const appointment = formattedAppointments[day]?.[timeRange];
    if (appointment) {
      setSelectedAppointment({
        ...appointment,
        day,
        timeRange
      });
      setIsModalOpen(true);
    }
  };

  const openTransferModal = async () => {
    await fetchAvailableDoctors(selectedAppointment.startTime);
    setIsTransferModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsTransferModalOpen(false);
    setSelectedDoctorId("");
    setSelectedDoctorInfo(null);
    setTransferReason("");
    setTransferError(null);
    setTimeout(() => setSelectedAppointment(null), 300);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã hoàn thành": return "bg-green-100 text-green-800";
      case "Chờ xác nhận": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    const date = parse(dateTimeString, "MM/dd/yyyy HH:mm:ss", new Date());
    return format(date, "HH:mm dd/MM/yyyy", { locale: vi });
  };

  const getWeekRange = () => {
    const start = startOfWeek(currentDate);
    const end = endOfWeek(currentDate);
    return `${format(start, "dd/MM")} - ${format(end, "dd/MM/yyyy")}`;
  };

  const getAllAppointmentTimes = () => {
    const times = new Set();
    Object.values(formattedAppointments).forEach(dayAppointments => {
      Object.keys(dayAppointments).forEach(timeRange => {
        times.add(timeRange);
      });
    });
    return Array.from(times).sort();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto p-4"
    >
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Calendar Header */}
        <div className="flex flex-col md:flex-row justify-between items-center p-6 pb-4 gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">Lịch Trình Khám Bệnh</h2>

          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex border rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("week")}
                className={`px-3 py-1 text-sm ${viewMode === "week" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
              >
                Tuần
              </button>
              <button
                onClick={() => setViewMode("month")}
                className={`px-3 py-1 text-sm ${viewMode === "month" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
              >
                Tháng
              </button>
            </div>

            {/* Year Selector */}
            <div className="flex items-center gap-2">
              <select
                value={currentYear}
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Period Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevPeriod}
                className="h-8 w-8"
                disabled={loading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="font-medium text-gray-700 min-w-[150px] text-center">
                {viewMode === "week" ? (
                  `Tuần ${getWeekRange()}`
                ) : (
                  monthNames[currentMonth]
                )}
              </span>

              <Button
                variant="outline"
                size="icon"
                onClick={handleNextPeriod}
                className="h-8 w-8"
                disabled={loading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Today Button */}
            <Button
              variant="outline"
              onClick={() => setCurrentDate(new Date())}
              className="text-sm"
            >
              Hôm nay
            </Button>
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

        {/* Timetable */}
        <div className="overflow-x-auto px-6 pb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50">
                <th className="p-3 border border-gray-200 font-medium text-center text-blue-700">
                  Thời Gian
                </th>
                {days.map((day, index) => (
                  <th
                    key={day}
                    className="p-3 border border-gray-200 font-medium text-center text-blue-700"
                  >
                    <div className="flex flex-col">
                      <span>{day}</span>
                      <span className="text-xs font-normal text-gray-500 mt-1">
                        {getDateForDay(currentDate, index)}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 && !loading ? (
                <tr>
                  <td
                    colSpan={days.length + 1}
                    className="p-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <CalendarIcon className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 text-lg">Không có lịch hẹn trong hiện tại</p>
                    </div>
                  </td>
                </tr>
              ) : (
                getAllAppointmentTimes().map((timeRange) => (
                  <tr
                    key={timeRange}
                    className="bg-white hover:bg-gray-50"
                  >
                    <td className="p-3 border border-gray-200 text-center font-medium text-gray-700">
                      {timeRange}
                    </td>
                    {days.map(day => {
                      const appointment = formattedAppointments[day]?.[timeRange];
                      return (
                        <motion.td
                          key={`${day}-${timeRange}`}
                          initial={{ scale: 1 }}
                          whileHover={{ scale: 0.98 }}
                          className={`p-4 border border-gray-200 text-center cursor-pointer transition-all ${appointment ? "bg-blue-50" : "hover:bg-gray-100"}`}
                          onClick={() => handleCellClick(day, timeRange)}
                        >
                          <div className="h-8 flex items-center justify-center">
                            {appointment ? (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}`}
                              >
                                {appointment.patientName}
                              </motion.div>
                            ) : null}
                          </div>
                        </motion.td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filteredAppointments.length > 0 && (
          <div className="px-6 py-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500 bg-gray-50">
            <div>
              <p>Tổng số lịch hẹn: {filteredAppointments.length}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-100 border border-green-300"></div>
              <span>Đã xác nhận</span>
              <div className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-300 ml-2"></div>
              <span>Chờ xác nhận</span>
            </div>
          </div>
        )}
      </div>

      {/* Appointment Details Modal */}
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
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Thông tin lịch hẹn</h3>
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
                        <p className="font-medium">{selectedAppointment.patientName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Mã bệnh nhân</p>
                        <p className="font-medium">{selectedAppointment.patientId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Giới tính</p>
                        <p className="font-medium">{selectedAppointment.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ngày sinh</p>
                        <p className="font-medium">{selectedAppointment.dob}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Đối tượng</p>
                        <p className="font-medium">{selectedAppointment.applicable}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ẩn danh</p>
                        <p className="font-medium">{selectedAppointment.isAnonymous ? "Có" : "Không"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-blue-600 border-b pb-2">Thông tin lịch hẹn</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Thời gian hẹn</p>
                        <p className="font-medium">{selectedAppointment.day}, {selectedAppointment.timeRange}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Thời gian bắt đầu</p>
                        <p className="font-medium">{formatDateTime(selectedAppointment.startTime)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Thời gian kết thúc</p>
                        <p className="font-medium">
                          {selectedAppointment.endTime ? formatDateTime(selectedAppointment.endTime) : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Trạng thái</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(selectedAppointment.status)}`}>
                          {selectedAppointment.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Bác sĩ</p>
                        <p className="font-medium">{selectedAppointment.doctor}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Lý do khám</p>
                        <p className="font-medium">{selectedAppointment.reason}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tiền sử bệnh</p>
                        <p className="font-medium">{selectedAppointment.medicalHistory}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phụ nữ mang thai</p>
                        <p className="font-medium">{selectedAppointment.isPregnant}</p>
                      </div>
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="text-lg font-medium text-blue-600 border-b pb-2">Thông tin y tế</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Chẩn đoán</p>
                        <p className="font-medium">{selectedAppointment.diagnosis}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Biện pháp phòng ngừa</p>
                        <p className="font-medium">{selectedAppointment.prevention}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ngày tạo lịch hẹn</p>
                        <p className="font-medium">{selectedAppointment.createdDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="font-medium">{selectedAppointment.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" onClick={closeModal}>
                    Đóng
                  </Button>

                  {selectedAppointment.rawStatus === "PENDING" && (
                    <>
                      <Button
                        variant="outline"
                        onClick={openTransferModal}
                        className="border-blue-500 text-blue-600 hover:bg-blue-50"
                      >
                        Chuyển lịch hẹn
                      </Button>
                      <Button
                        onClick={() => navigate(`/doctor/treatment/${selectedAppointment.appointmentId}`)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Điều Trị
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transfer Appointment Modal */}
      <AnimatePresence>
        {isTransferModalOpen && selectedAppointment && (
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
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Chuyển lịch hẹn</h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-blue-600 border-b pb-2 mb-4">
                      Thông tin lịch hẹn hiện tại
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Bệnh nhân</p>
                        <p className="font-medium">{selectedAppointment.patientName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Thời gian</p>
                        <p className="font-medium">
                          {selectedAppointment.day}, {selectedAppointment.timeRange}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Lý do khám</p>
                        <p className="font-medium">{selectedAppointment.reason}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-blue-600 border-b pb-2 mb-4">
                      Chọn bác sĩ mới
                    </h4>
                    <div className="space-y-4">
                      <Select onValueChange={handleDoctorSelect} value={selectedDoctorId}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn bác sĩ" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {availableDoctors.map(doctor => (
                            <SelectItem
                              key={doctor.doctor_id}
                              value={doctor.doctor_id}
                            >
                              {doctor.full_name} ({doctor.gender === "MALE" ? "Nam" : "Nữ"})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {selectedDoctorInfo && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-800 mb-2">Thông tin bác sĩ:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <p className="text-sm text-gray-500">Họ tên</p>
                              <p className="font-medium">{selectedDoctorInfo.full_name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Giới tính</p>
                              <p className="font-medium">
                                {selectedDoctorInfo.gender === "MALE" ? "Nam" : "Nữ"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Số điện thoại</p>
                              <p className="font-medium">{selectedDoctorInfo.phone}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-blue-600 border-b pb-2 mb-4">
                      Lý do chuyển
                    </h4>
                    <Textarea
                      value={transferReason}
                      onChange={(e) => setTransferReason(e.target.value)}
                      placeholder="Nhập lý do chuyển lịch hẹn"
                      className="min-h-[100px]"
                    />
                  </div>

                  {transferError && (
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-red-600">{transferError}</p>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={closeModal}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleTransferAppointment}
                      disabled={transferLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {transferLoading ? "Đang xử lý..." : "Xác nhận chuyển"}
                    </Button>
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

export default DoctorRequestsManager;