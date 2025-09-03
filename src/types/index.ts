import type { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js'

// Tipos para autenticação
export interface AuthState {
  user: SupabaseUser | null
  session: SupabaseSession | null
  isLoading: boolean
  error: string | null
}

// Usar os tipos do Supabase diretamente
export type User = SupabaseUser
export type Session = SupabaseSession

// Tipos para perfil do usuário
export interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: 'user' | 'admin' | 'moderator'
  status: 'active' | 'inactive' | 'pending'
  created_at: string
  updated_at: string
}

// Tipos para notificações
export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

// Tipos para navegação
export interface NavItem {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  children?: NavItem[]
}

// Tipos para dashboard
export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalNotifications: number
  unreadNotifications: number
}

// Tipos para tabela de usuários
export interface UserTableData {
  id: string
  email: string
  full_name: string
  role: 'user' | 'admin'
  avatar_url?: string
  created_at: string
  last_sign_in?: string
}

// Tipos para filtros e paginação
export interface TableFilters {
  search: string
  role: 'all' | 'user' | 'admin'
  sortBy: 'name' | 'email' | 'created_at'
  sortOrder: 'asc' | 'desc'
}

export interface PaginationState {
  page: number
  pageSize: number
  total: number
}

// Tipos para configurações
export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  language: 'pt-BR' | 'en-US'
  notifications: {
    email: boolean
    push: boolean
    marketing: boolean
    system: boolean
  }
  privacy: {
    showOnlineStatus: boolean
    dataCollection: boolean
    publicProfile: boolean
  }
  emailFrequency: 'daily' | 'weekly' | 'monthly'
  compactSidebar: boolean
  timezone: string
  animations: boolean
}

// Tipos para API responses
export interface ApiResponse<T> {
  data: T
  error: string | null
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

// Tipos para formulários
export interface FormState {
  loading: boolean
  error: string | null
  success: boolean
}

// Tipos para modais
export interface ModalState {
  isOpen: boolean
  type: 'create' | 'edit' | 'delete' | 'view'
  data?: any
}