import { createClient } from '@/lib/supabase/server'
import { LocationsList } from '@/components/locations/LocationsList'

export default async function LocationsPage() {
  const supabase = await createClient()

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .single()

  const { data: locations } = await supabase
    .from('locations')
    .select('*')
    .eq('org_id', org?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Seus Locais</h2>
      </div>
      <LocationsList initialLocations={locations || []} orgId={org?.id} />
    </div>
  )
}
