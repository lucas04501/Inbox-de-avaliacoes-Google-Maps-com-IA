'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Location } from '@/types'
import { useDebounce } from '@/hooks/use-debounce'

interface ReviewFiltersProps {
  locations: Location[]
}

export function ReviewFilters({ locations }: ReviewFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const debouncedSearch = useDebounce(search, 500)
  
  const currentStatus = searchParams.get('status') || 'all'
  const currentLevel = searchParams.get('location') || 'all'
  const currentStars = searchParams.get('stars')?.split(',').filter(Boolean) || []

  useEffect(() => {
    updateUrl({ q: debouncedSearch })
  }, [debouncedSearch])

  function updateUrl(params: Record<string, string | null>) {
    const newParams = new URLSearchParams(searchParams.toString())
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === 'all' || value === '') {
        newParams.delete(key)
      } else {
        newParams.set(key, value)
      }
    })

    router.push(`/dashboard?${newParams.toString()}`)
  }

  const handleStarChange = (star: string, checked: boolean) => {
    let newStars = [...currentStars]
    if (checked) {
      newStars.push(star)
    } else {
      newStars = newStars.filter(s => s !== star)
    }
    updateUrl({ stars: newStars.length > 0 ? newStars.join(',') : null })
  }

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Buscar autor ou conteúdo..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Location Filter */}
        <Select 
          value={currentLevel} 
          onValueChange={(v) => updateUrl({ location: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os locais" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os locais</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select 
          value={currentStatus} 
          onValueChange={(v) => updateUrl({ status: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Qualquer status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Qualquer status</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="replied">Respondido</SelectItem>
            <SelectItem value="ignored">Ignorado</SelectItem>
          </SelectContent>
        </Select>

        {/* Action buttons or more filters toggle can go here */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={() => router.push('/dashboard')}
          >
            <X className="h-4 w-4" />
            Limpar Filtros
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-gray-50">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Estrelas:</span>
        <div className="flex items-center gap-4">
          {['5', '4', '3', '2', '1'].map((star) => (
            <div key={star} className="flex items-center space-x-2">
              <Checkbox 
                id={`star-${star}`} 
                checked={currentStars.includes(star)}
                onCheckedChange={(checked) => handleStarChange(star, !!checked)}
              />
              <Label htmlFor={`star-${star}`} className="text-sm font-medium cursor-pointer">
                {star} ★
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
