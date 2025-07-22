import React from 'react'
import { Link } from 'react-router-dom'
import { Bell, Search, User, LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Dialog from '@radix-ui/react-dialog'
import { useAuth } from '@/contexts/AuthContext'
import Sidebar from './Sidebar'

const Header: React.FC = () => {
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [notificationCount] = React.useState(3) // Mock notification count

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

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center gap-4 px-4">
        {/* Mobile menu button */}
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </Dialog.Trigger>
          <Dialog.Content className="fixed left-0 top-0 z-50 h-full w-80 bg-background border-r p-0">
            <Sidebar userRole={user?.role || 'STUDENT'} />
          </Dialog.Content>
        </Dialog.Root>

        {/* Search bar */}
        <div className="flex flex-1 items-center gap-4 md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search discussions, questions..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                {notificationCount}
              </Badge>
            )}
            <span className="sr-only">Notifications</span>
          </Button>

          {/* User menu */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">{user?.fullName}</div>
                    <div className="text-xs text-muted-foreground">{user?.email}</div>
                  </div>
                  <Badge className={getRoleBadgeColor(user?.role || '')}>
                    {user?.role}
                  </Badge>
                </div>
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="w-56 bg-white border rounded-md shadow-lg" align="end">
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
    </header>
  )
}

export default Header