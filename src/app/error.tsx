'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
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
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h2 className="text-2xl font-bold text-gray-900">Algo deu errado</h2>
      <p className="text-gray-500">Ocorreu um erro inesperado. Tente novamente.</p>
      <div className="flex gap-3">
        <Button onClick={reset}>Tentar novamente</Button>
        <Button variant="outline">
          <Link href="/dashboard">Voltar para o Início</Link>
        </Button>
      </div>
    </div>
  )
}
