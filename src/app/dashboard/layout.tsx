import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch organization details
  const { data: organization } = await supabase
    .from('organizations')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Fallback name if organization not found (shouldn't happen with our registration flow)
  const orgName = organization?.name || 'Sua Organização'
  const plan = organization?.plan || 'free'
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário'

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - fixed on desktop */}
      <Sidebar plan={plan} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <TopBar 
          userName={userName} 
          orgName={orgName} 
          plan={plan} 
        />
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
