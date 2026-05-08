import { createClient } from '@/lib/supabase/server'
import { ReviewInbox } from '@/components/reviews/ReviewInbox'
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

  // 2. Fetch Metrics (for the current user/org)
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
    .select('*')

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

  const { data: filteredReviews } = await query

  // Sorting logic
  const sortedReviews = (filteredReviews as Review[] || []).sort((a, b) => {
    const priority = (r: Review) => {
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
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Avaliações</h2>
      </div>
      
      <ReviewInbox 
        initialReviews={paginatedReviews}
        locations={locations || []}
        metrics={{
          totalPending,
          avgRating,
          repliedToday,
          avgResponseTime
        }}
        totalCount={totalCount}
        pageSize={pageSize}
        currentPage={page}
      />
    </div>
  )
}
