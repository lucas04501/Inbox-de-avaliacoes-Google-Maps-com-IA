import { createClient } from '@/lib/supabase/server'
import { ReviewInbox } from '@/components/reviews/ReviewInbox'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .single()

  const { data: locations } = await supabase
    .from('locations')
    .select('*')
    .eq('org_id', org?.id)

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Avaliações</h2>
      </div>
      <ReviewInbox locations={locations || []} />
    </div>
  )
}
