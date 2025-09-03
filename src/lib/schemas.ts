import { z } from 'zod'

// Schema para login
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
})

export type LoginFormData = z.infer<typeof loginSchema>

// Schema para registro
export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirmação de senha deve ter pelo menos 6 caracteres'),
  fullName: z.string().min(2, 'Nome completo deve ter pelo menos 2 caracteres')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword']
})

export type RegisterFormData = z.infer<typeof registerSchema>

// Schema para perfil do usuário
export const profileSchema = z.object({
  fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  avatarUrl: z.string().optional().or(z.literal('')),
  bio: z.string().optional(),
  job_title: z.string().optional(),
  website: z.string().optional(),
  location: z.string().optional(),
  company: z.string().optional(),
  phone: z.string().optional()
})

export type ProfileFormData = z.infer<typeof profileSchema>

// Schema para criação/edição de usuário (admin)
export const userSchema = z.object({
  email: z.string().email('Email inválido'),
  fullName: z.string().min(2, 'Nome completo deve ter pelo menos 2 caracteres'),
  role: z.enum(['user', 'admin'], {
    errorMap: () => ({ message: 'Papel deve ser usuário ou administrador' })
  }),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional()
})

export type UserFormData = z.infer<typeof userSchema>

// Schema para configurações
export const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  language: z.enum(['pt-BR', 'en-US']),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    marketing: z.boolean()
  })
})

export type SettingsFormData = z.infer<typeof settingsSchema>

// Schema para notificações
export const notificationSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string().min(1, 'Título é obrigatório'),
  message: z.string().min(1, 'Mensagem é obrigatória'),
  is_read: z.boolean(),
  created_at: z.string()
})

export type NotificationData = z.infer<typeof notificationSchema>