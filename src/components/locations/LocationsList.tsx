'use client'

import { useState } from 'react'
import { Location } from '@/types'
import { LocationCard } from './LocationCard'
import { AddLocationModal } from './AddLocationModal'
import { Button } from '@/components/ui/button'
import { Plus, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface LocationsListProps {
  initialLocations: any[]
  orgId: string
  plan: string
}

export function LocationsList({ initialLocations, orgId, plan }: LocationsListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async (locationId: string) => {
    if (!confirm('Tem certeza que deseja remover este local? Todas as avaliações vinculadas serão perdidas.')) return

    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', locationId)

      if (error) throw error

      toast.success('Local removido com sucesso.')
      router.refresh()
    } catch (error: any) {
      toast.error('Erro ao remover local: ' + error.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-bold text-gray-900">
            {initialLocations.length} {initialLocations.length === 1 ? 'Local' : 'Locais'} cadastrados
          </h3>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Local
        </Button>
      </div>

      {initialLocations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialLocations.map((loc) => (
            <LocationCard 
              key={loc.id} 
              location={loc}
              onSync={() => router.refresh()}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed text-center px-4">
          <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <MapPin className="h-6 w-6 text-gray-300" />
          </div>
          <h4 className="text-gray-900 font-bold mb-1">Nenhum local cadastrado</h4>
          <p className="text-gray-500 text-sm mb-6 max-w-xs">
            Adicione o seu estabelecimento para começar a centralizar suas avaliações do Google Maps.
          </p>
          <Button onClick={() => setIsModalOpen(true)}>Cadastrar meu primeiro local</Button>
        </div>
      )}

      <AddLocationModal 
        orgId={orgId}
        plan={plan}
        currentLocationCount={initialLocations.length}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => router.refresh()}
      />
    </div>
  )
}
