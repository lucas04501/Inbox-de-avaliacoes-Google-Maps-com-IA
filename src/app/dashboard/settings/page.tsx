import { createClient } from '@/lib/supabase/server'
import { OrganizationSettings } from '@/components/settings/OrganizationSettings'
import { PlanComparison } from '@/components/settings/PlanComparison'

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .single()

  return (
    <div className="flex flex-col space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie os detalhes da sua organização e seu plano.
        </p>
      </div>

      <div className="grid gap-8">
        <OrganizationSettings initialOrg={org} />
        <PlanComparison currentPlan={org?.plan || 'free'} />
      </div>
    </div>
  )
}
