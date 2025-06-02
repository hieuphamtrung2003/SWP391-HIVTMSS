import { useState, useEffect } from 'react'
import axios from "../../../setup/configAxios"
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Pencil, Lock, Check, X } from 'lucide-react'

const ProfileSettings = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  // Initialize with default values matching API structure
  const [userData, setUserData] = useState({
    account_id: '',
    last_name: '',
    first_name: '',
    email: '',
    gender: '',
    phone: '',
    avatar: null,
    address: '',
    dob: '',
    role_name: ''
  })

  const [tempData, setTempData] = useState({ ...userData })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const response = await axios.get('api/v1/accounts')
        setUserData(response.data)
        setTempData(response.data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleEditToggle = async () => {
    if (isEditing) {
      // Save changes - you would typically make an API PUT request here
      try {
        // Gửi PUT request lên server để cập nhật thông tin
        await axios.put('api/v1/accounts', {
          last_name: tempData.last_name,
          first_name: tempData.first_name,
          phone: tempData.phone,
          address: tempData.address,
          dob: tempData.dob, // ISO format, ví dụ: "1990-01-01"
          gender: tempData.gender
        })

        // Cập nhật lại UI
        setUserData({ ...tempData })
      } catch (err) {
        console.error('Error updating user:', err)
        alert('Cập nhật thất bại. Vui lòng thử lại.')
        return
      }
    }
    else {
      // Start editing
      setTempData({ ...userData })
    }
    setIsEditing(!isEditing)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleInputChange = (e) => {
    setTempData({
      ...tempData,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
    // Clear any previous errors when user starts typing
    if (passwordError) setPasswordError(null)
    if (passwordSuccess) setPasswordSuccess(false)
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    // Validate inputs
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordError('Vui lòng điền đầy đủ thông tin')
      return
    }

    try {
      setPasswordLoading(true)
      setPasswordError(null)

      // Make API call to change password
      await axios.post(`api/v1/accounts/change-password`, null, {
        params: {
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }
      })

      setPasswordSuccess(true)
      setPasswordData({ currentPassword: '', newPassword: '' })

      // Auto hide success message and close form after 2 seconds
      setTimeout(() => {
        setPasswordSuccess(false)
        setIsChangingPassword(false)
      }, 2000)

    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu')
    } finally {
      setPasswordLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-red-50 text-red-600 rounded-lg">
        Error loading profile: {error}
      </div>
    )
  }

  const fullName = `${userData.first_name} ${userData.last_name}`.trim()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - Avatar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full md:w-1/3 flex flex-col items-center"
        >
          <div className="relative group">
            <Avatar className="h-40 w-40 border-4 border-white shadow-lg">
              {userData.avatar ? (
                <AvatarImage src={userData.avatar} />
              ) : (
                <AvatarFallback>
                  {userData.first_name?.[0]}{userData.last_name?.[0]}
                </AvatarFallback>
              )}
            </Avatar>
            {isEditing && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-md"
              >
                <Pencil className="h-4 w-4" />
              </motion.button>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 w-full space-y-4"
          >
            <Button
              variant="outline"
              className="w-full flex gap-2"
              onClick={() => setIsChangingPassword(!isChangingPassword)}
            >
              <Lock className="h-4 w-4" />
              Đổi mật khẩu
            </Button>

            {isChangingPassword && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-gray-50 p-4 rounded-lg"
              >
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  {passwordError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                      {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
                      Đổi mật khẩu thành công!
                    </div>
                  )}

                  <div>
                    <Label>Mật khẩu hiện tại</Label>
                    <Input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label>Mật khẩu mới</Label>
                    <Input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={passwordLoading}
                    >
                      {passwordLoading ? 'Đang lưu...' : 'Lưu mật khẩu'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsChangingPassword(false)
                        setPasswordData({ currentPassword: '', newPassword: '' })
                        setPasswordError(null)
                        setPasswordSuccess(false)
                      }}
                      disabled={passwordLoading}
                    >
                      Hủy
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Right Column - Profile Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full md:w-2/3 bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h2>
            {!isEditing ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEditToggle}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <Pencil className="h-4 w-4" />
                Chỉnh sửa
              </motion.button>
            ) : (
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-md"
                >
                  <Check className="h-4 w-4" />
                  Lưu
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 bg-gray-200 text-gray-700 px-3 py-1 rounded-md"
                >
                  <X className="h-4 w-4" />
                  Hủy
                </motion.button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label>Họ</Label>
              {isEditing ? (
                <Input
                  name="last_name"
                  value={tempData.last_name}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-gray-700">{userData.last_name || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div>
              <Label>Tên</Label>
              {isEditing ? (
                <Input
                  name="first_name"
                  value={tempData.first_name}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-gray-700">{userData.first_name || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div>
              <Label>Email</Label>
              <p className="mt-1 text-gray-700">{userData.email}</p>
            </div>

            <div>
              <Label>Số điện thoại</Label>
              {isEditing ? (
                <Input
                  name="phone"
                  value={tempData.phone}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-gray-700">{userData.phone || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div>
              <Label>Giới tính</Label>
              {isEditing ? (
                <select
                  name="gender"
                  value={tempData.gender || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              ) : (
                <p className="mt-1 text-gray-700">
                  {userData.gender === 'MALE' ? 'Nam' :
                    userData.gender === 'FEMALE' ? 'Nữ' :
                      userData.gender === 'OTHER' ? 'Khác' : 'Chưa cập nhật'}
                </p>
              )}
            </div>

            <div>
              <Label>Địa chỉ</Label>
              {isEditing ? (
                <Input
                  name="address"
                  value={tempData.address}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-gray-700">{userData.address || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div>
              <Label>Ngày sinh</Label>
              {isEditing ? (
                <Input
                  type="date"
                  name="dob"
                  value={tempData.dob || ''}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-gray-700">
                  {userData.dob ? new Date(userData.dob).toLocaleDateString() : 'Chưa cập nhật'}
                </p>
              )}
            </div>

            <div>
              <Label>Vai trò</Label>
              <p className="mt-1 text-gray-700">
                {userData.role_name === 'CUSTOMER' ? 'Bệnh nhân' :
                  userData.role_name === 'DOCTOR' ? 'Bác sĩ' :
                    userData.role_name === 'ADMIN' ? 'Quản trị viên' : userData.role_name}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ProfileSettings