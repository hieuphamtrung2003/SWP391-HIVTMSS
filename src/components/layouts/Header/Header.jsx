import { Bell, MessageSquare, Search, PartyPopper , CheckCircle, Calendar, Pill, MoreVertical } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'setup/configAxios'
import { toast } from 'react-toastify'
import { decodeToken } from 'utils/tokenUtils'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access_token')
        if (!token) {
          setLoading(false)
          return
        }

        const decoded = decodeToken(token)
        if (!decoded) {
          setLoading(false)
          return
        }

        const response = await axios.get('/api/v1/accounts')
        setUserData(response.data)
      } catch (error) {
        console.error('Error fetching user data:', error)
        toast.error('Failed to load user information')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Fetch notifications with polling
  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('access_token')
      const decodedToken = decodeToken(token)
      const accountId = decodedToken?.id

      if (!accountId) return

      try {
        const response = await axios.get('/api/v1/notifications', {
          params: {
            pageNo: 0,
            pageSize: 5,
            sortBy: 'id',
            sortDir: 'desc',
            status: 'ALL',
            accountId: accountId
          }
        })

        const data = response.data
        const updatedNotifications = data.content.map(notification => ({
          ...notification,
          status: notification.status.toLowerCase(),
          type: getNotificationType(notification.title)
        }))

        setNotifications(updatedNotifications)

        // Update unread count
        const newUnreadCount = updatedNotifications.filter(n => n.status === 'unread').length
        setUnreadCount(newUnreadCount)
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    }

    // Initial fetch
    fetchNotifications()

    // Set up polling every 30 seconds
    const intervalId = setInterval(fetchNotifications, 30000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  const getNotificationType = (title) => {
    if (title.includes('lịch hẹn')) return 'reminder'
    if (title.includes('thuốc')) return 'medication'
    if (title.includes('cập nhật')) return 'system'
    return 'alert'
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'reminder':
        return <Calendar className="h-4 w-4 text-blue-500" />
      case 'medication':
        return <Pill className="h-4 w-4 text-green-500" />
      case 'alert':
        return <PartyPopper className="h-4 w-4 text-green-500" />
      case 'system':
        return <CheckCircle className="h-4 w-4 text-purple-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('access_token')
      const decodedToken = decodeToken(token)
      const accountId = decodedToken?.id

      await axios.put('/api/v1/notifications', null, {
        params: {
          accountId: accountId,
          notificationId: notificationId
        }
      })

      setNotifications(notifications.map(n =>
        n.notification_id === notificationId ? { ...n, status: 'read' } : n
      ))

      // Update unread count
      setUnreadCount(prev => prev - 1)
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('access_token')
      const decodedToken = decodeToken(token)
      const accountId = decodedToken?.id

      await axios.delete('/api/v1/notifications', {
        params: {
          accountId: accountId,
          notificationId: notificationId
        }
      })

      // Check if we're deleting an unread notification
      const deletedNotification = notifications.find(n => n.notification_id === notificationId)
      const wasUnread = deletedNotification?.status === 'unread'

      setNotifications(notifications.filter(n => n.notification_id !== notificationId))
      setDropdownOpen(null)

      // Update unread count if needed
      if (wasUnread) {
        setUnreadCount(prev => prev - 1)
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const handleNotificationClick = (notification) => {
    if (notification.status === 'unread') {
      markAsRead(notification.notification_id)
    }
    setSelectedNotification(notification)
    setIsModalOpen(true)
    setNotificationDropdownOpen(false)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedNotification(null), 300)
  }

  const toggleDropdown = (id, e) => {
    e.stopPropagation()
    setDropdownOpen(dropdownOpen === id ? null : id)
  }

  const displayName = userData
    ? `${userData.last_name || ''} ${userData.first_name || ''}`.trim()
    : 'Guest'

  const avatarFallback = userData
    ? (userData.first_name?.[0] || '') + (userData.last_name?.[0] || '')
    : 'G'

  if (loading) {
    return (
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="animate-pulse h-8 w-40 bg-gray-200 rounded"></div>
          <div className="flex items-center gap-4">
            <div className="animate-pulse h-8 w-8 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left side - Logo/Name */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-blue-600">
            <span className="text-blue-800">HIV</span>
            <span className="text-blue-600">TMSS</span>
          </h1>
        </div>

        {/* Right side - Navigation */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}


          {/* Notification */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {notificationDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border z-50"
                >
                  <div className="p-2 border-b">
                    <h3 className="font-medium text-gray-800">Thông báo</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">Không có thông báo nào</div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.notification_id}
                          className={`p-3 cursor-pointer relative ${notification.status === 'unread' ? 'bg-blue-50' : 'bg-white'}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h3 className={`text-sm font-medium ${notification.status === 'unread' ? 'text-blue-800' : 'text-gray-700'}`}>
                                  {notification.title}
                                </h3>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-gray-500">
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
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {notification.content}
                              </p>
                            </div>
                          </div>

                          {/* Dropdown menu */}
                          {dropdownOpen === notification.notification_id && (
                            <div
                              className="absolute right-3 top-10 z-10 bg-white shadow-lg rounded-md py-1 w-40 border"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {notification.status === 'unread' && (
                                <button
                                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
                                  onClick={() => {
                                    markAsRead(notification.notification_id)
                                    setDropdownOpen(null)
                                  }}
                                >
                                  Đánh dấu đã đọc
                                </button>
                              )}
                              <button
                                className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-gray-100"
                                onClick={() => {
                                  deleteNotification(notification.notification_id)
                                }}
                              >
                                Xóa thông báo
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 border-t text-center">
                    <Link to="/doctor/notify" className="text-xs text-blue-600 hover:underline">
                      Xem tất cả thông báo
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 ml-2">
            <Avatar className="h-8 w-8 border border-blue-100">
              <AvatarImage src={userData?.avatar || '/avatars/default.png'} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
            <span className="hidden md:inline font-medium text-sm text-gray-700">
              {displayName || 'User'}
            </span>
          </div>
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
              className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {getNotificationIcon(selectedNotification.type)}
                    <h3 className="text-lg font-semibold text-gray-800">
                      {selectedNotification.title}
                    </h3>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm">{selectedNotification.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {selectedNotification.time_ago}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" size="sm" onClick={closeModal}>
                    Đóng
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}