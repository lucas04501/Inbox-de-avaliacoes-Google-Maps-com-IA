import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { searchPlaces, getPlaceDetails } from '@/lib/google/places'

export async function GET(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')
    const placeId = searchParams.get('placeId')

    if (placeId) {
      const details = await getPlaceDetails(placeId)
      return NextResponse.json(details)
    }

    if (!q) {
      return NextResponse.json([])
    }

    const results = await searchPlaces(q)
    return NextResponse.json(results)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
