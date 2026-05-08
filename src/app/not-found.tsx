import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
      <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
        <Search className="h-12 w-12 text-gray-300" />
      </div>
      <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">404 - Página não encontrada</h1>
      <p className="text-gray-500 mb-10 max-w-sm text-lg">
        Desculpe, a página que você está procurando não existe ou foi movida.
      </p>
      <Button asChild size="lg" className="px-8">
        <Link href="/">Voltar para a Home</Link>
      </Button>
    </div>
  )
}
