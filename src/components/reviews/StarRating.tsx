import { Star, StarHalf } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  max?: number
  className?: string
}

export function StarRating({ rating, max = 5, className }: StarRatingProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  return (
    <div className={cn("flex items-center space-x-0.5", className)}>
      {Array.from({ length: max }).map((_, i) => {
        if (i < fullStars) {
          return <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        }
        if (i === fullStars && hasHalfStar) {
          return <StarHalf key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        }
        return <Star key={i} className="h-4 w-4 text-gray-300" />
      })}
    </div>
  )
}
