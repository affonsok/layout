import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, Card, CardBody, CardHeader, Divider } from '@heroui/react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../store/authStore'
import { loginSchema, type LoginFormData } from '../lib/schemas'
import { z } from 'zod'
import SupabaseStatus from '../components/SupabaseStatus'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, isLoading, error, clearError } = useAuthStore()
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })
  
  const [formErrors, setFormErrors] = useState<Partial<LoginFormData>>({})
  const [isVisible, setIsVisible] = useState(false)
  
  const toggleVisibility = () => setIsVisible(!isVisible)
  
  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
    
    // Limpar erro geral
    if (error) {
      clearError()
    }
  }
  
  const validateForm = (): boolean => {
    try {
      loginSchema.parse(formData)
      setFormErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<LoginFormData> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as keyof LoginFormData] = err.message
          }
        })
        setFormErrors(errors)
      }
      return false
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    const { error } = await signIn(formData.email, formData.password)
    
    if (!error) {
      navigate('/dashboard')
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-4">
        <SupabaseStatus />
        <Card className="w-full">
        <CardHeader className="flex flex-col gap-3 pb-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold text-gray-900">Bem-vindo de volta</h1>
            <p className="text-gray-600 mt-2">Entre na sua conta para continuar</p>
          </div>
        </CardHeader>
        
        <Divider />
        
        <CardBody className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="Digite seu email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              isInvalid={!!formErrors.email}
              errorMessage={formErrors.email}
              variant="bordered"
              size="lg"
              classNames={{
                input: "text-sm",
                inputWrapper: "h-12"
              }}
            />
            
            <Input
              label="Senha"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              isInvalid={!!formErrors.password}
              errorMessage={formErrors.password}
              variant="bordered"
              size="lg"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              classNames={{
                input: "text-sm",
                inputWrapper: "h-12"
              }}
            />
            
            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              color="primary"
              size="lg"
              className="w-full font-medium"
              isLoading={isLoading}
                disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Esqueceu sua senha?
            </Link>
          </div>
          
          <Divider className="my-6" />
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </CardBody>
        </Card>
      </div>
    </div>
  )
}