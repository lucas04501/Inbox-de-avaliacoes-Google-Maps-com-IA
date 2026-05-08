import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Check, Zap, Rocket, Crown } from 'lucide-react'
import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'
import { PlanActions } from '@/components/settings/PlanActions'
import Stripe from 'stripe'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('user_id', user.id)
    .single()

  let subscription = null
  if (org?.stripe_subscription_id) {
    try {
      subscription = await stripe.subscriptions.retrieve(org.stripe_subscription_id)
    } catch (e) {
      console.error('Error fetching subscription:', e)
    }
  }

  const plans = [
    {
      name: 'Free',
      id: 'free',
      price: 'R$0',
      description: 'Ideal para começar',
      features: ['1 Local', '50 Avaliações/mês', '10 Respostas IA'],
      icon: <Zap className="h-5 w-5 text-gray-400" />
    },
    {
      name: 'Starter',
      id: 'starter',
      price: 'R$97',
      priceId: process.env.STRIPE_PRICE_STARTER,
      description: 'Para pequenos negócios',
      features: ['3 Locais', '500 Avaliações/mês', '100 Respostas IA', 'Alertas por Email'],
      icon: <Rocket className="h-5 w-5 text-blue-500" />
    },
    {
      name: 'Pro',
      id: 'pro',
      price: 'R$247',
      priceId: process.env.STRIPE_PRICE_PRO,
      description: 'Escalabilidade total',
      features: ['10 Locais', 'Avaliações ilimitadas', 'Respostas IA ilimitadas', 'Suporte Prioritário'],
      icon: <Crown className="h-5 w-5 text-yellow-500" />
    }
  ]

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Configurações</h2>
        <p className="text-gray-500">Gerencie sua conta e plano de assinatura.</p>
      </div>

      {/* Account Info */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Dados da Conta</h3>
        <Card className="max-w-2xl">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Nome Completo</Label>
                <Input value={user.user_metadata?.full_name || ''} disabled />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input value={user.email || ''} disabled />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Subscription Plans */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Plano de Assinatura</h3>
          {subscription && (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-3 py-1">
              Ativo
            </Badge>
          )}
        </div>

        {subscription ? (
          <Card className="max-w-2xl border-primary/20 bg-primary/[0.02]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                Você está no plano {org.plan.toUpperCase()}
              </CardTitle>
              <CardDescription>
                Próxima renovação em: {new Date((subscription as any).current_period_end * 1000).toLocaleDateString('pt-BR')}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <PlanActions action="portal" />
            </CardFooter>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={org?.plan === plan.id ? "border-primary ring-1 ring-primary" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    {plan.icon}
                    {org?.plan === plan.id && <Badge>Atual</Badge>}
                  </div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold text-gray-900">
                    {plan.price}
                    <span className="text-sm font-normal text-gray-500">/mês</span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="text-sm text-gray-600 flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {plan.id === 'free' ? (
                    <Button variant="outline" className="w-full" disabled>Plano Grátis</Button>
                  ) : (
                    <PlanActions priceId={plan.priceId!} action="checkout" />
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
