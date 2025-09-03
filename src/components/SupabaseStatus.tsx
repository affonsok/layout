import React, { useEffect, useState } from 'react'
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react'
import { checkSupabaseHealth } from '../lib/supabase'

interface SupabaseStatusProps {
  className?: string
}

export const SupabaseStatus: React.FC<SupabaseStatusProps> = ({ className = '' }) => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkHealth = async () => {
    setIsChecking(true)
    try {
      const healthy = await checkSupabaseHealth()
      setIsHealthy(healthy)
    } catch (error) {
      setIsHealthy(false)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkHealth()
    
    // Verificar a cada 30 segundos
    const interval = setInterval(checkHealth, 30000)
    
    return () => clearInterval(interval)
  }, [])

  if (isHealthy === null || isHealthy === true) {
    return null // Não mostrar nada se estiver saudável ou ainda verificando
  }

  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {isChecking ? (
            <Wifi className="h-5 w-5 text-yellow-600 animate-pulse" />
          ) : (
            <WifiOff className="h-5 w-5 text-yellow-600" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <h3 className="text-sm font-medium text-yellow-800">
              Serviço Temporariamente Indisponível
            </h3>
          </div>
          <p className="mt-1 text-sm text-yellow-700">
            O serviço está enfrentando problemas de recursos. Isso pode acontecer quando o plano gratuito atinge seus limites.
            Tente novamente em alguns minutos.
          </p>
          <button
            onClick={checkHealth}
            disabled={isChecking}
            className="mt-2 text-sm text-yellow-800 hover:text-yellow-900 underline disabled:opacity-50"
          >
            {isChecking ? 'Verificando...' : 'Tentar novamente'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SupabaseStatus