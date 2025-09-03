import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Função para verificar se o Supabase está disponível
export const checkSupabaseHealth = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('user_profiles').select('count').limit(1)
    return !error
  } catch (error) {
    console.warn('Supabase health check failed:', error)
    return false
  }
}

// Função para tratar erros do Supabase
export const handleSupabaseError = (error: any): string => {
  if (!error) return 'Erro desconhecido'
  
  // Verificar se é erro de recursos insuficientes
  if (error.message?.includes('insufficient_resources') || 
      error.message?.includes('quota exceeded') ||
      error.message?.includes('rate limit')) {
    return 'Serviço temporariamente indisponível. Tente novamente em alguns minutos.'
  }
  
  // Verificar se é erro de conectividade
  if (error.message?.includes('fetch') || 
      error.message?.includes('network') ||
      error.message?.includes('connection')) {
    return 'Problema de conexão. Verifique sua internet e tente novamente.'
  }
  
  // Verificar se é erro de autenticação
  if (error.message?.includes('Invalid login credentials') ||
      error.message?.includes('Email not confirmed')) {
    return 'Credenciais inválidas. Verifique seu email e senha.'
  }
  
  return error.message || 'Erro no servidor. Tente novamente mais tarde.'
}

// Tipos para autenticação
export type AuthUser = {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}

// Tipos para perfil do usuário
export type UserProfile = {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

// Tipos para notificações
export type Notification = {
  id: string
  user_id: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}