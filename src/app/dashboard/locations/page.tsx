import { createClient } from '@/lib/supabase/server'
import { LocationsList } from '@/components/locations/LocationsList'

export default async function LocationsPage() {
  const supabase = await createClient()

  // 1. Fetch organization details
  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .single()

  // 2. Fetch locations with stats
  // We'll fetch locations and reviews separately and join in memory for the prototype
  const { data: locations } = await supabase
    .from('locations')
    .select('*')
    .eq('org_id', org?.id)
    .order('created_at', { ascending: false })

  const { data: reviews } = await supabase
    .from('reviews')
    .select('location_id, rating, status')

  const locationsWithStats = locations?.map(loc => {
    const locReviews = reviews?.filter(r => r.location_id === loc.id) || []
    return {
      ...loc,
      stats: {
        avgRating: locReviews.length > 0 
          ? locReviews.reduce((acc, curr) => acc + curr.rating, 0) / locReviews.length 
          : 0,
        totalReviews: locReviews.length,
        pendingReviews: locReviews.filter(r => r.status === 'pending').length
      }
    }
  })

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Locais</h2>
        <p className="text-gray-500">
          Gerencie os estabelecimentos que o sistema está monitorando.
        </p>
      </div>

      <LocationsList 
        initialLocations={locationsWithStats || []} 
        orgId={org?.id} 
        plan={org?.plan || 'free'} 
      />
    </div>
  )
}
