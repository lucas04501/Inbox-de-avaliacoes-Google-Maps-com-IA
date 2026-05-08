import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { reviewId, replyText } = await req.json()

    if (!reviewId || !replyText) {
      return NextResponse.json({ error: 'Missing reviewId or replyText' }, { status: 400 })
    }

    // Just mark as replied in the database for the manual flow
    const { error } = await supabase
      .from('reviews')
      .update({
        reply_text: replyText,
        replied_at: new Date().toISOString(),
        status: 'replied'
      })
      .eq('id', reviewId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Reply API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
