import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, Card, CardBody, CardHeader, Divider } from '@heroui/react'
import { EyeIcon, EyeSlashIcon, UserIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../store/authStore'
import { registerSchema, type RegisterFormData } from '../lib/schemas'
import { z } from 'zod'

export default function Register() {
  const navigate = useNavigate()
  const { signUp, isLoading, error, clearError } = useAuthStore()
  
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  })
  
  const [formErrors, setFormErrors] = useState<Partial<RegisterFormData>>({})
  const [isVisible, setIsVisible] = useState(false)
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)
  
  const toggleVisibility = () => setIsVisible(!isVisible)
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible)
  
  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
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
      registerSchema.parse(formData)
      setFormErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<RegisterFormData> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as keyof RegisterFormData] = err.message
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
    
    const { error } = await signUp(formData.email, formData.password, formData.fullName)
    
    if (!error) {
      navigate('/dashboard')
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-3 pb-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold text-gray-900">Criar conta</h1>
            <p className="text-gray-600 mt-2">Preencha os dados para se cadastrar</p>
          </div>
        </CardHeader>
        
        <Divider />
        
        <CardBody className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              label="Nome completo"
              placeholder="Digite seu nome completo"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              isInvalid={!!formErrors.fullName}
              errorMessage={formErrors.fullName}
              variant="bordered"
              size="lg"
              startContent={
                <UserIcon className="h-5 w-5 text-gray-400" />
              }
              classNames={{
                input: "text-sm",
                inputWrapper: "h-12"
              }}
            />
            
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
              startContent={
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              }
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
            
            <Input
              label="Confirmar senha"
              placeholder="Confirme sua senha"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              isInvalid={!!formErrors.confirmPassword}
              errorMessage={formErrors.confirmPassword}
              variant="bordered"
              size="lg"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleConfirmVisibility}
                >
                  {isConfirmVisible ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              }
              type={isConfirmVisible ? "text" : "password"}
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
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-xs text-gray-500">
            Ao criar uma conta, você concorda com nossos{' '}
            <Link to="/terms" className="text-blue-600 hover:text-blue-800">
              Termos de Uso
            </Link>{' '}
            e{' '}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-800">
              Política de Privacidade
            </Link>
          </div>
          
          <Divider className="my-6" />
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Faça login
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}