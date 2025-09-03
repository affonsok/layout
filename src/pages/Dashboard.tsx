import React, { useEffect } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Progress,
  Chip
} from '@heroui/react'
import {
  UsersIcon,
  BellIcon,
  ChartBarIcon,
  CogIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '../store/appStore'
import { useAuthStore } from '../store/authStore'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { 
    dashboardStats, 
    notifications, 
    fetchDashboardStats, 
    fetchNotifications,
    isLoading 
  } = useAppStore()
  
  useEffect(() => {
    fetchDashboardStats()
    fetchNotifications()
  }, [])
  
  const statsCards = [
    {
      title: 'Total de Usuários',
      value: dashboardStats?.totalUsers || 0,
      change: '+12%',
      changeType: 'increase' as const,
      icon: UsersIcon,
      color: 'primary' as const
    },
    {
      title: 'Usuários Ativos',
      value: dashboardStats?.activeUsers || 0,
      change: '+8%',
      changeType: 'increase' as const,
      icon: ChartBarIcon,
      color: 'success' as const
    },
    {
      title: 'Notificações',
      value: dashboardStats?.totalNotifications || 0,
      change: '-3%',
      changeType: 'decrease' as const,
      icon: BellIcon,
      color: 'warning' as const
    },
    {
      title: 'Configurações',
      value: '98%',
      change: '+2%',
      changeType: 'increase' as const,
      icon: CogIcon,
      color: 'secondary' as const
    }
  ]
  
  const recentNotifications = notifications.slice(0, 5)
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bem-vindo, {user?.user_metadata?.full_name || 'Usuário'}!
        </h1>
        <p className="text-gray-600">
          Aqui está um resumo das atividades do seu dashboard.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index} className="border-none shadow-md">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      {stat.changeType === 'increase' ? (
                        <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                    <IconComponent className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardBody>
            </Card>
          )
        })}
      </div>
      
      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <Card className="lg:col-span-2 border-none shadow-md">
          <CardHeader className="pb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Atividade dos Usuários
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Usuários Ativos</span>
                <span className="text-sm font-bold text-gray-900">85%</span>
              </div>
              <Progress 
                value={85} 
                color="primary" 
                className="max-w-full"
                aria-label="Usuários Ativos"
              />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Novos Registros</span>
                <span className="text-sm font-bold text-gray-900">62%</span>
              </div>
              <Progress 
                value={62} 
                color="success" 
                className="max-w-full"
                aria-label="Novos Registros"
              />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Engajamento</span>
                <span className="text-sm font-bold text-gray-900">78%</span>
              </div>
              <Progress 
                value={78} 
                color="warning" 
                className="max-w-full"
                aria-label="Engajamento"
              />
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button 
                color="primary" 
                variant="light" 
                size="sm"
                className="w-full"
              >
                Ver Relatório Completo
              </Button>
            </div>
          </CardBody>
        </Card>
        
        {/* Recent Notifications */}
        <Card className="border-none shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-lg font-semibold text-gray-900">
                Notificações Recentes
              </h3>
              <Chip size="sm" color="primary" variant="flat">
                {notifications.filter(n => !n.is_read).length}
              </Chip>
            </div>
          </CardHeader>
          <CardBody>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentNotifications.length > 0 ? (
              <div className="space-y-4">
                {recentNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-3 rounded-lg border ${
                      !notification.is_read 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0"></div>
                      )}
                    </div>
                  </div>
                ))}
                
                <Button 
                  color="primary" 
                  variant="light" 
                  size="sm"
                  className="w-full mt-4"
                >
                  Ver Todas
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  Nenhuma notificação
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <Card className="border-none shadow-md">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Ações Rápidas
          </h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              color="primary" 
              variant="flat"
              startContent={<UsersIcon className="h-5 w-5" />}
              className="h-16 justify-start"
            >
              <div className="text-left">
                <p className="font-medium">Gerenciar Usuários</p>
                <p className="text-xs opacity-70">Adicionar, editar ou remover usuários</p>
              </div>
            </Button>
            
            <Button 
              color="success" 
              variant="flat"
              startContent={<ChartBarIcon className="h-5 w-5" />}
              className="h-16 justify-start"
            >
              <div className="text-left">
                <p className="font-medium">Ver Relatórios</p>
                <p className="text-xs opacity-70">Análises e métricas detalhadas</p>
              </div>
            </Button>
            
            <Button 
              color="warning" 
              variant="flat"
              startContent={<CogIcon className="h-5 w-5" />}
              className="h-16 justify-start"
            >
              <div className="text-left">
                <p className="font-medium">Configurações</p>
                <p className="text-xs opacity-70">Personalizar preferências</p>
              </div>
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}