import { useState } from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Pencil, Lock, Check, X } from 'lucide-react'

const ProfileSettings = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [userData, setUserData] = useState({
    name: 'Tịnh',
    email: 'Tinh123@gmail.com',
    phone: '0987654321',
    position: 'Bệnh nhân',
    department: 'HIV/AIDS',
    hospital: 'Bệnh viện Bạch Mai'
  })
  const [tempData, setTempData] = useState({...userData})
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setUserData({...tempData})
    } else {
      // Start editing
      setTempData({...userData})
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
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    // Add password change logic here
    setIsChangingPassword(false)
  }

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
              <AvatarImage src="/avatars/doctor.jpg" />
              <AvatarFallback>T</AvatarFallback>
            </Avatar>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-md"
            >
              <Pencil className="h-4 w-4" />
            </motion.button>
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
                  <div>
                    <Label>Mật khẩu hiện tại</Label>
                    <Input 
                      type="password" 
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="mt-1"
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
                    />
                  </div>
                  <div>
                    <Label>Xác nhận mật khẩu</Label>
                    <Input 
                      type="password" 
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Lưu mật khẩu
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsChangingPassword(false)}
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
              <Label>Họ và tên</Label>
              {isEditing ? (
                <Input 
                  name="name"
                  value={tempData.name}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-gray-700">{userData.name}</p>
              )}
            </div>

            <div>
              <Label>Email</Label>
              {isEditing ? (
                <Input 
                  name="email"
                  value={tempData.email}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-gray-700">{userData.email}</p>
              )}
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
                <p className="mt-1 text-gray-700">{userData.phone}</p>
              )}
            </div>

            <div>
              <Label>Vị trí</Label>
              <p className="mt-1 text-gray-700">{userData.position}</p>
            </div>

            <div>
              <Label>hồ sơ bệnh</Label>
              <p className="mt-1 text-gray-700">{userData.department}</p>
            </div>

            <div>
              <Label>Bệnh viện/Cơ sở</Label>
              <p className="mt-1 text-gray-700">{userData.hospital}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ProfileSettings