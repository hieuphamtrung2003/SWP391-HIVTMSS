import { Bell, MessageSquare, Search } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'setup/configAxios'
import { toast } from 'react-toastify'
import { decodeToken } from 'utils/tokenUtils'

export default function Header() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Loading state */}
          <div className="animate-pulse h-8 w-40 bg-gray-200 rounded"></div>
          <div className="flex items-center gap-4">
            <div className="animate-pulse h-8 w-8 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </header>
    )
  }

  const displayName = userData
    ? `${userData.last_name || ''} ${userData.first_name || ''}`.trim()
    : 'Guest'

  const avatarFallback = userData
    ? (userData.first_name?.[0] || '') + (userData.last_name?.[0] || '')
    : 'G'

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
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm..."
              className="pl-10 w-[200px] lg:w-[300px] rounded-full bg-gray-50"
            />
          </div>

          {/* Notification */}
          <Link to="/notify">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
          </Link>

          {/* Messages */}
          <Link to="/chat">
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-5 w-5 text-gray-600" />
            </Button>
          </Link>

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
    </header>
  )
}