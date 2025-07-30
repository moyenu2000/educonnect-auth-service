import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { Badge } from '@/components/ui/badge'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  BookOpen,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Home,
  Trophy,
  Calendar,
  FileQuestion,
  Brain,
  User,
  GraduationCap,
  LogOut,
  Bot,
} from 'lucide-react'

interface SidebarProps {
  userRole: 'ADMIN' | 'QUESTION_SETTER' | 'STUDENT'
}

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const location = useLocation()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800'
      case 'QUESTION_SETTER':
        return 'bg-blue-100 text-blue-800'
      case 'STUDENT':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const adminNavItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Subjects', href: '/admin/subjects', icon: BookOpen },
    { name: 'Questions', href: '/admin/questions', icon: FileQuestion },
    { name: 'Daily Questions', href: '/admin/daily-questions', icon: Calendar },
    { name: 'Practice Problems', href: '/admin/practice-problems', icon: Brain },
    { name: 'Contests', href: '/admin/contests', icon: Trophy },
    // { name: 'Live Exams', href: '/admin/live-exams', icon: Calendar },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    // { name: 'Discussions', href: '/admin/discussions', icon: MessageSquare },
    // { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  const questionSetterNavItems = [
    { name: 'Dashboard', href: '/question-setter', icon: Home },
    { name: 'Subjects', href: '/question-setter/subjects', icon: BookOpen },
    { name: 'Questions', href: '/question-setter/questions', icon: FileQuestion },
    { name: 'Daily Questions', href: '/question-setter/daily-questions', icon: Calendar },
    { name: 'Practice Problems', href: '/question-setter/practice-problems', icon: Brain },
    { name: 'Contests', href: '/question-setter/contests', icon: Trophy },
    { name: 'Analytics', href: '/question-setter/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/question-setter/settings', icon: Settings },
  ]

  const studentNavItems = [
    { name: 'Dashboard', href: '/student', icon: Home },
    { name: 'Daily Questions', href: '/student/daily-questions', icon: Calendar },
    // { name: 'Practice', href: '/student/practice', icon: Brain },
    { name: 'Practice Questions', href: '/student/practice-questions', icon: FileQuestion },
    // { name: 'Live Exams', href: '/student/exams', icon: GraduationCap },
    { name: 'Contests', href: '/student/contests', icon: Trophy },
    { name: 'Analytics', href: '/student/analytics', icon: BarChart3 },
    { name: 'Discussions', href: '/student/discussions', icon: MessageSquare },
    { name: 'Groups', href: '/student/groups', icon: Users },
    { name: 'Messages', href: '/student/messages', icon: MessageSquare },
    { name: 'AI Assistant', href: '/student/ai', icon: Bot },
    { name: 'Leaderboard', href: '/student/leaderboard', icon: BarChart3 },
  ]

  const getNavItems = () => {
    switch (userRole) {
      case 'ADMIN':
        return adminNavItems
      case 'QUESTION_SETTER':
        return questionSetterNavItems
      case 'STUDENT':
        return studentNavItems
      default:
        return studentNavItems
    }
  }

  const navItems = getNavItems()

  return (
    <div className="h-full w-full bg-gray-50 border-r-2 border-gray-200">
      <div className="flex h-full max-h-screen flex-col">
        <div className="flex h-14 items-center border-b-2 border-gray-200 px-4 lg:h-[60px] lg:px-6 bg-white">
          <Link to="/" className="flex items-center gap-2 font-semibold text-gray-800">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <span className="text-lg">EduConnect</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <nav className="grid items-start px-3 text-sm font-medium lg:px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 transition-all font-medium",
                    isActive 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-sm"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Profile section at the bottom */}
        <div className="border-t-2 border-gray-200 px-3 py-3 lg:px-4 bg-white">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <div className="flex items-center gap-3 rounded-lg px-3 py-3 text-gray-700 transition-all hover:bg-gray-50 cursor-pointer">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-semibold truncate text-gray-800">{user?.fullName}</div>
                  <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                </div>
                <Badge className={cn("text-xs font-medium", getRoleBadgeColor(user?.role || ''))}>
                  {user?.role}
                </Badge>
              </div>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="w-56 bg-white border rounded-md shadow-lg" align="start" side="top">
              <DropdownMenu.Label className="px-2 py-1.5 text-sm font-semibold">
                My Account
              </DropdownMenu.Label>
              <DropdownMenu.Separator className="h-px bg-border" />
              
              <DropdownMenu.Item asChild>
                <Link
                  to={`/${user?.role?.toLowerCase()}/profile`}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenu.Item>
              
              <DropdownMenu.Separator className="h-px bg-border" />
              
              <DropdownMenu.Item
                className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
    </div>
  )
}

export default Sidebar