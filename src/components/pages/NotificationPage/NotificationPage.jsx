
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Clock, AlertTriangle, CheckCircle, Calendar, Pill } from 'lucide-react'
import { Button } from '../../ui/button'

const NotificationsPage = () => {
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'reminder',
      title: 'Nhắc lịch tái khám',
      message: 'Bệnh nhân Nguyễn Văn A có lịch tái khám vào ngày 15/06/2024',
      doctor: 'BS. Trần Thị B',
      time: '10 phút trước',
      status: 'unread',
      details: {
        patient: 'Nguyễn Văn A',
        patientId: 'BN-001',
        appointmentDate: '15/06/2024',
        appointmentTime: '14:00 - 16:00',
        reason: 'Kiểm tra định kỳ',
        notes: 'Bệnh nhân cần xét nghiệm CD4 trước khi khám'
      }
    },
    {
      id: 2,
      type: 'medication',
      title: 'Nhắc uống thuốc',
      message: 'Bệnh nhân Lê Thị C cần uống thuốc ARV vào 8:00 sáng',
      doctor: 'BS. Phạm Văn D',
      time: '1 giờ trước',
      status: 'unread',
      details: {
        patient: 'Lê Thị C',
        patientId: 'BN-002',
        medication: 'TDF/3TC/DTG',
        dosage: '1 viên/ngày',
        time: '8:00 sáng',
        notes: 'Theo dõi tác dụng phụ nếu có'
      }
    },
    {
      id: 3,
      type: 'system',
      title: 'Cập nhật hệ thống',
      message: 'Phiên bản mới 2.1.0 đã sẵn sàng để cập nhật',
      doctor: 'Hệ thống',
      time: '3 giờ trước',
      status: 'read',
      details: {
        version: '2.1.0',
        releaseDate: '10/06/2024',
        changes: [
          'Cải thiện hiệu suất lịch hẹn',
          'Thêm tính năng nhắc uống thuốc',
          'Sửa lỗi báo cáo'
        ]
      }
    },
    {
      id: 4,
      type: 'alert',
      title: 'Kết quả xét nghiệm',
      message: 'Kết quả CD4 của bệnh nhân Hoàng Văn E đã có',
      doctor: 'BS. Nguyễn Thị F',
      time: '5 giờ trước',
      status: 'read',
      details: {
        patient: 'Hoàng Văn E',
        patientId: 'BN-003',
        testType: 'CD4',
        result: '450 tế bào/mm3',
        date: '08/06/2024',
        notes: 'Kết quả ổn định, tiếp tục phác đồ hiện tại'
      }
    }
  ])

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'reminder':
        return <Calendar className="h-5 w-5 text-blue-500" />
      case 'medication':
        return <Pill className="h-5 w-5 text-green-500" />
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case 'system':
        return <CheckCircle className="h-5 w-5 text-purple-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const handleNotificationClick = (notification) => {
    // Mark as read
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, status: 'read' } : n
    ))
    setSelectedNotification(notification)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedNotification(null), 300)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto p-6"
    >
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <Bell className="h-6 w-6 text-blue-600" />
              Thông báo
            </h2>
            <div className="text-sm text-gray-500">
              {notifications.filter(n => n.status === 'unread').length} thông báo mới
            </div>
          </div>
        </div>

        {/* Notification List */}
        <div className="divide-y">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              whileHover={{ scale: 1.01 }}
              className={`p-4 cursor-pointer ${notification.status === 'unread' ? 'bg-blue-50' : 'bg-white'}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-medium ${notification.status === 'unread' ? 'text-blue-800' : 'text-gray-700'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-2">Từ: {notification.doctor}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Notification Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 "
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
                  <div className="flex items-center gap-3">
                    {getNotificationIcon(selectedNotification.type)}
                    <h3 className="text-xl font-semibold text-gray-800">
                      {selectedNotification.title}
                    </h3>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedNotification.message}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Từ: {selectedNotification.doctor} • {selectedNotification.time}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-blue-600 mb-3">Chi tiết</h4>
                    
                    {selectedNotification.type === 'reminder' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Bệnh nhân</p>
                          <p className="font-medium">{selectedNotification.details.patient}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Mã bệnh nhân</p>
                          <p className="font-medium">{selectedNotification.details.patientId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Ngày hẹn</p>
                          <p className="font-medium">{selectedNotification.details.appointmentDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Giờ hẹn</p>
                          <p className="font-medium">{selectedNotification.details.appointmentTime}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-500">Ghi chú</p>
                          <p className="font-medium">{selectedNotification.details.notes}</p>
                        </div>
                      </div>
                    )}

                    {selectedNotification.type === 'medication' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Bệnh nhân</p>
                          <p className="font-medium">{selectedNotification.details.patient}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Mã bệnh nhân</p>
                          <p className="font-medium">{selectedNotification.details.patientId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Thuốc</p>
                          <p className="font-medium">{selectedNotification.details.medication}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Liều lượng</p>
                          <p className="font-medium">{selectedNotification.details.dosage}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Thời gian</p>
                          <p className="font-medium">{selectedNotification.details.time}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-500">Ghi chú</p>
                          <p className="font-medium">{selectedNotification.details.notes}</p>
                        </div>
                      </div>
                    )}

                    {selectedNotification.type === 'system' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Phiên bản</p>
                            <p className="font-medium">{selectedNotification.details.version}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Ngày phát hành</p>
                            <p className="font-medium">{selectedNotification.details.releaseDate}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Thay đổi:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            {selectedNotification.details.changes.map((change, index) => (
                              <li key={index} className="text-gray-700">{change}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {selectedNotification.type === 'alert' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Bệnh nhân</p>
                          <p className="font-medium">{selectedNotification.details.patient}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Mã bệnh nhân</p>
                          <p className="font-medium">{selectedNotification.details.patientId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Loại xét nghiệm</p>
                          <p className="font-medium">{selectedNotification.details.testType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Kết quả</p>
                          <p className="font-medium">{selectedNotification.details.result}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Ngày xét nghiệm</p>
                          <p className="font-medium">{selectedNotification.details.date}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-500">Đánh giá</p>
                          <p className="font-medium">{selectedNotification.details.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" onClick={closeModal}>
                    Đóng
                  </Button>
                  {/* {selectedNotification.type !== 'system' && (
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Xem hồ sơ
                    </Button>
                  )} */}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default NotificationsPage