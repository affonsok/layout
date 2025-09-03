import React, { useState } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Switch,
  Select,
  SelectItem,
  Divider,
  Tabs,
  Tab,
  Slider,
  RadioGroup,
  Radio,
  Chip
} from '@heroui/react'
import {
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  GlobeAltIcon,
  KeyIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '../store/appStore'
import { useAuthStore } from '../store/authStore'
import { toast } from 'sonner'

export default function Settings() {
  const { settings, updateSettings } = useAppStore()
  const { user, signOut } = useAuthStore()
  
  const [isLoading, setIsLoading] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  
  const handleSettingsUpdate = async (newSettings: Partial<typeof settings>) => {
    try {
      setIsLoading(true)
      await updateSettings(newSettings)
      toast.success('Configurações atualizadas com sucesso!')
    } catch (error) {
      toast.error('Erro ao atualizar configurações')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    handleSettingsUpdate({ theme })
  }
  
  const handleLanguageChange = (language: string) => {
    handleSettingsUpdate({ language: language as 'pt-BR' | 'en-US' })
  }
  
  const handleNotificationChange = (type: string, enabled: boolean) => {
    handleSettingsUpdate({
      notifications: {
        ...settings.notifications,
        [type]: enabled
      }
    })
  }
  
  const handlePrivacyChange = (type: string, enabled: boolean) => {
    handleSettingsUpdate({
      privacy: {
        ...settings.privacy,
        [type]: enabled
      }
    })
  }
  
  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETAR') {
      toast.error('Digite "DELETAR" para confirmar')
      return
    }
    
    try {
      // Aqui você implementaria a lógica de exclusão da conta
      toast.success('Solicitação de exclusão enviada')
      await signOut()
    } catch (error) {
      toast.error('Erro ao processar solicitação')
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-1">Gerencie suas preferências e configurações do sistema</p>
        </div>
      </div>
      
      <Tabs aria-label="Configurações" className="w-full">
        {/* Geral */}
        <Tab key="general" title={
          <div className="flex items-center space-x-2">
            <CogIcon className="h-4 w-4" />
            <span>Geral</span>
          </div>
        }>
          <div className="space-y-6">
            {/* Aparência */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <PaintBrushIcon className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Aparência</h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Tema
                  </label>
                  <RadioGroup
                    value={settings.theme}
                    onValueChange={handleThemeChange}
                    orientation="horizontal"
                  >
                    <Radio value="light">Claro</Radio>
                    <Radio value="dark">Escuro</Radio>
                    <Radio value="system">Sistema</Radio>
                  </RadioGroup>
                </div>
                
                <Divider />
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Animações</p>
                    <p className="text-xs text-gray-600">Habilitar animações na interface</p>
                  </div>
                  <Switch
                    isSelected={settings.animations}
                    onValueChange={(checked) => handleSettingsUpdate({ animations: checked })}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Sidebar Compacta</p>
                    <p className="text-xs text-gray-600">Usar sidebar em modo compacto</p>
                  </div>
                  <Switch
                    isSelected={settings.compactSidebar}
                    onValueChange={(checked) => handleSettingsUpdate({ compactSidebar: checked })}
                  />
                </div>
              </CardBody>
            </Card>
            
            {/* Idioma e Região */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <GlobeAltIcon className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Idioma e Região</h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <Select
                  label="Idioma"
                  placeholder="Selecione o idioma"
                  selectedKeys={[settings.language]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string
                    handleLanguageChange(selected)
                  }}
                >
                  <SelectItem key="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem key="en-US">English (US)</SelectItem>
                <SelectItem key="es-ES">Español</SelectItem>
                </Select>
                
                <Select
                  label="Fuso Horário"
                  placeholder="Selecione o fuso horário"
                  selectedKeys={[settings.timezone || 'America/Sao_Paulo']}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string
                    handleSettingsUpdate({ timezone: selected })
                  }}
                >
                  <SelectItem key="America/Sao_Paulo">
                  São Paulo (UTC-3)
                </SelectItem>
                <SelectItem key="America/New_York">
                  Nova York (UTC-5)
                </SelectItem>
                <SelectItem key="Europe/London">
                  Londres (UTC+0)
                </SelectItem>
                </Select>
              </CardBody>
            </Card>
          </div>
        </Tab>
        
        {/* Notificações */}
        <Tab key="notifications" title={
          <div className="flex items-center space-x-2">
            <BellIcon className="h-4 w-4" />
            <span>Notificações</span>
          </div>
        }>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Preferências de Notificação</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Notificações por Email</p>
                    <p className="text-xs text-gray-600">Receber atualizações importantes por email</p>
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
                    <p className="text-sm font-medium text-gray-900">Notificações de Sistema</p>
                    <p className="text-xs text-gray-600">Atualizações e manutenções do sistema</p>
                  </div>
                  <Switch
                    isSelected={settings.notifications?.system}
                    onValueChange={(checked) => handleNotificationChange('system', checked)}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Notificações de Marketing</p>
                    <p className="text-xs text-gray-600">Ofertas, promoções e novidades</p>
                  </div>
                  <Switch
                    isSelected={settings.notifications?.marketing}
                    onValueChange={(checked) => handleNotificationChange('marketing', checked)}
                  />
                </div>
                
                <Divider />
                
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">Frequência de Email</p>
                  <RadioGroup
                    value={settings.emailFrequency || 'daily'}
                    onValueChange={(value) => handleSettingsUpdate({ emailFrequency: value as 'daily' | 'weekly' | 'monthly' })}
                  >
                    <Radio value="immediate">Imediato</Radio>
                    <Radio value="daily">Diário</Radio>
                    <Radio value="weekly">Semanal</Radio>
                    <Radio value="never">Nunca</Radio>
                  </RadioGroup>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>
        
        {/* Privacidade e Segurança */}
        <Tab key="privacy" title={
          <div className="flex items-center space-x-2">
            <ShieldCheckIcon className="h-4 w-4" />
            <span>Privacidade</span>
          </div>
        }>
          <div className="space-y-6">
            {/* Configurações de Privacidade */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Configurações de Privacidade</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Perfil Público</p>
                    <p className="text-xs text-gray-600">Permitir que outros vejam seu perfil</p>
                  </div>
                  <Switch
                    isSelected={settings.privacy?.publicProfile}
                    onValueChange={(checked) => handlePrivacyChange('publicProfile', checked)}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Mostrar Status Online</p>
                    <p className="text-xs text-gray-600">Exibir quando você está online</p>
                  </div>
                  <Switch
                    isSelected={settings.privacy?.showOnlineStatus}
                    onValueChange={(checked) => handlePrivacyChange('showOnlineStatus', checked)}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Coleta de Dados de Uso</p>
                    <p className="text-xs text-gray-600">Ajudar a melhorar o produto</p>
                  </div>
                  <Switch
                    isSelected={settings.privacy?.dataCollection}
                    onValueChange={(checked) => handlePrivacyChange('dataCollection', checked)}
                  />
                </div>
              </CardBody>
            </Card>
            
            {/* Segurança */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <KeyIcon className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Segurança</h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Autenticação de Dois Fatores</p>
                    <p className="text-xs text-gray-600">Adicionar uma camada extra de segurança</p>
                  </div>
                  <Button size="sm" color="primary" variant="flat">
                    Configurar
                  </Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Sessões Ativas</p>
                    <p className="text-xs text-gray-600">Gerencie dispositivos conectados</p>
                  </div>
                  <Button size="sm" color="default" variant="flat">
                    Ver Sessões
                  </Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Alterar Senha</p>
                    <p className="text-xs text-gray-600">Última alteração: há 30 dias</p>
                  </div>
                  <Button size="sm" color="warning" variant="flat">
                    Alterar
                  </Button>
                </div>
              </CardBody>
            </Card>
            
            {/* Zona de Perigo */}
            <Card className="border-danger-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-danger-600" />
                  <h3 className="text-lg font-semibold text-danger-900">Zona de Perigo</h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="bg-danger-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-danger-900 mb-2">
                    Excluir Conta
                  </h4>
                  <p className="text-xs text-danger-700 mb-4">
                    Esta ação é irreversível. Todos os seus dados serão permanentemente removidos.
                  </p>
                  
                  <Input
                    label="Digite 'DELETAR' para confirmar"
                    placeholder="DELETAR"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="mb-4"
                  />
                  
                  <Button
                    color="danger"
                    startContent={<TrashIcon className="h-4 w-4" />}
                    onPress={handleDeleteAccount}
                    isDisabled={deleteConfirmation !== 'DELETAR'}
                  >
                    Excluir Conta Permanentemente
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>
      </Tabs>
    </div>
  )
}