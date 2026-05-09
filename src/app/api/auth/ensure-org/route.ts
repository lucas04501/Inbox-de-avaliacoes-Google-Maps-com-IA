import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if organization exists
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (orgError) throw orgError

    if (!org) {
      // Create default organization
      const { data: newOrg, error: createError } = await supabase
        .from('organizations')
        .insert({
          user_id: user.id,
          name: user.email?.split('@')[0] || 'Sua Organização',
          plan: 'free'
        })
        .select()
        .single()

      if (createError) throw createError
      return NextResponse.json({ status: 'created', org: newOrg })
    }

    return NextResponse.json({ status: 'exists', org })
  } catch (error: any) {
    console.error('Ensure Org Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
