'use client'

import { useState } from 'react'
import { Location } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, RefreshCw, Trash2, Star, MessageCircle, AlertCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { StarRating } from '@/components/reviews/StarRating'
import { cn } from '@/lib/utils'

interface LocationCardProps {
  location: Location & {
    stats: {
      avgRating: number
      totalReviews: number
      pendingReviews: number
    }
  }
  onSync: (locationId: string) => void
  onDelete: (locationId: string) => void
}

export function LocationCard({ location, onSync, onDelete }: LocationCardProps) {
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      const response = await fetch('/api/reviews/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locationId: location.id }),
      })
      const data = await response.json()
      
      if (data.error) throw new Error(data.error)
      
      toast.success(`Sincronizado! ${data.new} novas avaliações encontradas.`)
      onSync(location.id)
    } catch (error: any) {
      toast.error('Erro na sincronização: ' + error.message)
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold text-gray-900">{location.name}</CardTitle>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">{location.address}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-yellow-700">
          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
          <span className="text-xs font-bold">{location.stats.avgRating.toFixed(1)}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avaliações</p>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-bold text-gray-900">{location.stats.totalReviews}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pendentes</p>
            <div className="flex items-center gap-2">
              <AlertCircle className={cn(
                "h-4 w-4",
                location.stats.pendingReviews > 0 ? "text-orange-500" : "text-green-500"
              )} />
              <span className="text-sm font-bold text-gray-900">{location.stats.pendingReviews}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400">Última sinc.</span>
            <span className="text-xs font-medium text-gray-600">
              {location.last_synced_at 
                ? formatDistanceToNow(new Date(location.last_synced_at), { addSuffix: true, locale: ptBR })
                : 'Nunca'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 text-gray-400 hover:text-red-600"
              onClick={() => onDelete(location.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              className="h-8 gap-2"
              onClick={handleSync}
              disabled={isSyncing}
            >
              <RefreshCw className={cn("h-4 w-4", isSyncing && "animate-spin")} />
              Sincronizar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
