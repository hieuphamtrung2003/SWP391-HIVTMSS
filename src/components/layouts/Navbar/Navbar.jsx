import {
  Calendar,
  CalendarCheck,
  MessageSquare,
  Bell,
  FileText,
  CircleUser,
} from 'lucide-react'
import { Button } from '../../ui/button'
import { Link, useLocation } from 'react-router-dom'

export default function SideNavbar() {
  const location = useLocation()
  const navItems = [
    { 
      name: 'Xem lịch đặt', 
      icon: <Calendar className="h-5 w-5" />,
      path: '/schedule'
    },
    { 
      name: 'Đặt lịch', 
      icon: <CalendarCheck className="h-5 w-5" />,
      path: '/book'
    },
    { 
      name: 'Quản lý blog', 
      icon: <FileText className="h-5 w-5" />,
      path: '/blog'
    },
    { 
      name: 'Thông báo', 
      icon: <Bell className="h-5 w-5" />,
      path: '/notify'
    },
    { 
      name: 'Nhắn tin hỗ trợ', 
      icon: <MessageSquare className="h-5 w-5" />,
      path: '/support'
    }
  ]

  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r bg-white z-40">
      <div className="flex flex-col h-full p-4">
        {/* Logo with Link to home */}
        <Link to="/" className="mb-8 px-4 py-3">
          <h2 className="text-xl font-semibold text-blue-600">
            <span className="text-blue-800">HIV</span>
            <span className="text-blue-600">TMSS</span>
          </h2>
        </Link>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Button
                  asChild
                  variant="ghost"
                  className={`w-full justify-start gap-3 ${location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Link to={item.path} className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Settings */}
        <div className="mt-auto pb-4">
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-600 hover:bg-gray-50"
          >
            <Link to="/profile" className="flex items-center gap-3">
              <CircleUser className="h-5 w-5" />
              <span>Hồ Sơ</span>
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  )
}