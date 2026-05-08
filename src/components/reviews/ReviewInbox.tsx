'use client'

import { useState } from 'react'
import { Review, Location } from '@/types'
import { ReviewCard } from './ReviewCard'
import { ReviewFilters } from './ReviewFilters'
import { ReplyModal } from './ReplyModal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Inbox, 
  Star, 
  CheckCircle2, 
  Clock, 
  SearchX
} from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface ReviewInboxProps {
  initialReviews: Review[]
  locations: Location[]
  metrics: {
    totalPending: number
    avgRating: string
    repliedToday: number
    avgResponseTime: string
  }
  totalCount: number
  pageSize: number
  currentPage: number
}

export function ReviewInbox({ 
  initialReviews, 
  locations, 
  metrics, 
  totalCount, 
  pageSize, 
  currentPage 
}: ReviewInboxProps) {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleReply = (review: Review) => {
    setSelectedReview(review)
    setIsModalOpen(true)
  }

  const handleIgnore = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status: 'ignored' })
        .eq('id', reviewId)

      if (error) throw error
      
      toast.success('Avaliação ignorada.')
      router.refresh()
    } catch (error: any) {
      toast.error('Erro ao ignorar avaliação: ' + error.message)
    }
  }

  const getLocationById = (locationId: string) => {
    return locations.find(l => l.id === locationId)
  }

  const selectedLocation = selectedReview ? getLocationById(selectedReview.location_id) : null

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Pendentes" 
          value={metrics.totalPending.toString()} 
          icon={<Inbox className="h-4 w-4 text-orange-500" />}
          description="Aguardando resposta"
        />
        <MetricCard 
          title="Nota Média" 
          value={metrics.avgRating} 
          icon={<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
          description="Geral de todos os locais"
        />
        <MetricCard 
          title="Respondidas Hoje" 
          value={metrics.repliedToday.toString()} 
          icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
          description="Engajamento diário"
        />
        <MetricCard 
          title="Tempo Médio" 
          value={`${metrics.avgResponseTime}h`} 
          icon={<Clock className="h-4 w-4 text-blue-500" />}
          description="Desde a publicação"
        />
      </div>

      {/* Filters */}
      <ReviewFilters locations={locations} />

      {/* Reviews List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Resultados 
            <span className="text-sm font-normal text-gray-500">({totalCount} avaliações)</span>
          </h3>
        </div>

        {initialReviews.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {initialReviews.map((review) => (
              <ReviewCard 
                key={review.id} 
                review={review}
                locationName={getLocationName(review.location_id)}
                onReply={handleReply}
                onIgnore={handleIgnore}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed">
            <SearchX className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">Nenhuma avaliação encontrada com estes filtros.</p>
          </div>
        )}

        {/* Simple Pagination */}
        {totalCount > pageSize && (
          <div className="flex justify-center gap-2 mt-8">
            <PaginationControls currentPage={currentPage} totalPages={Math.ceil(totalCount / pageSize)} />
          </div>
        )}
      </div>

      <ReplyModal 
        review={selectedReview}
        locationName={selectedLocation?.name || ''}
        googlePlaceId={selectedLocation?.google_place_id || ''}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => router.refresh()}
      />
    </div>
  )
}

function MetricCard({ title, value, icon, description }: { title: string, value: string, icon: React.ReactNode, description: string }) {
  return (
    <Card className="bg-white border-gray-100 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <p className="text-[10px] text-gray-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}

function PaginationControls({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalPages }).map((_, i) => {
        const page = i + 1
        return (
          <a
            key={page}
            href={`?page=${page}`}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              currentPage === page 
                ? "bg-primary text-white" 
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {page}
          </a>
        )
      })}
    </div>
  )
}
