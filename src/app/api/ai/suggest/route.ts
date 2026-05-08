import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { model } from '@/lib/gemini'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { reviewId, reviewText, rating, authorName, businessName, tone } = await req.json()

    if (!reviewId || !reviewText || !businessName) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const prompt = `Você é um especialista em atendimento ao cliente para ${businessName}.
Escreva uma resposta ${tone} para esta avaliação de ${rating} estrelas de ${authorName}.
Avaliação: ${reviewText}
A resposta deve: agradecer, abordar o ponto principal, ser específica (não genérica), máx 3 parágrafos curtos, em português BR.`

    const result = await model.generateContent(prompt)
    const suggestion = result.response.text().trim()

    // Save suggestion to the review
    await supabase
      .from('reviews')
      .update({ ai_suggestion: suggestion })
      .eq('id', reviewId)

    return NextResponse.json({ suggestion })
  } catch (error: any) {
    console.error('Gemini Suggest Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
