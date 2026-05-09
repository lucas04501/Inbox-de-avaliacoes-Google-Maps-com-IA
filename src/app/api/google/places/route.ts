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

    // 1. Get Details
    if (placeId) {
      const details = await getPlaceDetails(placeId)
      return NextResponse.json({
        name: details.name,
        formatted_address: details.formatted_address,
        rating: details.rating,
        user_ratings_total: details.user_ratings_total,
        // We include original results just in case, but prioritize what was requested
        ...details 
      })
    }

    // 2. Search Autocomplete
    if (q) {
      const predictions = await searchPlaces(q)
      const results = predictions.map((p: any) => ({
        place_id: p.place_id,
        structured_formatting: p.structured_formatting
      }))
      return NextResponse.json(results)
    }

    return NextResponse.json([])
  } catch (error: any) {
    console.error('Google Places API Route Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
