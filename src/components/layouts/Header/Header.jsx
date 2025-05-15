import { Bell, MessageSquare, Search } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'

export default function Header() {
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
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>

          {/* Messages */}
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5 text-gray-600" />
          </Button>

          {/* User Profile */}
          <div className="flex items-center gap-2 ml-2">
            <Avatar className="h-8 w-8 border border-blue-100">
              <AvatarImage src="/avatars/default.png" />
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
            <span className="hidden md:inline font-medium text-sm text-gray-700">Dr. Nguyen</span>
          </div>
        </div>
      </div>
    </header>
  )
}