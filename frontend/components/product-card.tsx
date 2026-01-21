'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

interface ProductCardProps {
  id: string
  image: string
  name: string
  price: number
  location?: string
  sellerName?: string
  isSaved?: boolean
  onViewDetails?: () => void
  onToggleSave?: () => void
}

export function ProductCard({
  id,
  image,
  name,
  price,
  location,
  sellerName,
  isSaved,
  onViewDetails,
  onToggleSave,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
        {onToggleSave && (
          <button
            onClick={(e) => {
              e.preventDefault()
              onToggleSave()
            }}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-muted transition-colors"
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground truncate mb-1">{name}</h3>

        {sellerName && <p className="text-xs text-muted-foreground mb-2">by {sellerName}</p>}

        <div className="mb-3">
          <p className="text-lg font-bold text-primary mb-1">₹{price.toLocaleString()}</p>
          {location && <p className="text-xs text-muted-foreground flex items-center gap-1">📍 {location}</p>}
        </div>

        <Button
          onClick={onViewDetails}
          className="w-full"
          variant="default"
          size="sm"
          asChild={!onViewDetails}
        >
          {onViewDetails ? 'View Details' : <Link href={`/product/${id}`}>View Details</Link>}
        </Button>
      </CardContent>
    </Card>
  )
}
