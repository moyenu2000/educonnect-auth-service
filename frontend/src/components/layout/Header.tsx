import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import * as Dialog from '@radix-ui/react-dialog'
import { useAuth } from '@/contexts/AuthContext'
import Sidebar from './Sidebar'

interface HeaderProps {
  title?: string
}

const Header: React.FC<HeaderProps> = ({ title = 'Dashboard' }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleBack = () => {
    navigate(-1)
  }

  const getPageTitle = () => {
    if (title !== 'Dashboard') return title
    
    const path = location.pathname
    const segments = path.split('/')
    
    if (segments.includes('admin')) {
      if (segments.includes('users')) return 'User Management'
      if (segments.includes('subjects')) return 'Subject Management'
      if (segments.includes('questions')) {
        if (segments.includes('daily-config')) return 'Configure Daily Questions'
        return 'Question Management'
      }
      if (segments.includes('daily-questions')) return 'Daily Questions'
      if (segments.includes('contests')) return 'Contests'
      if (segments.includes('live-exams')) return 'Live Exams'
      if (segments.includes('analytics')) return 'Analytics'
      if (segments.includes('discussions')) return 'Discussions'
      if (segments.includes('settings')) return 'Settings'
      return 'Admin Dashboard'
    }
    
    if (segments.includes('question-setter')) {
      if (segments.includes('questions')) return 'My Questions'
      if (segments.includes('subjects')) return 'Subjects & Topics'
      if (segments.includes('create-question')) return 'Create Question'
      if (segments.includes('daily-config')) return 'Configure Daily Questions'
      if (segments.includes('contests')) return 'Contests'
      if (segments.includes('analytics')) return 'Analytics'
      if (segments.includes('profile')) return 'Profile'
      return 'Question Setter Dashboard'
    }
    
    if (segments.includes('student')) {
      if (segments.includes('daily-questions')) return 'Daily Questions'
      if (segments.includes('practice')) return 'Practice'
      if (segments.includes('exams')) return 'Live Exams'
      if (segments.includes('contests')) return 'Contests'
      if (segments.includes('discussions')) return 'Discussions'
      if (segments.includes('groups')) return 'Groups'
      if (segments.includes('messages')) return 'Messages'
      if (segments.includes('ai')) return 'AI Assistant'
      if (segments.includes('leaderboard')) return 'Leaderboard'
      if (segments.includes('profile')) return 'Profile'
      return 'Student Dashboard'
    }
    
    return 'Dashboard'
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-14 items-center gap-4 px-4 lg:h-[60px] lg:px-6">
        {/* Mobile menu button */}
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </Dialog.Trigger>
          <Dialog.Content className="fixed left-0 top-0 z-50 h-full w-80 bg-background border-r p-0">
            <Sidebar userRole={(user?.role as 'ADMIN' | 'QUESTION_SETTER' | 'STUDENT') || 'STUDENT'} />
          </Dialog.Content>
        </Dialog.Root>

        {/* Back button */}
        <Button variant="ghost" size="sm" onClick={handleBack} className="px-3">
          ← Back
        </Button>

        {/* Page title */}
        <div className="flex-1 font-semibold">
          <div className="leading-6 text-base">{getPageTitle()}</div>
        </div>
      </div>
    </header>
  )
}

export default Header