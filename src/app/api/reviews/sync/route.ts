import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPlaceDetails } from '@/lib/google/places'
import { Review } from '@/types'

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

    // 1. Get the location details from DB
    const { data: location, error: locError } = await supabase
      .from('locations')
      .select('*')
      .eq('id', locationId)
      .single()

    if (locError || !location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }

    // 2. Fetch reviews from Google Places API
    const googlePlace = await getPlaceDetails(location.google_place_id)
    
    if (!googlePlace.reviews) {
      return NextResponse.json({ synced: 0, new: 0 })
    }

    // 3. Prepare reviews for upsert
    // Note: Google Places API returns only the 5 most helpful reviews.
    // For a real app, you'd use Google My Business API to get ALL reviews.
    const reviewsToUpsert = googlePlace.reviews.map((rev: any) => ({
      location_id: location.id,
      google_review_id: rev.time.toString() + rev.author_name, // Fallback ID if missing
      author_name: rev.author_name,
      author_photo_url: rev.profile_photo_url,
      rating: rev.rating,
      text: rev.text,
      published_at: new Date(rev.time * 1000).toISOString(),
      status: 'pending'
    }))

    // 4. Upsert reviews
    const { data: upsertedData, error: upsertError } = await supabase
      .from('reviews')
      .upsert(reviewsToUpsert, { onConflict: 'google_review_id', ignoreDuplicates: true })
      .select()

    if (upsertError) throw upsertError

    // 5. Update last_synced_at
    await supabase
      .from('locations')
      .update({ last_synced_at: new Date().toISOString() })
      .eq('id', locationId)

    return NextResponse.json({ 
      synced: googlePlace.reviews.length, 
      new: upsertedData?.length || 0 
    })
  } catch (error: any) {
    console.error('Sync Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
