import { create } from 'zustand'
import { supabase, handleSupabaseError, checkSupabaseHealth } from '../lib/supabase'
import type { AuthState, User, Session } from '../types'

interface AuthStore extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, name?: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  updateProfile: (updates: Record<string, any>) => Promise<{ error: string | null }>
  initialize: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  session: null,
  isLoading: false,
  error: null,

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    
    try {
      // Verificar se o Supabase está disponível
      const isHealthy = await checkSupabaseHealth()
      if (!isHealthy) {
        const errorMessage = 'Serviço temporariamente indisponível. Tente novamente em alguns minutos.'
        set({ isLoading: false, error: errorMessage })
        return { error: errorMessage }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        const errorMessage = handleSupabaseError(error)
        set({ isLoading: false, error: errorMessage })
        return { error: errorMessage }
      }

      set({
        user: data.user,
        session: data.session,
        isLoading: false,
        error: null
      })

      return { error: null }
    } catch (error) {
      const errorMessage = handleSupabaseError(error)
      set({ isLoading: false, error: errorMessage })
      return { error: errorMessage }
    }
  },

  signUp: async (email, password, name) => {
    set({ isLoading: true, error: null })
    
    try {
      // Verificar se o Supabase está disponível
      const isHealthy = await checkSupabaseHealth()
      if (!isHealthy) {
        const errorMessage = 'Serviço temporariamente indisponível. Tente novamente em alguns minutos.'
        set({ isLoading: false, error: errorMessage })
        return { error: errorMessage }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      })
      
      if (error) {
        const errorMessage = handleSupabaseError(error)
        set({ isLoading: false, error: errorMessage })
        return { error: errorMessage }
      }
      
      set({
        user: data.user,
        session: data.session,
        isLoading: false,
        error: null
      })
      
      return { error: null }
    } catch (error) {
      const errorMessage = handleSupabaseError(error)
      set({ isLoading: false, error: errorMessage })
      return { error: errorMessage }
    }
  },

  signOut: async () => {
    set({ isLoading: true })
    
    try {
      await supabase.auth.signOut()
      set({
        user: null,
        session: null,
        isLoading: false,
        error: null
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro no logout'
      set({ isLoading: false, error: errorMessage })
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        set({ isLoading: false, error: error.message })
        return { error: error.message }
      }

      set({ isLoading: false, error: null })
      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      set({ isLoading: false, error: errorMessage })
      return { error: errorMessage }
    }
  },

  updateProfile: async (updates) => {
    set({ isLoading: true, error: null })
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates
      })
      
      if (error) {
        set({ isLoading: false, error: error.message })
        return { error: error.message }
      }
      
      // Atualizar o estado local
      const { data: { user } } = await supabase.auth.getUser()
      set({
        user,
        isLoading: false,
        error: null
      })
      
      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar perfil'
      set({ isLoading: false, error: errorMessage })
      return { error: errorMessage }
    }
  },

  initialize: async () => {
    set({ isLoading: true })
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        set({
          user: session.user,
          session,
          isLoading: false,
          error: null
        })
      } else {
        set({
          user: null,
          session: null,
          isLoading: false,
          error: null
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na inicialização'
      set({ isLoading: false, error: errorMessage })
    }
  },

  clearError: () => {
    set({ error: null })
  }
}))