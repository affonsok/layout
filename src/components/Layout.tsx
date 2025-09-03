import React, { useEffect } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useAppStore } from '../store/appStore'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
  const { user, isLoading, initialize } = useAuthStore()
  const { isSidebarOpen, fetchNotifications, fetchDashboardStats } = useAppStore()
  
  useEffect(() => {
    initialize()
  }, [])
  
  useEffect(() => {
    if (user) {
      // Carregar dados iniciais quando o usuário estiver autenticado
      fetchNotifications()
      fetchDashboardStats()
    }
  }, [user, fetchNotifications, fetchDashboardStats])
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <Sidebar />
      </div>
      
      {/* Overlay para mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => useAppStore.getState().toggleSidebar()}
        />
      )}
      
      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header />
        
        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}