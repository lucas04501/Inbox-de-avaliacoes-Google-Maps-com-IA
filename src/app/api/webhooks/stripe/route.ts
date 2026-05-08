import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature') as string

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        const orgId = session.metadata.orgId
        const subscriptionId = session.subscription as string
        
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const priceId = subscription.items.data[0].price.id

        // Determine plan based on priceId
        let plan = 'free'
        if (priceId === process.env.STRIPE_PRICE_STARTER) plan = 'starter'
        if (priceId === process.env.STRIPE_PRICE_PRO) plan = 'pro'

        await supabase
          .from('organizations')
          .update({ 
            plan, 
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: session.customer as string
          })
          .eq('id', orgId)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any
        const priceId = subscription.items.data[0].price.id
        
        let plan = 'free'
        if (priceId === process.env.STRIPE_PRICE_STARTER) plan = 'starter'
        if (priceId === process.env.STRIPE_PRICE_PRO) plan = 'pro'

        await supabase
          .from('organizations')
          .update({ plan })
          .eq('stripe_subscription_id', subscription.id)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any
        await supabase
          .from('organizations')
          .update({ plan: 'free', stripe_subscription_id: null })
          .eq('stripe_subscription_id', subscription.id)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook Error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
