import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { syncLocationReviews } from '@/lib/google/sync'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { locationId } = await req.json()

    if (!locationId) {
      return NextResponse.json({ error: 'Missing locationId' }, { status: 400 })
    }

    const result = await syncLocationReviews(locationId)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Sync API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
