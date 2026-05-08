'use client'

import { useState } from 'react'
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

interface AddLocationModalProps {
  orgId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddLocationModal({ orgId, isOpen, onClose, onSuccess }: AddLocationModalProps) {
  const [name, setName] = useState('')
  const [placeId, setPlaceId] = useState('')
  const [address, setAddress] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !placeId) return
    
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('locations')
        .insert({
          org_id: orgId,
          name,
          google_place_id: placeId,
          address,
        })

      if (error) {
        if (error.code === '23505') {
          throw new Error('Este local já está cadastrado.')
        }
        throw error
      }

      toast.success('Local adicionado com sucesso.')
      onSuccess()
      onClose()
      setName('')
      setPlaceId('')
      setAddress('')
    } catch (error: any) {
      console.error('Error adding location:', error)
      toast.error(error.message || 'Erro ao adicionar local.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Local</DialogTitle>
          <DialogDescription>
            Insira os dados do seu estabelecimento no Google Maps.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Estabelecimento</Label>
              <Input
                id="name"
                placeholder="Ex: Restaurante do Juca"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="placeId">Google Place ID</Label>
              <Input
                id="placeId"
                placeholder="ChIJ..."
                value={placeId}
                onChange={(e) => setPlaceId(e.target.value)}
                required
              />
              <p className="text-[10px] text-muted-foreground">
                Dica: Você pode encontrar o Place ID usando a ferramenta do Google Places.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Endereço (opcional)</Label>
              <Input
                id="address"
                placeholder="Rua das Flores, 123"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adicionando...' : 'Salvar Local'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
