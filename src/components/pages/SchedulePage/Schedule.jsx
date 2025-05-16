import { Button } from "../../ui/button"
import { useState } from "react"
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from "lucide-react"

const Schedule = () => {
    // Current date management
    const [currentDate, setCurrentDate] = useState(new Date())
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()
    const [selectedAppointment, setSelectedAppointment] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Define days of the week
    const days = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu'];

    // Define time slots (2-hour intervals from 8:00 to 18:00)
    const timeSlots = [
        '8:00 - 10:00',
        '10:00 - 12:00',
        '12:00 - 14:00',
        '14:00 - 16:00',
        '16:00 - 18:00'
    ];

    // Year selection
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

    // Month names in Vietnamese
    const monthNames = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
        'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
        'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ]

    // Fake appointment data
    const fakeAppointments = {
        'Thứ Hai': {
            '8:00 - 10:00': {
                patientName: 'Nguyễn Văn A',
                patientId: 'BN-001',
                doctor: 'BS. Trần Thị B',
                reason: 'Bị HIV',
                status: 'Đã xác nhận'
            },
            '14:00 - 16:00': {
                patientName: 'Lê Thị C',
                patientId: 'BN-002',
                doctor: 'BS. Phạm Văn D',
                reason: 'Kiểm tra CD4',
                status: 'Chờ xác nhận'
            }
        },
        'Thứ Tư': {
            '10:00 - 12:00': {
                patientName: 'Hoàng Văn E',
                patientId: 'BN-003',
                doctor: 'BS. Trần Thị B',
                reason: 'Cấp phát thuốc ARV',
                status: 'Đã xác nhận'
            }
        },
        'Thứ Năm': {
            '16:00 - 18:00': {
                patientName: 'Phạm Thị F',
                patientId: 'BN-004',
                doctor: 'BS. Nguyễn Văn G',
                reason: 'Tư vấn dinh dưỡng',
                status: 'Đã xác nhận'
            }
        }
    }

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
    }

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
    }

    const handleYearChange = (year) => {
        setCurrentDate(new Date(year, currentMonth, 1))
    }

    const handleCellClick = (day, time) => {
        const appointment = fakeAppointments[day]?.[time]
        if (appointment) {
            setSelectedAppointment({
                ...appointment,
                day,
                time
            })
            setIsModalOpen(true)
        }
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setTimeout(() => setSelectedAppointment(null), 300) // Wait for animation to complete
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Đã xác nhận': return 'bg-green-100 text-green-800'
            case 'Chờ xác nhận': return 'bg-yellow-100 text-yellow-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

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

                        {/* Month Navigation */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handlePrevMonth}
                                className="h-8 w-8"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <span className="font-medium text-gray-700 min-w-[100px] text-center">
                                {monthNames[currentMonth]}
                            </span>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleNextMonth}
                                className="h-8 w-8"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Timetable */}
                <div className="overflow-x-auto px-6 pb-6">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-blue-50">
                                <th className="p-3 border border-gray-200 font-medium text-center text-blue-700">
                                    Thời Gian
                                </th>
                                {days.map(day => (
                                    <th
                                        key={day}
                                        className="p-3 border border-gray-200 font-medium text-center text-blue-700"
                                    >
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {timeSlots.map((time, index) => (
                                <tr
                                    key={time}
                                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                >
                                    <td className="p-3 border border-gray-200 text-center font-medium text-gray-700">
                                        {time}
                                    </td>
                                    {days.map(day => {
                                        const appointment = fakeAppointments[day]?.[time]
                                        return (
                                            <motion.td
                                                key={`${day}-${time}`}
                                                initial={{ scale: 1 }}
                                                whileHover={{ scale: 0.98 }}
                                                className={`p-4 border border-gray-200 text-center cursor-pointer transition-all ${appointment ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
                                                onClick={() => handleCellClick(day, time)}
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
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">Trống</span>
                                                    )}
                                                </div>
                                            </motion.td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500 bg-gray-50">
                    <div>
                        <p>Lịch trình từ 8:00 đến 18:00, mỗi khung giờ 2 tiếng</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></div>
                        <span>Buổi sáng</span>
                        <div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-300 ml-2"></div>
                        <span>Buổi chiều</span>
                    </div>
                </div>
            </div>

            {/* Appointment Modal */}
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
                            className="bg-white rounded-lg shadow-xl w-full max-w-md"
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

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-lg font-medium text-blue-600 mb-2">Bệnh nhân</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Họ tên</p>
                                                <p className="font-medium">{selectedAppointment.patientName}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Mã bệnh nhân</p>
                                                <p className="font-medium">{selectedAppointment.patientId}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-medium text-blue-600 mb-2">Thông tin khám</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Ngày</p>
                                                <p className="font-medium">{selectedAppointment.day}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Giờ</p>
                                                <p className="font-medium">{selectedAppointment.time}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Bác sĩ</p>
                                                <p className="font-medium">{selectedAppointment.doctor}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Lý do</p>
                                                <p className="font-medium">{selectedAppointment.reason}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Trạng thái</p>
                                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedAppointment.status)}`}>
                                            {selectedAppointment.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <Button variant="outline" onClick={closeModal}>
                                        Đóng
                                    </Button>
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        Xem hồ sơ
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default Schedule