'use client'

import { Plan } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Check, ArrowRight } from 'lucide-react'

export function PlanComparison({ currentPlan }: { currentPlan: Plan }) {
  const plans = [
    {
      name: 'Free',
      id: 'free',
      price: 'R$0',
      locations: '1',
      reviews: '50',
      ai: '10',
    },
    {
      name: 'Starter',
      id: 'starter',
      price: 'R$97/mês',
      locations: '3',
      reviews: '500',
      ai: '100',
    },
    {
      name: 'Pro',
      id: 'pro',
      price: 'R$247/mês',
      locations: '10',
      reviews: 'Ilimitado',
      ai: 'Ilimitado',
    },
  ]

  const handleUpgrade = (planId: string) => {
    toast.info(`Checkout do plano ${planId} em breve...`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seu Plano</CardTitle>
        <CardDescription>
          Você está atualmente no plano <span className="font-bold text-primary uppercase">{currentPlan}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plano</TableHead>
              <TableHead>Locais</TableHead>
              <TableHead>Avaliações/mês</TableHead>
              <TableHead>Respostas IA</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id} className={currentPlan === plan.id ? "bg-primary/5" : ""}>
                <TableCell className="font-medium">
                  {plan.name}
                  {currentPlan === plan.id && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                      Atual
                    </span>
                  )}
                </TableCell>
                <TableCell>{plan.locations}</TableCell>
                <TableCell>{plan.reviews}</TableCell>
                <TableCell>{plan.ai}</TableCell>
                <TableCell>{plan.price}</TableCell>
                <TableCell className="text-right">
                  {currentPlan === plan.id ? (
                    <Button variant="ghost" size="sm" disabled>
                      <Check className="h-4 w-4 mr-1" /> Selecionado
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => handleUpgrade(plan.id)}>
                      {plan.id === 'free' ? 'Downgrade' : 'Upgrade'}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

import { toast } from 'sonner'
