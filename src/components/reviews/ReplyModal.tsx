'use client'

import { useState, useEffect } from 'react'
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
import { Sparkles, Loader2, Copy, ExternalLink, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { StarRating } from './StarRating'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface ReplyModalProps {
  review: Review | null
  locationName: string
  googlePlaceId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ReplyModal({ review, locationName, googlePlaceId, isOpen, onClose, onSuccess }: ReplyModalProps) {
  const [reply, setReply] = useState('')
  const [tone, setTone] = useState('empático')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Character limit
  const MAX_CHARS = 4096

  useEffect(() => {
    if (isOpen && review) {
      setReply(review.ai_suggestion || '')
    } else {
      setReply('')
    }
  }, [isOpen, review])

  const handleGenerateAI = async () => {
    if (!review) return
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId: review.id,
          reviewText: review.text,
          rating: review.rating,
          authorName: review.author_name,
          businessName: locationName,
          tone,
        }),
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error)
      
      if (data.suggestion) {
        setReply(data.suggestion)
        toast.success('Sugestão gerada com sucesso!')
      }
    } catch (error: any) {
      console.error('Error generating suggestion:', error)
      toast.error('Não foi possível gerar a sugestão: ' + error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyAndMarkReplied = async () => {
    if (!review || !reply) return
    
    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(reply)
      toast.success('Copiado! Cole no Google.')
    } catch (err) {
      toast.error('Erro ao copiar para o clipboard.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/reviews/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId: review.id,
          replyText: reply,
        }),
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      onSuccess()
      // We don't close immediately so they can click the link to Google
    } catch (error: any) {
      console.error('Error marking as replied:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl">Responder Avaliação</DialogTitle>
          <DialogDescription>
            Copie a sugestão da IA e publique manualmente no Google Maps.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Review Original Preview */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avaliação Original</span>
              <StarRating rating={review?.rating || 0} />
            </div>
            <p className="text-sm text-gray-600 italic leading-relaxed">
              "{review?.text || 'Sem comentário.'}"
            </p>
          </div>

          {/* AI Settings */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Label htmlFor="tone" className="text-xs font-bold text-gray-500 uppercase">Tom:</Label>
              <Select value={tone} onValueChange={(value) => value && setTone(value)}>
                <SelectTrigger className="h-9 w-full sm:w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="profissional">Profissional</SelectItem>
                  <SelectItem value="amigável">Amigável</SelectItem>
                  <SelectItem value="empático">Empático</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto gap-2 border-primary/20 text-primary hover:bg-primary/5 hover:text-primary"
              onClick={handleGenerateAI}
              disabled={isGenerating}
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Gerar sugestão com IA
            </Button>
          </div>

          {/* Reply Textarea */}
          <div className="space-y-2 relative">
            <Label htmlFor="reply" className="text-xs font-bold text-gray-500 uppercase">Sua Resposta</Label>
            {isGenerating ? (
              <div className="space-y-2 py-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[95%]" />
                <Skeleton className="h-4 w-[60%]" />
              </div>
            ) : (
              <>
                <Textarea
                  id="reply"
                  placeholder="Escreva sua resposta ou use a sugestão da IA..."
                  className="min-h-[180px] text-sm leading-relaxed resize-none"
                  value={reply}
                  onChange={(e) => setReply(e.target.value.slice(0, MAX_CHARS))}
                  disabled={isSubmitting}
                />
                <div className={cn(
                  "absolute bottom-2 right-2 text-[10px] font-medium px-1.5 py-0.5 rounded",
                  reply.length >= MAX_CHARS ? "bg-red-50 text-red-500" : "text-gray-400"
                )}>
                  {reply.length}/{MAX_CHARS}
                </div>
              </>
            )}
          </div>

          <div className="flex justify-center">
            <a
              href={`https://search.google.com/local/reviews?placeid=${googlePlaceId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-600 h-auto p-0"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir avaliações no Google Maps
            </a>
          </div>
        </div>

        <DialogFooter className="bg-gray-50 p-6 flex flex-row sm:justify-end gap-3 border-t">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            disabled={isSubmitting}
            className="flex-1 sm:flex-none"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleCopyAndMarkReplied} 
            disabled={isSubmitting || !reply || isGenerating}
            className="flex-1 sm:flex-none gap-2 bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            Copiar e marcar como respondida
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
