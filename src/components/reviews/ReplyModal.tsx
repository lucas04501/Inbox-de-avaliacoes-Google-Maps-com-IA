'use client'

import { useState } from 'react'
import { Review } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sparkles, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface ReplyModalProps {
  review: Review | null
  locationName: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ReplyModal({ review, locationName, isOpen, onClose, onSuccess }: ReplyModalProps) {
  const [reply, setReply] = useState('')
  const [tone, setTone] = useState<'formal' | 'casual' | 'empathetic'>('empathetic')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const handleGenerateAI = async () => {
    if (!review) return
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewText: review.text,
          rating: review.rating,
          businessName: locationName,
          tone,
        }),
      })

      const data = await response.json()
      if (data.suggestion) {
        setReply(data.suggestion.trim())
      }
    } catch (error) {
      console.error('Error generating suggestion:', error)
      toast.error('Não foi possível gerar a sugestão.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = async () => {
    if (!review || !reply) return
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          reply_text: reply,
          replied_at: new Date().toISOString(),
          status: 'replied',
        })
        .eq('id', review.id)

      if (error) throw error

      toast.success('Resposta enviada com sucesso.')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error submitting reply:', error)
      toast.error('Não foi possível enviar a resposta.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Responder Avaliação</DialogTitle>
          <DialogDescription>
            De {review?.author_name} para {locationName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-gray-50 p-3 border">
            <p className="text-sm text-gray-700 italic">"{review?.text || 'Sem comentário'}"</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="tone" className="text-xs">Tom:</Label>
              <Select value={tone} onValueChange={(v: any) => setTone(v)}>
                <SelectTrigger className="h-8 w-[120px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empathetic">Empático</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleGenerateAI} 
              disabled={isGenerating || !review?.text}
              className="h-8 text-xs"
            >
              {isGenerating ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Sparkles className="mr-2 h-3 w-3" />}
              Sugerir com IA
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reply">Sua Resposta</Label>
            <Textarea
              id="reply"
              placeholder="Digite sua resposta aqui..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !reply}>
            {isSubmitting ? 'Enviando...' : 'Enviar Resposta'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
