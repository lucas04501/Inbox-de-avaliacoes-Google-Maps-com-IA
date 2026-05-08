import { createClient } from '@/lib/supabase/server'
import { ReviewCard } from '@/components/reviews/ReviewCard'
import { ReviewFilters } from '@/components/reviews/ReviewFilters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Inbox, 
  Star, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  SearchX
} from 'lucide-react'
import { Review, Location } from '@/types'

interface DashboardPageProps {
  searchParams: Promise<{
    q?: string
    status?: string
    location?: string
    stars?: string
    page?: string
  }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const supabase = await createClient()
  const params = await searchParams
  
  const q = params.q || ''
  const status = params.status || 'all'
  const locationId = params.location || 'all'
  const stars = params.stars?.split(',').map(Number) || []
  const page = Number(params.page) || 1
  const pageSize = 20

  // 1. Fetch Locations for filters
  const { data: locations } = await supabase.from('locations').select('*')

  // 2. Fetch Metrics
  const { data: metricsData } = await supabase
    .from('reviews')
    .select('rating, status, replied_at, published_at')

  const totalPending = metricsData?.filter(r => r.status === 'pending').length || 0
  const avgRating = metricsData && metricsData.length > 0
    ? (metricsData.reduce((acc, curr) => acc + curr.rating, 0) / metricsData.length).toFixed(1)
    : '0.0'
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const repliedToday = metricsData?.filter(r => 
    r.status === 'replied' && r.replied_at && new Date(r.replied_at) >= today
  ).length || 0

  const respondedReviews = metricsData?.filter(r => r.status === 'replied' && r.replied_at) || []
  const avgResponseTime = respondedReviews.length > 0
    ? (respondedReviews.reduce((acc, curr) => {
        const diff = new Date(curr.replied_at!).getTime() - new Date(curr.published_at).getTime()
        return acc + diff
      }, 0) / respondedReviews.length / (1000 * 60 * 60)).toFixed(1)
    : '0'

  // 3. Fetch Reviews with Filters
  let query = supabase
    .from('reviews')
    .select('*, locations(name)', { count: 'exact' })

  if (q) {
    query = query.or(`author_name.ilike.%${q}%,text.ilike.%${q}%`)
  }
  if (status !== 'all') {
    query = query.eq('status', status)
  }
  if (locationId !== 'all') {
    query = query.eq('location_id', locationId)
  }
  if (stars.length > 0) {
    query = query.in('rating', stars)
  }

  // We fetch all filtered reviews to sort them correctly in memory 
  // (PostgREST doesn't support the complex conditional sorting required easily)
  // For a real production app with millions of reviews, this would need a DB view or complex order.
  // Given the prototype scope, memory sorting is fine for up to few thousand reviews.
  const { data: allFilteredReviews } = await query

  const sortedReviews = (allFilteredReviews as any[] || []).sort((a, b) => {
    const priority = (r: any) => {
      if (r.status === 'pending' && r.rating <= 2) return 0
      if (r.status === 'pending') return 1
      return 2
    }
    
    const pA = priority(a)
    const pB = priority(b)
    
    if (pA !== pB) return pA - pB
    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  })

  const totalCount = sortedReviews.length
  const paginatedReviews = sortedReviews.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Pendentes" 
          value={totalPending.toString()} 
          icon={<Inbox className="h-4 w-4 text-orange-500" />}
          description="Aguardando resposta"
        />
        <MetricCard 
          title="Nota Média" 
          value={avgRating} 
          icon={<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
          description="Geral de todos os locais"
        />
        <MetricCard 
          title="Respondidas Hoje" 
          value={repliedToday.toString()} 
          icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
          description="Engajamento diário"
        />
        <MetricCard 
          title="Tempo Médio" 
          value={`${avgResponseTime}h`} 
          icon={<Clock className="h-4 w-4 text-blue-500" />}
          description="Desde a publicação"
        />
      </div>

      {/* Filters */}
      <ReviewFilters locations={locations || []} />

      {/* Reviews List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Resultados 
            <span className="text-sm font-normal text-gray-500">({totalCount} avaliações)</span>
          </h3>
        </div>

        {paginatedReviews.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {paginatedReviews.map((review) => (
              <ReviewCard 
                key={review.id} 
                review={review}
                locationName={review.locations?.name}
                onReply={() => {}} // TODO: Connect to Modal
                onIgnore={() => {}} // TODO: Implement Action
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
            <PaginationControls currentPage={page} totalPages={Math.ceil(totalCount / pageSize)} />
          </div>
        )}
      </div>
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
