'use client'

import { Location } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, RefreshCw, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface LocationCardProps {
  location: Location
  onSync: (location: Location) => void
  onDelete: (locationId: string) => void
}

export function LocationCard({ location, onSync, onDelete }: LocationCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{location.name}</CardTitle>
        <MapPin className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground mb-4">
          {location.address || 'Sem endereço cadastrado'}
        </div>
        <div className="flex flex-col space-y-2">
          <p className="text-xs text-gray-500">
            Última sincronização:{' '}
            {location.last_synced_at 
              ? formatDistanceToNow(new Date(location.last_synced_at), { addSuffix: true, locale: ptBR })
              : 'Nunca'}
          </p>
          <div className="flex items-center gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onSync(location)}>
              <RefreshCw className="mr-2 h-3 w-3" />
              Sincronizar
            </Button>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => onDelete(location.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
