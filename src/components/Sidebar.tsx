import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button, Avatar, Divider, Tooltip } from '@heroui/react'
import {
  HomeIcon,
  UsersIcon,
  BellIcon,
  UserIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../store/authStore'
import { useAppStore } from '../store/appStore'
import type { NavItem } from '../types'

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon
  },
  {
    id: 'users',
    label: 'Usuários',
    href: '/dashboard/users',
    icon: UsersIcon
  },
  {
    id: 'notifications',
    label: 'Notificações',
    href: '/dashboard/notifications',
    icon: BellIcon
  },
  {
    id: 'profile',
    label: 'Perfil',
    href: '/dashboard/profile',
    icon: UserIcon
  },
  {
    id: 'settings',
    label: 'Configurações',
    href: '/dashboard/settings',
    icon: Cog6ToothIcon
  }
]

export default function Sidebar() {
  const location = useLocation()
  const { user, signOut } = useAuthStore()
  const { sidebarCollapsed, toggleSidebar, unreadCount } = useAppStore()
  
  const handleSignOut = async () => {
    await signOut()
  }
  
  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(href)
  }
  
  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-full ${
      sidebarCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="font-bold text-gray-900">HeroUI</span>
            </div>
          )}
          
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700"
          >
            {sidebarCollapsed ? (
              <ChevronRightIcon className="h-5 w-5" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      
      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Avatar
            src={user?.user_metadata?.avatar_url}
            name={user?.user_metadata?.full_name || user?.email}
            size="sm"
            className="flex-shrink-0"
          />
          
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.user_metadata?.full_name || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = isActiveRoute(item.href)
          const IconComponent = item.icon
          const showBadge = item.id === 'notifications' && unreadCount > 0
          
          const navButton = (
            <Button
              as={Link}
              to={item.href}
              variant={isActive ? 'flat' : 'light'}
              color={isActive ? 'primary' : 'default'}
              className={`w-full justify-start h-12 ${
                sidebarCollapsed ? 'px-0' : 'px-4'
              } ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
              startContent={
                <div className="relative">
                  <IconComponent className="h-5 w-5" />
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>
              }
            >
              {!sidebarCollapsed && item.label}
            </Button>
          )
          
          if (sidebarCollapsed) {
            return (
              <Tooltip key={item.id} content={item.label} placement="right">
                {navButton}
              </Tooltip>
            )
          }
          
          return <div key={item.id}>{navButton}</div>
        })}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Divider className="mb-4" />
        
        {sidebarCollapsed ? (
          <Tooltip content="Sair" placement="right">
            <Button
              isIconOnly
              variant="light"
              color="danger"
              onClick={handleSignOut}
              className="w-full"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </Button>
          </Tooltip>
        ) : (
          <Button
            variant="light"
            color="danger"
            onClick={handleSignOut}
            startContent={<ArrowRightOnRectangleIcon className="h-5 w-5" />}
            className="w-full justify-start"
          >
            Sair
          </Button>
        )}
      </div>
    </div>
  )
}