import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Input, Card, CardBody, CardHeader, Divider } from '@heroui/react'
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../store/authStore'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido')
})

export default function ForgotPassword() {
  const { resetPassword, isLoading, error, clearError } = useAuthStore()
  
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const handleInputChange = (value: string) => {
    setEmail(value)
    
    // Limpar erros quando o usuário começar a digitar
    if (emailError) {
      setEmailError('')
    }
    if (error) {
      clearError()
    }
    if (success) {
      setSuccess(false)
    }
  }
  
  const validateEmail = (): boolean => {
    try {
      forgotPasswordSchema.parse({ email })
      setEmailError('')
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0]?.message || 'Email inválido')
      }
      return false
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateEmail()) {
      return
    }
    
    const { error } = await resetPassword(email)
    
    if (!error) {
      setSuccess(true)
    }
  }
  
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-col gap-3 pb-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <EnvelopeIcon className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Email enviado!</h1>
              <p className="text-gray-600 mt-2">
                Enviamos um link de recuperação para seu email
              </p>
            </div>
          </CardHeader>
          
          <Divider />
          
          <CardBody className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Verifique sua caixa de entrada e clique no link para redefinir sua senha.
              </p>
              
              <p className="text-xs text-gray-500">
                Não recebeu o email? Verifique sua pasta de spam ou tente novamente.
              </p>
              
              <div className="pt-4">
                <Link to="/login">
                  <Button
                    color="primary"
                    variant="flat"
                    startContent={<ArrowLeftIcon className="h-4 w-4" />}
                    className="w-full"
                  >
                    Voltar para o login
                  </Button>
                </Link>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-3 pb-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold text-gray-900">Esqueceu sua senha?</h1>
            <p className="text-gray-600 mt-2">
              Digite seu email para receber um link de recuperação
            </p>
          </div>
        </CardHeader>
        
        <Divider />
        
        <CardBody className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => handleInputChange(e.target.value)}
              isInvalid={!!emailError}
              errorMessage={emailError}
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
              {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Voltar para o login
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
  )
}