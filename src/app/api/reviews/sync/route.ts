import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    // Mocking sync for now
    // In a real app, this would call Google Places/My Business API
    const mockReviews = [
      {
        location_id: locationId,
        google_review_id: `mock_${Date.now()}_1`,
        author_name: 'João Silva',
        rating: 5,
        text: 'Excelente atendimento e comida maravilhosa! Recomendo muito.',
        published_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        status: 'pending',
      },
      {
        location_id: locationId,
        google_review_id: `mock_${Date.now()}_2`,
        author_name: 'Maria Oliveira',
        rating: 2,
        text: 'A comida estava fria e demorou muito para chegar. Fiquei decepcionada.',
        published_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        status: 'pending',
      },
      {
        location_id: locationId,
        google_review_id: `mock_${Date.now()}_3`,
        author_name: 'Carlos Santos',
        rating: 4,
        text: 'Lugar muito agradável, mas o preço é um pouco alto.',
        published_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        status: 'pending',
      }
    ]

    const { error } = await supabase
      .from('reviews')
      .upsert(mockReviews, { onConflict: 'google_review_id' })

    if (error) throw error

    // Update last_synced_at
    await supabase
      .from('locations')
      .update({ last_synced_at: new Date().toISOString() })
      .eq('id', locationId)

    return NextResponse.json({ success: true, count: mockReviews.length })
  } catch (error: any) {
    console.error('Sync Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
