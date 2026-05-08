import { NextResponse } from 'next/server'
import { generateReplySuggestion } from '@/lib/gemini'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { reviewText, rating, businessName, tone } = await req.json()

    if (!reviewText || !businessName) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const suggestion = await generateReplySuggestion(reviewText, rating, businessName, tone)

    return NextResponse.json({ suggestion })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
