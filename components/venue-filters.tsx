"use client"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface VenueFiltersProps {
  selectedFilters: string[]
  onFilterChange: (filters: string[]) => void
}

const FILTERS = {
  sports: ["Football", "Rugby", "Cricket", "F1", "Boxing", "NFL", "NBA"],
  features: ["HD TVs", "Big Screen", "Beer Garden", "Food", "Pool Table"],
  channels: ["Sky Sports", "BT Sport", "ESPN", "Amazon Prime"],
  price: ["£", "££", "£££"],
}

export function VenueFilters({ selectedFilters, onFilterChange }: VenueFiltersProps) {
  const handleFilterClick = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      onFilterChange(selectedFilters.filter((f) => f !== filter))
    } else {
      onFilterChange([...selectedFilters, filter])
    }
  }

  return (
    <div className="space-y-6">
      {/* Sports */}
      <div>
        <h3 className="font-semibold mb-3">Sports Shown</h3>
        <div className="space-y-2">
          {FILTERS.sports.map((sport) => (
            <div key={sport} className="flex items-center">
              <Checkbox
                id={`sport-${sport}`}
                checked={selectedFilters.includes(sport)}
                onCheckedChange={() => handleFilterClick(sport)}
              />
              <Label htmlFor={`sport-${sport}`} className="ml-2">
                {sport}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <h3 className="font-semibold mb-3">Features</h3>
        <div className="space-y-2">
          {FILTERS.features.map((feature) => (
            <div key={feature} className="flex items-center">
              <Checkbox
                id={`feature-${feature}`}
                checked={selectedFilters.includes(feature)}
                onCheckedChange={() => handleFilterClick(feature)}
              />
              <Label htmlFor={`feature-${feature}`} className="ml-2">
                {feature}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* TV Channels */}
      <div>
        <h3 className="font-semibold mb-3">TV Channels</h3>
        <div className="space-y-2">
          {FILTERS.channels.map((channel) => (
            <div key={channel} className="flex items-center">
              <Checkbox
                id={`channel-${channel}`}
                checked={selectedFilters.includes(channel)}
                onCheckedChange={() => handleFilterClick(channel)}
              />
              <Label htmlFor={`channel-${channel}`} className="ml-2">
                {channel}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="flex gap-2">
          {FILTERS.price.map((price) => (
            <Badge
              key={price}
              variant={selectedFilters.includes(price) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleFilterClick(price)}
            >
              {price}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
