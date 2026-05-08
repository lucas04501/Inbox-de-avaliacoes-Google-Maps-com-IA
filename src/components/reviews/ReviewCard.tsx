'use client'

import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Review } from '@/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StarRating } from './StarRating'
import { Sparkles, Trash2, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReviewCardProps {
  review: Review
  locationName?: string
  onReply: (review: Review) => void
  onIgnore: (reviewId: string) => void
}

export function ReviewCard({ review, locationName, onReply, onIgnore }: ReviewCardProps) {
  const statusConfig = {
    pending: { label: 'Pendente', className: 'bg-orange-100 text-orange-700 hover:bg-orange-100' },
    replied: { label: 'Respondida', className: 'bg-green-100 text-green-700 hover:bg-green-100' },
    ignored: { label: 'Ignorada', className: 'bg-gray-100 text-gray-700 hover:bg-gray-100' },
  }

  const initials = review.author_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || '?'

  const isUrgent = review.rating <= 2

  return (
    <Card className={cn(
      "overflow-hidden transition-all border-l-4",
      isUrgent ? "border-l-red-500" : "border-l-transparent",
      review.status === 'ignored' && "opacity-60"
    )}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={review.author_photo_url} alt={review.author_name || 'Usuário'} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-gray-900">{review.author_name}</p>
              <Badge className={cn("text-[10px] px-1.5 py-0", statusConfig[review.status].className)}>
                {statusConfig[review.status].label}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(review.published_at), { addSuffix: true, locale: ptBR })}
              {locationName && ` em ${locationName}`}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <StarRating rating={review.rating} />
        
        <p className="text-sm text-gray-700 leading-relaxed">
          {review.text || <span className="italic text-gray-400">Avaliação sem comentário.</span>}
        </p>

        {review.status === 'replied' && review.reply_text && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <MessageCircle className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-bold text-gray-500 uppercase">Sua Resposta</span>
            </div>
            <p className="text-sm text-gray-600 italic">"{review.reply_text}"</p>
          </div>
        )}

        {review.status === 'pending' && (
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-red-600 h-8"
              onClick={() => onIgnore(review.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Ignorar
            </Button>
            <Button 
              size="sm" 
              className="h-8 gap-2 bg-primary hover:bg-primary/90"
              onClick={() => onReply(review)}
            >
              <Sparkles className="h-4 w-4" />
              Responder com IA
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
