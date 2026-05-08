'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="h-10 w-10 text-red-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Ops! Algo deu errado.</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Ocorreu um erro inesperado. Já fomos notificados e estamos trabalhando para resolver.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Tentar novamente
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard">Voltar para o Início</Link>
        </Button>
      </div>
    </div>
  )
}
