import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Clock, AlertTriangle, CheckCircle, Calendar, Pill, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../../ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import axios from 'setup/configAxios'
import { decodeToken } from "../../../utils/tokenUtils"
import { Skeleton } from "../../ui/skeleton"

const NotificationsPage = () => {
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    pageNo: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 1,
    last: true
  })
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false)

  const token = localStorage.getItem('access_token')
  const decodedToken = decodeToken(token)
  const accountId = decodedToken?.id

  const fetchNotifications = async () => {
    if (!accountId) return

    try {
      setLoading(true)
      const response = await axios.get('/api/v1/notifications', {
        params: {
          pageNo: pagination.pageNo,
          pageSize: pagination.pageSize,
          sortBy: 'id',
          sortDir: 'desc',
          status: statusFilter,
          accountId: accountId
        }
      })

      const data = response.data
      setNotifications(data.content.map(notification => ({
        ...notification,
        status: notification.status.toLowerCase(),
        type: getNotificationType(notification.title)
      })))
      setPagination({
        pageNo: data.page_no,
        pageSize: data.page_size,
        totalElements: data.total_elements,
        totalPages: data.total_pages,
        last: data.last
      })
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const getNotificationType = (title) => {
    if (title.includes('lịch hẹn')) return 'reminder'
    if (title.includes('thuốc')) return 'medication'
    if (title.includes('cập nhật')) return 'system'
    return 'alert'
  }

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
    if (notification.status === 'unread') {
      markAsRead(notification.notification_id)
    }
    setSelectedNotification(notification)
    setIsModalOpen(true)
  }

  const markAsRead = async (notificationId) => {
    try {
      await axios.put('/api/v1/notifications', null, {
        params: {
          accountId: accountId,
          notificationId: notificationId
        }
      })

      setNotifications(notifications.map(n =>
        n.notification_id === notificationId ? { ...n, status: 'read' } : n
      ))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      setIsMarkingAllAsRead(true)
      const unreadNotifications = notifications.filter(n => n.status === 'unread')

      // Mark all unread notifications as read in the API
      await Promise.all(
        unreadNotifications.map(notification =>
          axios.put('/api/v1/notifications', null, {
            params: {
              accountId: accountId,
              notificationId: notification.notification_id
            }
          })
        )
      )

      // Update local state
      setNotifications(notifications.map(n =>
        n.status === 'unread' ? { ...n, status: 'read' } : n
      ))
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    } finally {
      setIsMarkingAllAsRead(false)
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete('/api/v1/notifications', {
        params: {
          accountId: accountId,
          notificationId: notificationId
        }
      })

      setNotifications(notifications.filter(n => n.notification_id !== notificationId))
      setDropdownOpen(null)

      // If we're in the modal and delete the current notification, close the modal
      if (selectedNotification?.notification_id === notificationId) {
        closeModal()
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedNotification(null), 300)
  }

  const toggleDropdown = (id, e) => {
    e?.stopPropagation()
    setDropdownOpen(dropdownOpen === id ? null : id)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination(prev => ({ ...prev, pageNo: newPage }))
    }
  }

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value)
    setPagination(prev => ({ ...prev, pageNo: 0 })) // Reset to first page when filter changes
  }

  useEffect(() => {
    fetchNotifications()
  }, [accountId, pagination.pageNo, statusFilter])

  const unreadCount = notifications.filter(n => n.status === 'unread').length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto p-4 md:p-6"
    >
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header with filter controls */}
        <div className="p-4 md:p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl md:text-2xl font-semibold">Thông báo</h2>
              {unreadCount > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {unreadCount} mới
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-3">
                <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="ALL">Tất cả</SelectItem>
                    <SelectItem value="UNREAD">Chưa đọc</SelectItem>
                  </SelectContent>
                </Select>
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAllAsRead}
                    disabled={isMarkingAllAsRead}
                  >
                    {isMarkingAllAsRead ? 'Đang xử lý...' : 'Đánh dấu tất cả đã đọc'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Notification List */}
        <div className="divide-y">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="p-4">
                <div className="flex items-start space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[250px]" />
                  </div>
                </div>
              </div>
            ))
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không có thông báo</h3>
              <p className="mt-1 text-sm text-gray-500">
                {statusFilter === 'UNREAD'
                  ? "Bạn không có thông báo chưa đọc nào"
                  : "Bạn không có thông báo nào"}
              </p>
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <motion.div
                  key={notification.notification_id}
                  whileHover={{ scale: 1.01 }}
                  className={`p-4 cursor-pointer relative ${notification.status === 'unread' ? 'bg-blue-50' : 'bg-white'}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                      {notification.status === 'unread' && (
                        <span className="absolute top-3 left-3 h-2 w-2 rounded-full bg-blue-500"></span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className={`font-medium ${notification.status === 'unread' ? 'text-blue-800' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {notification.time_ago}
                          </span>
                          <button
                            onClick={(e) => toggleDropdown(notification.notification_id, e)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                    </div>
                  </div>

                  {/* Dropdown menu */}
                  {dropdownOpen === notification.notification_id && (
                    <div
                      className="absolute right-4 top-12 z-10 bg-white shadow-lg rounded-md py-1 w-48 border"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {notification.status === 'unread' && (
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            markAsRead(notification.notification_id)
                            setDropdownOpen(null)
                          }}
                        >
                          Đánh dấu đã đọc
                        </button>
                      )}
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        onClick={() => {
                          deleteNotification(notification.notification_id)
                        }}
                      >
                        Xóa thông báo
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Pagination controls */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
                  <div className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">{(pagination.pageNo * pagination.pageSize) + 1}</span> đến{' '}
                    <span className="font-medium">
                      {Math.min((pagination.pageNo + 1) * pagination.pageSize, pagination.totalElements)}
                    </span>{' '}
                    trong <span className="font-medium">{pagination.totalElements}</span> kết quả
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.pageNo - 1)}
                      disabled={pagination.pageNo === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.pageNo + 1)}
                      disabled={pagination.last}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Notification Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedNotification && (
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
                  <div className="flex items-center gap-3">
                    {getNotificationIcon(selectedNotification.type)}
                    <h3 className="text-xl font-semibold text-gray-800">
                      {selectedNotification.title}
                    </h3>
                    {selectedNotification.status === 'unread' && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Mới
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedNotification.content}</p>
                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {selectedNotification.time_ago}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" onClick={closeModal}>
                    Đóng
                  </Button>
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