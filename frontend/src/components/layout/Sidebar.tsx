import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
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
} from 'lucide-react'

interface SidebarProps {
  userRole: 'ADMIN' | 'QUESTION_SETTER' | 'STUDENT'
}

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const location = useLocation()

  const adminNavItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Subjects', href: '/admin/subjects', icon: BookOpen },
    { name: 'Questions', href: '/admin/questions', icon: FileQuestion },
    { name: 'Daily Questions', href: '/admin/daily-questions', icon: Calendar },
    { name: 'Contests', href: '/admin/contests', icon: Trophy },
    { name: 'Live Exams', href: '/admin/live-exams', icon: Calendar },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Discussions', href: '/admin/discussions', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  const questionSetterNavItems = [
    { name: 'Dashboard', href: '/question-setter', icon: Home },
    { name: 'My Questions', href: '/question-setter/questions', icon: FileQuestion },
    { name: 'Subjects & Topics', href: '/question-setter/subjects', icon: BookOpen },
    { name: 'Create Question', href: '/question-setter/create-question', icon: Brain },
    { name: 'Contests', href: '/question-setter/contests', icon: Trophy },
    { name: 'Analytics', href: '/question-setter/analytics', icon: BarChart3 },
    { name: 'Profile', href: '/question-setter/profile', icon: User },
  ]

  const studentNavItems = [
    { name: 'Dashboard', href: '/student', icon: Home },
    { name: 'Daily Questions', href: '/student/daily-questions', icon: Calendar },
    { name: 'Practice', href: '/student/practice', icon: Brain },
    { name: 'Live Exams', href: '/student/exams', icon: GraduationCap },
    { name: 'Contests', href: '/student/contests', icon: Trophy },
    { name: 'Discussions', href: '/student/discussions', icon: MessageSquare },
    { name: 'Groups', href: '/student/groups', icon: Users },
    { name: 'Messages', href: '/student/messages', icon: MessageSquare },
    { name: 'AI Assistant', href: '/student/ai', icon: Brain },
    { name: 'Leaderboard', href: '/student/leaderboard', icon: BarChart3 },
    { name: 'Profile', href: '/student/profile', icon: User },
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
    <div className="h-full bg-white border-r">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <GraduationCap className="h-6 w-6" />
            <span className="">EduConnect</span>
          </Link>
        </div>
        
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    isActive && "bg-muted text-primary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Sidebar