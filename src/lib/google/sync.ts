import { createClient } from '@/lib/supabase/server'
import { getPlaceDetails } from './places'
import { resend } from '@/lib/resend'

export async function syncLocationReviews(locationId: string) {
  const supabase = await createClient()

  // 1. Get the location details
  const { data: location, error: locError } = await supabase
    .from('locations')
    .select('*, organizations(name)')
    .eq('id', locationId)
    .single()

  if (locError || !location) {
    throw new Error('Location not found')
  }

  // 2. Fetch reviews from Google Places API
  const googlePlace = await getPlaceDetails(location.google_place_id)
  
  if (!googlePlace.reviews) {
    return { synced: 0, new: 0 }
  }

  // 3. Prepare reviews for upsert
  const reviewsToUpsert = googlePlace.reviews.map((rev: any) => ({
    location_id: location.id,
    google_review_id: rev.time.toString() + rev.author_name,
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

  const newReviews = upsertedData || []

  // 5. Check for negative reviews and send alerts
  for (const review of newReviews) {
    if (review.rating <= 2) {
      await sendNegativeReviewAlert(location, review)
    }
  }

  // 6. Update last_synced_at
  await supabase
    .from('locations')
    .update({ last_synced_at: new Date().toISOString() })
    .eq('id', locationId)

  return { 
    synced: googlePlace.reviews.length, 
    new: newReviews.length 
  }
}

async function sendNegativeReviewAlert(location: any, review: any) {
  const supabase = await createClient()
  const { data: org } = await supabase
    .from('organizations')
    .select('user_id')
    .eq('id', location.org_id)
    .single()

  if (!org) return

  // In a real app, you'd fetch the user's email from auth.users via admin API or a profiles table
  // For this prototype, we'll assume we can get it or use a default
  const { data: { user } } = await supabase.auth.admin.getUserById(org.user_id)
  
  const userEmail = user?.email
  if (!userEmail) return

  const stars = '⭐'.repeat(review.rating) + '☆'.repeat(5 - review.rating)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  try {
    await resend.emails.send({
      from: 'ReputaçãoAI <alertas@reputacaoai.com.br>',
      to: userEmail,
      subject: `⚠️ Nova avaliação negativa em ${location.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Nova avaliação de ${review.rating} estrelas</h2>
          <p>Seu estabelecimento <strong>${location.name}</strong> recebeu uma nova avaliação negativa.</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>${review.author_name}</strong> avaliou com:</p>
            <div style="font-size: 20px; color: #fbbf24; margin-bottom: 10px;">${stars}</div>
            <p style="font-style: italic; color: #4b5563;">"${review.text || 'Sem comentário.'}"</p>
          </div>

          <a href="${appUrl}/dashboard?q=${encodeURIComponent(review.author_name)}" 
             style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            Responder agora com IA
          </a>
          
          <p style="font-size: 12px; color: #9ca3af; margin-top: 40px;">
            Este é um alerta automático do ReputaçãoAI.
          </p>
        </div>
      `
    })
  } catch (error) {
    console.error('Error sending email alert:', error)
  }
}
