import React, { useState } from 'react'
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Badge,
  Input
} from '@heroui/react'
import {
  BellIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../store/authStore'
import { useAppStore } from '../store/appStore'

export default function Header() {
  const { user, signOut } = useAuthStore()
  const { 
    unreadCount, 
    notifications, 
    markNotificationAsRead,
    markAllNotificationsAsRead,
    settings,
    updateSettings,
    toggleSidebar 
  } = useAppStore()
  
  const [searchValue, setSearchValue] = useState('')
  
  const handleSignOut = async () => {
    await signOut()
  }
  
  const handleNotificationClick = async (notificationId: string) => {
    await markNotificationAsRead(notificationId)
  }
  
  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead()
  }
  
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme })
  }
  
  const getThemeIcon = () => {
    switch (settings.theme) {
      case 'light':
        return <SunIcon className="h-4 w-4" />
      case 'dark':
        return <MoonIcon className="h-4 w-4" />
      default:
        return <ComputerDesktopIcon className="h-4 w-4" />
    }
  }
  
  const recentNotifications = notifications.slice(0, 5)
  
  return (
    <Navbar 
      className="bg-white border-b border-gray-200" 
      maxWidth="full"
      height="4rem"
    >
      {/* Left side */}
      <NavbarContent justify="start">
        <NavbarItem>
          <Button
            isIconOnly
            variant="light"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <Bars3Icon className="h-6 w-6" />
          </Button>
        </NavbarItem>
        
        <NavbarItem className="hidden sm:flex">
          <Input
            classNames={{
              base: "max-w-full sm:max-w-[20rem] h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Buscar..."
            size="sm"
            startContent={<MagnifyingGlassIcon className="h-4 w-4" />}
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </NavbarItem>
      </NavbarContent>
      
      {/* Right side */}
      <NavbarContent justify="end">
        {/* Theme Selector */}
        <NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                variant="light"
                className="text-gray-600"
              >
                {getThemeIcon()}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Tema"
              onAction={(key) => handleThemeChange(key as 'light' | 'dark' | 'system')}
            >
              <DropdownItem
                key="light"
                startContent={<SunIcon className="h-4 w-4" />}
              >
                Claro
              </DropdownItem>
              <DropdownItem
                key="dark"
                startContent={<MoonIcon className="h-4 w-4" />}
              >
                Escuro
              </DropdownItem>
              <DropdownItem
                key="system"
                startContent={<ComputerDesktopIcon className="h-4 w-4" />}
              >
                Sistema
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
        
        {/* Notifications */}
        <NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                variant="light"
                className="text-gray-600"
              >
                <Badge 
                  content={unreadCount > 0 ? unreadCount : undefined}
                  color="danger"
                  size="sm"
                  isInvisible={unreadCount === 0}
                >
                  <BellIcon className="h-5 w-5" />
                </Badge>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Notificações"
              className="w-80"
              closeOnSelect={false}
            >
              <DropdownItem
                key="header"
                className="h-14 gap-2"
                textValue="Notificações"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Notificações</p>
                  {unreadCount > 0 && (
                    <Button
                      size="sm"
                      variant="light"
                      color="primary"
                      onClick={handleMarkAllAsRead}
                    >
                      Marcar todas como lidas
                    </Button>
                  )}
                </div>
              </DropdownItem>
              
              {recentNotifications.length > 0 ? (
                <>
                  {recentNotifications.map((notification) => (
                    <DropdownItem
                      key={notification.id}
                      className={`h-auto py-3 ${!notification.is_read ? 'bg-blue-50' : ''}`}
                      textValue={notification.title}
                      onPress={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex flex-col gap-1">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(notification.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </DropdownItem>
                  ))}
                </>
              ) : (
                <DropdownItem key="empty" textValue="Sem notificações">
                  <p className="text-center text-gray-500 py-4">
                    Nenhuma notificação
                  </p>
                </DropdownItem>
              )}
              
              {notifications.length > 5 && (
                <DropdownItem key="view-all" textValue="Ver todas">
                  <p className="text-center text-blue-600 font-medium">
                    Ver todas as notificações
                  </p>
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
        
        {/* User Menu */}
        <NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              <Avatar
                as="button"
                className="transition-transform"
                src={user?.user_metadata?.avatar_url}
                name={user?.user_metadata?.full_name || user?.email}
                size="sm"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Menu do usuário">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Logado como</p>
                <p className="font-semibold">{user?.user_metadata?.full_name || 'Usuário'}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </DropdownItem>
              
              <DropdownItem key="my-profile">
                Meu Perfil
              </DropdownItem>
              
              <DropdownItem key="settings">
                Configurações
              </DropdownItem>
              
              <DropdownItem 
                key="logout" 
                color="danger"
                onPress={handleSignOut}
              >
                Sair
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}