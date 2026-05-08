'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Search, MapPin, Star, Loader2, Check } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'

interface AddLocationModalProps {
  orgId: string
  plan: string
  currentLocationCount: number
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddLocationModal({ orgId, plan, currentLocationCount, isOpen, onClose, onSuccess }: AddLocationModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [selectedPlace, setSelectedPlace] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const debouncedQuery = useDebounce(query, 500)
  const supabase = createClient()

  const PLAN_LIMITS: Record<string, number> = {
    free: 1,
    starter: 3,
    pro: 10
  }

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      searchGooglePlaces()
    } else {
      setResults([])
    }
  }, [debouncedQuery])

  async function searchGooglePlaces() {
    setIsSearching(true)
    try {
      const response = await fetch(`/api/google/places?q=${encodeURIComponent(debouncedQuery)}`)
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  async function handleSelectPlace(placeId: string) {
    setIsLoadingDetails(true)
    setResults([])
    setQuery('')
    try {
      const response = await fetch(`/api/google/places?placeId=${placeId}`)
      const data = await response.json()
      setSelectedPlace({ ...data, place_id: placeId })
    } catch (error) {
      toast.error('Erro ao carregar detalhes do local.')
    } finally {
      setIsLoadingDetails(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedPlace) return

    // Check plan limit
    if (currentLocationCount >= PLAN_LIMITS[plan]) {
      toast.error(`Seu plano ${plan} permite apenas ${PLAN_LIMITS[plan]} local. Faça upgrade para adicionar mais.`)
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('locations')
        .insert({
          org_id: orgId,
          name: selectedPlace.name,
          google_place_id: selectedPlace.place_id,
          address: selectedPlace.formatted_address,
        })

      if (error) {
        if (error.code === '23505') throw new Error('Este local já está cadastrado.')
        throw error
      }

      toast.success('Local adicionado com sucesso!')
      onSuccess()
      onClose()
      setSelectedPlace(null)
    } catch (error: any) {
      toast.error(error.message || 'Erro ao adicionar local.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Local</DialogTitle>
          <DialogDescription>
            Busque o seu estabelecimento para começar a monitorar as avaliações.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!selectedPlace ? (
            <div className="space-y-2 relative">
              <Label htmlFor="search">Buscar no Google Maps</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  id="search"
                  placeholder="Nome do restaurante, clínica, etc..." 
                  className="pl-10"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />}
              </div>

              {results.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {results.map((r) => (
                    <button
                      key={r.place_id}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex flex-col gap-0.5 border-b last:border-0"
                      onClick={() => handleSelectPlace(r.place_id)}
                    >
                      <span className="text-sm font-bold text-gray-900">{r.structured_formatting.main_text}</span>
                      <span className="text-xs text-gray-500 truncate">{r.structured_formatting.secondary_text}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 border border-primary/20 space-y-4 relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => setSelectedPlace(null)}
              >
                <XCircle className="h-4 w-4 text-gray-400" />
              </Button>
              
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{selectedPlace.name}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{selectedPlace.formatted_address}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2 border-t">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold text-gray-900">{selectedPlace.rating}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {selectedPlace.user_ratings_total} avaliações no Google
                </div>
              </div>
            </div>
          )}

          {isLoadingDetails && (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs text-gray-500">Carregando detalhes do local...</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedPlace || isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Confirmar e Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

import { XCircle } from 'lucide-react'
