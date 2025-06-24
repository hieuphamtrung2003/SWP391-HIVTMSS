import {
  Calendar,
  CalendarCheck,
  MessageSquare,
  FileText,
  CircleUser,
  Table,
  LayoutDashboard,
  Users,
  Bell,
  FlaskConical,
  Stethoscope,
} from 'lucide-react'
import { Button } from '../../../ui/button'
import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from "react"
import axios from "../../../../setup/configAxios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function SideNavbar() {
  const location = useLocation()

  // Khai báo token

  const [token, setToken] = useState(() => localStorage.getItem("access_token"));

  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    setToken(savedToken);
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      await axios.post("api/v1/auth/logout", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("access_token");
      localStorage.removeItem("role");
      setToken(null);
      toast.success("Đăng xuất thành công");
      navigate("/login");
    } catch (error) {
      toast.error("Lỗi khi đăng xuất");
      console.error("Logout failed:", error);

    }
  };
  const navItems = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: '/admin/Dashboard'
    },
    {
      name: 'Quản lý tài khoản',
      icon: <Users className="h-5 w-5" />,
      path: '/admin/accounts'
    },
    {
      name: 'Thông báo',
      icon: <Bell className="h-5 w-5" />,
      path: '/admin/notify'
    },
    {
      name: 'Xét Nghiệm',
      icon: <FlaskConical className="h-5 w-5" />,
      path: '/admin/test-types'
    },
    {
      name: 'Phác đồ',
      icon: <Stethoscope className="h-5 w-5" />,
      path: '/admin/treatment-regimen'
    },
  ]

  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r bg-white z-40">
      <div className="flex flex-col h-full p-4">
        {/* Logo with Link to home */}
        <Link to="/" className="mb-8 px-4 py-3 z-10">
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
            <Link to="/admin/profile" className="flex items-center gap-3">
              <CircleUser className="h-5 w-5" />
              <span>Hồ Sơ</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-600 hover:bg-gray-50"
          >
            <span onClick={handleLogout}>Đăng Xuất</span>
          </Button>
        </div>
      </div>
    </aside>
  )
}