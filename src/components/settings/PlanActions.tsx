'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

interface PlanActionsProps {
  priceId?: string
  action: 'checkout' | 'portal'
}

export function PlanActions({ priceId, action }: PlanActionsProps) {
  const [loading, setLoading] = useState(false)

  async function handleAction() {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, action }),
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Erro ao processar pagamento.')
      }
    } catch (error: any) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  return (
    <Button 
      className="w-full gap-2" 
      onClick={handleAction} 
      disabled={loading}
      variant={action === 'portal' ? 'outline' : 'default'}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : action === 'portal' ? (
        <>
          <ExternalLink className="h-4 w-4" />
          Gerenciar Assinatura
        </>
      ) : (
        'Assinar Plano'
      )}
    </Button>
  )
}
