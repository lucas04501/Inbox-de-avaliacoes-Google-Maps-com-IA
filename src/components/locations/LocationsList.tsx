'use client'

import { useState } from 'react'
import { Location } from '@/types'
import { LocationCard } from './LocationCard'
import { AddLocationModal } from './AddLocationModal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface LocationsListProps {
  initialLocations: Location[]
  orgId: string
}

export function LocationsList({ initialLocations, orgId }: LocationsListProps) {
  const [locations, setLocations] = useState<Location[]>(initialLocations)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const supabase = createClient()

  const refreshLocations = async () => {
    const { data } = await supabase
      .from('locations')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
    
    if (data) setLocations(data)
  }

  const handleSync = async (location: Location) => {
    toast.info(`Sincronizando ${location.name}...`)
    // TODO: Call API to sync reviews
    try {
      const response = await fetch('/api/reviews/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locationId: location.id }),
      })
      
      if (response.ok) {
        toast.success('Sincronização concluída.')
        refreshLocations()
      } else {
        throw new Error('Falha na sincronização')
      }
    } catch (error) {
      toast.error('Erro ao sincronizar avaliações.')
    }
  }

  const handleDelete = async (locationId: string) => {
    if (!confirm('Tem certeza que deseja remover este local? Todas as avaliações vinculadas serão perdidas.')) return

    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', locationId)

      if (error) throw error

      toast.success('Local removido.')
      setLocations(locations.filter(l => l.id !== locationId))
    } catch (error) {
      toast.error('Erro ao remover local.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Local
        </Button>
      </div>

      {locations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
          <p className="text-lg font-medium text-gray-500">Nenhum local cadastrado.</p>
          <p className="text-sm text-gray-400 mb-4">Adicione seu primeiro estabelecimento para começar.</p>
          <Button onClick={() => setIsModalOpen(true)}>Adicionar meu primeiro local</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {locations.map(location => (
            <LocationCard 
              key={location.id} 
              location={location} 
              onSync={handleSync}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <AddLocationModal 
        orgId={orgId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refreshLocations}
      />
    </div>
  )
}
