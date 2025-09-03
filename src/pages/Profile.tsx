import React, { useState, useEffect } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Avatar,
  Divider,
  Chip,
  Textarea,
  Select,
  SelectItem,
  Switch
} from '@heroui/react'
import {
  PencilIcon,
  CameraIcon,
  CheckIcon,
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../store/authStore'
import { useAppStore } from '../store/appStore'
import { profileSchema } from '../lib/schemas'
import { toast } from 'sonner'
import { z } from 'zod'

type ProfileFormData = z.infer<typeof profileSchema>

export default function Profile() {
  const { user, updateProfile } = useAuthStore()
  const { settings, updateSettings } = useAppStore()
  
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    bio: user?.user_metadata?.bio || '',
    location: user?.user_metadata?.location || '',
    website: user?.user_metadata?.website || '',
    company: user?.user_metadata?.company || '',
    job_title: user?.user_metadata?.job_title || ''
  })
  
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        bio: user.user_metadata?.bio || '',
        location: user.user_metadata?.location || '',
        website: user.user_metadata?.website || '',
        company: user.user_metadata?.company || '',
        job_title: user.user_metadata?.job_title || ''
      })
    }
  }, [user])
  
  const handleSave = async () => {
    try {
      setIsLoading(true)
      setErrors({})
      
      // Validar dados
      const validatedData = profileSchema.parse(formData)
      
      // Atualizar perfil
      await updateProfile(validatedData)
      
      setIsEditing(false)
      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
      } else {
        toast.error('Erro ao atualizar perfil')
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleCancel = () => {
    if (user) {
      setFormData({
        fullName: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        bio: user.user_metadata?.bio || '',
        location: user.user_metadata?.location || '',
        website: user.user_metadata?.website || '',
        company: user.user_metadata?.company || '',
        job_title: user.user_metadata?.job_title || ''
      })
    }
    setIsEditing(false)
    setErrors({})
  }
  
  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }
  
  const handleNotificationChange = (type: string, enabled: boolean) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [type]: enabled
      }
    })
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600 mt-1">Gerencie suas informações pessoais</p>
        </div>
      </div>
      
      {/* Profile Header */}
      <Card>
        <CardBody className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <Avatar
                src={user?.user_metadata?.avatar_url}
                name={formData.fullName || formData.email}
                className="w-24 h-24 text-large"
              />
              <Button
                isIconOnly
                size="sm"
                color="primary"
                className="absolute -bottom-1 -right-1"
                disabled={!isEditing}
              >
                <CameraIcon className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-semibold text-gray-900">
                {formData.fullName || 'Sem nome'}
              </h2>
              <p className="text-gray-600">{formData.email}</p>
              {formData.job_title && (
                <p className="text-sm text-gray-500 mt-1">{formData.job_title}</p>
              )}
              {formData.company && (
                <p className="text-sm text-gray-500">{formData.company}</p>
              )}
              
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                <Chip size="sm" color="primary" variant="flat">
                  Usuário Ativo
                </Chip>
                {user?.user_metadata?.role && (
                  <Chip size="sm" color="secondary" variant="flat" className="capitalize">
                    {user.user_metadata.role}
                  </Chip>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              {!isEditing ? (
                <Button
                  color="primary"
                  startContent={<PencilIcon className="h-4 w-4" />}
                  onPress={() => setIsEditing(true)}
                >
                  Editar Perfil
                </Button>
              ) : (
                <>
                  <Button
                    color="danger"
                    variant="flat"
                    startContent={<XMarkIcon className="h-4 w-4" />}
                    onPress={handleCancel}
                  >
                    Cancelar
                  </Button>
                  <Button
                    color="primary"
                    startContent={<CheckIcon className="h-4 w-4" />}
                    onPress={handleSave}
                    isLoading={isLoading}
                  >
                    Salvar
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                Informações Pessoais
              </h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome Completo"
                  placeholder="Digite seu nome completo"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  isDisabled={!isEditing}
                  isInvalid={!!errors.full_name}
                  errorMessage={errors.full_name}
                  startContent={<UserIcon className="h-4 w-4 text-gray-400" />}
                />
                
                <Input
                  label="Email"
                  placeholder="Digite seu email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  isDisabled={!isEditing}
                  isInvalid={!!errors.email}
                  errorMessage={errors.email}
                  startContent={<EnvelopeIcon className="h-4 w-4 text-gray-400" />}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Telefone"
                  placeholder="Digite seu telefone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  isDisabled={!isEditing}
                  isInvalid={!!errors.phone}
                  errorMessage={errors.phone}
                  startContent={<PhoneIcon className="h-4 w-4 text-gray-400" />}
                />
                
                <Input
                  label="Localização"
                  placeholder="Digite sua localização"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  isDisabled={!isEditing}
                  isInvalid={!!errors.location}
                  errorMessage={errors.location}
                  startContent={<MapPinIcon className="h-4 w-4 text-gray-400" />}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Empresa"
                  placeholder="Digite sua empresa"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  isDisabled={!isEditing}
                  isInvalid={!!errors.company}
                  errorMessage={errors.company}
                />
                
                <Input
                  label="Cargo"
                  placeholder="Digite seu cargo"
                  value={formData.job_title}
                  onChange={(e) => handleInputChange('job_title', e.target.value)}
                  isDisabled={!isEditing}
                  isInvalid={!!errors.job_title}
                  errorMessage={errors.job_title}
                />
              </div>
              
              <Input
                label="Website"
                placeholder="Digite seu website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                isDisabled={!isEditing}
                isInvalid={!!errors.website}
                errorMessage={errors.website}
              />
              
              <Textarea
                label="Bio"
                placeholder="Conte um pouco sobre você"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                isDisabled={!isEditing}
                isInvalid={!!errors.bio}
                errorMessage={errors.bio}
                minRows={3}
                maxRows={5}
              />
            </CardBody>
          </Card>
        </div>
        
        {/* Account Info & Preferences */}
        <div className="space-y-6">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                Informações da Conta
              </h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Membro desde</p>
                  <p className="text-sm text-gray-600">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                  </p>
                </div>
              </div>
              
              <Divider />
              
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Status da Conta</p>
                  <p className="text-sm text-green-600">Ativa</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckIcon className="w-3 h-3 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Verificado</p>
                  <p className="text-sm text-blue-600">Sim</p>
                </div>
              </div>
            </CardBody>
          </Card>
          
          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                Preferências de Notificação
              </h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">Notificações por Email</p>
                  <p className="text-xs text-gray-600">Receber atualizações por email</p>
                </div>
                <Switch
                  isSelected={settings.notifications?.email}
                  onValueChange={(checked) => handleNotificationChange('email', checked)}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">Notificações Push</p>
                  <p className="text-xs text-gray-600">Receber notificações no navegador</p>
                </div>
                <Switch
                  isSelected={settings.notifications?.push}
                  onValueChange={(checked) => handleNotificationChange('push', checked)}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">Atualizações do Sistema</p>
                  <p className="text-xs text-gray-600">Receber notificações de sistema</p>
                </div>
                <Switch
                  isSelected={settings.notifications?.system}
                  onValueChange={(checked) => handleNotificationChange('system', checked)}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">Marketing</p>
                  <p className="text-xs text-gray-600">Receber ofertas e promoções</p>
                </div>
                <Switch
                  isSelected={settings.notifications?.marketing}
                  onValueChange={(checked) => handleNotificationChange('marketing', checked)}
                />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}