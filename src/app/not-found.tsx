import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h2 className="text-4xl font-bold text-gray-900">404</h2>
      <p className="text-gray-500">Desculpe, a página que você está procurando não existe ou foi movida.</p>
      <Link href="/">
        <Button size="lg" className="px-8">Voltar para a Home</Button>
      </Link>
    </div>
  )
}
