import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { syncLocationReviews } from '@/lib/google/sync'

export async function GET(req: Request) {
  // 1. Verify Authorization
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const supabase = await createClient()

    // 2. Find locations not synced in the last 6 hours
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    
    const { data: locations, error: locError } = await supabase
      .from('locations')
      .select('id')
      .or(`last_synced_at.lt.${sixHoursAgo},last_synced_at.is.null`)

    if (locError) throw locError

    if (!locations || locations.length === 0) {
      return NextResponse.json({ processed: 0, newReviews: 0, message: 'All locations are up to date.' })
    }

    // 3. Process each location
    let processedCount = 0
    let totalNewReviews = 0

    for (const loc of locations) {
      try {
        const result = await syncLocationReviews(loc.id)
        processedCount++
        totalNewReviews += result.new
      } catch (err) {
        console.error(`Error syncing location ${loc.id}:`, err)
      }
    }

    return NextResponse.json({ 
      processed: processedCount, 
      newReviews: totalNewReviews 
    })

  } catch (error: any) {
    console.error('Cron Sync Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
