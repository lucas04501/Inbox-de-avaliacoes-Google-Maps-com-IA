'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Review, Location } from '@/types'
import { ReviewCard } from './ReviewCard'
import { ReplyModal } from './ReplyModal'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'

interface ReviewInboxProps {
  locations: Location[]
}

export function ReviewInbox({ locations }: ReviewInboxProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'pending' | 'replied' | 'all'>('pending')
  const [ratingFilter, setRatingFilter] = useState<string>('all')
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)
  const supabase = createClient()

  const fetchReviews = async () => {
    setLoading(true)
    
    let query = supabase
      .from('reviews')
      .select('*')
      .order('published_at', { ascending: false })

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }

    if (ratingFilter !== 'all') {
      query = query.eq('rating', parseInt(ratingFilter))
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching reviews:', error)
    } else {
      setReviews(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchReviews()
  }, [statusFilter, ratingFilter, supabase])

  const getLocationName = (locationId: string) => {
    return locations.find(l => l.id === locationId)?.name || 'Local desconhecido'
  }

  const handleReply = (review: Review) => {
    setSelectedReview(review)
    setIsReplyModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs defaultValue="pending" className="w-full sm:w-auto" onValueChange={(v) => setStatusFilter(v as any)}>
          <TabsList>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="replied">Respondidas</TabsTrigger>
            <TabsTrigger value="all">Todas</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">Filtrar por nota:</span>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="5">5 estrelas</SelectItem>
              <SelectItem value="4">4 estrelas</SelectItem>
              <SelectItem value="3">3 estrelas</SelectItem>
              <SelectItem value="2">2 estrelas</SelectItem>
              <SelectItem value="1">1 estrela</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium text-gray-500">Nenhuma avaliação encontrada.</p>
          <p className="text-sm text-gray-400">Tente mudar os filtros ou sincronizar novos dados.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reviews.map(review => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              locationName={getLocationName(review.location_id)}
              onReply={handleReply}
            />
          ))}
        </div>
      )}

      <ReplyModal 
        review={selectedReview}
        locationName={selectedReview ? getLocationName(selectedReview.location_id) : ''}
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        onSuccess={fetchReviews}
      />
    </div>
  )
}
