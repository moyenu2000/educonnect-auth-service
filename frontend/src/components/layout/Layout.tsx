import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import { useAuth } from '@/contexts/AuthContext'

interface LayoutProps {
  children?: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen w-full">
      <div className="hidden md:flex md:w-[220px] lg:w-[280px] border-r bg-muted/40 fixed h-full z-10">
        <Sidebar userRole={(user.role as 'ADMIN' | 'QUESTION_SETTER' | 'STUDENT') || 'STUDENT'} />
      </div>
      
      <div className="flex flex-col flex-1 md:ml-[220px] lg:ml-[280px]">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="flex flex-col gap-4 lg:gap-6">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout