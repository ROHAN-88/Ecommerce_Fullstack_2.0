'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'

interface FilterOptions {
  categories: string[]
  locations: string[]
}

interface SidebarFiltersProps {
  options: FilterOptions
  onFilterChange?: (filters: {
    categories: string[]
    locations: string[]
    priceRange: [number, number]
  }) => void
}

export function SidebarFilters({ options, onFilterChange }: SidebarFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])

  const handleCategoryChange = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category]
    setSelectedCategories(updated)
    onFilterChange?.({ categories: updated, locations: selectedLocations, priceRange })
  }

  const handleLocationChange = (location: string) => {
    const updated = selectedLocations.includes(location)
      ? selectedLocations.filter((l) => l !== location)
      : [...selectedLocations, location]
    setSelectedLocations(updated)
    onFilterChange?.({ categories: selectedCategories, locations: updated, priceRange })
  }

  const handlePriceChange = (value: number[]) => {
    const range: [number, number] = [value[0], value[1]]
    setPriceRange(range)
    onFilterChange?.({ categories: selectedCategories, locations: selectedLocations, priceRange: range })
  }

  const handleReset = () => {
    setSelectedCategories([])
    setSelectedLocations([])
    setPriceRange([0, 1000000])
    onFilterChange?.({ categories: [], locations: [], priceRange: [0, 1000000] })
  }

  return (
    <div className="space-y-4">
      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {options.categories.map((category) => (
            <div key={category} className="flex items-center gap-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryChange(category)}
              />
              <label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                {category}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={[priceRange[0], priceRange[1]]}
            onValueChange={handlePriceChange}
            min={0}
            max={1000000}
            step={10000}
            className="w-full"
          />
          <div className="flex gap-2 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Min</p>
              <p className="font-semibold">₹{priceRange[0].toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Max</p>
              <p className="font-semibold">₹{priceRange[1].toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Locations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Locations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {options.locations.map((location) => (
            <div key={location} className="flex items-center gap-2">
              <Checkbox
                id={`location-${location}`}
                checked={selectedLocations.includes(location)}
                onCheckedChange={() => handleLocationChange(location)}
              />
              <label htmlFor={`location-${location}`} className="text-sm cursor-pointer">
                {location}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Reset Button */}
      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={handleReset}
      >
        Reset Filters
      </Button>
    </div>
  )
}
