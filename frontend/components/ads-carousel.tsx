'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface Ad {
  id: string
  image: string
  title: string
}

interface AdsCarouselProps {
  ads: Ad[]
}

export function AdsCarousel({ ads }: AdsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoScroll, setAutoScroll] = useState(true)

  useEffect(() => {
    if (!autoScroll) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [autoScroll, ads.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length)
    setAutoScroll(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length)
    setAutoScroll(false)
  }

  if (ads.length === 0) return null

  return (
    <div className="relative w-full bg-muted rounded-lg overflow-hidden">
      <div className="relative aspect-video">
        <Image
          src={ads[currentIndex].image || "/placeholder.svg"}
          alt={ads[currentIndex].title}
          fill
          className="object-cover"
          priority
        />
        {/* Sponsored Badge */}
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
          Sponsored
        </div>
      </div>

      {/* Navigation */}
      {ads.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
            onClick={goToPrevious}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
            onClick={goToNext}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  setAutoScroll(false)
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-primary w-6' : 'bg-background/60'
                }`}
                aria-label={`Go to ad ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
