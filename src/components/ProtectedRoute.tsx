import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Spinner } from '@heroui/react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, isLoading, initialize } = useAuthStore()
  const location = useLocation()
  const [hasInitialized, setHasInitialized] = useState(false)
  
  useEffect(() => {
    // Inicializar autenticação apenas uma vez
    if (!hasInitialized) {
      initialize().finally(() => {
        setHasInitialized(true)
      })
    }
  }, [initialize, hasInitialized])
  
  // Mostrar loading enquanto verifica autenticação
  if (isLoading || !hasInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }
  
  // Se requer autenticação e usuário não está logado
  if (requireAuth && !user) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    )
  }
  
  // Se não requer autenticação e usuário está logado (ex: páginas de login)
  if (!requireAuth && user) {
    return <Navigate to="/dashboard" replace />
  }
  
  return <>{children}</>
}

// Componente específico para rotas públicas (login, registro)
export function PublicRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireAuth={false} redirectTo="/dashboard">
      {children}
    </ProtectedRoute>
  )
}

// Componente específico para rotas privadas (dashboard, perfil, etc)
export function PrivateRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireAuth={true} redirectTo="/login">
      {children}
    </ProtectedRoute>
  )
}