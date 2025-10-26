"use client"

import { useState, memo } from "react"
import { MapPin, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const LOCATIONS = [
  { value: "auto", label: "Auto-detect", flag: "🌍" },
  { value: "uk", label: "United Kingdom", flag: "🇬🇧" },
  { value: "us", label: "United States", flag: "🇺🇸" },
  { value: "ca", label: "Canada", flag: "🇨🇦" },
  { value: "au", label: "Australia", flag: "🇦🇺" },
  { value: "de", label: "Germany", flag: "🇩🇪" },
  { value: "fr", label: "France", flag: "🇫🇷" },
  { value: "es", label: "Spain", flag: "🇪🇸" },
  { value: "it", label: "Italy", flag: "🇮🇹" },
]

export const LocationPicker = memo(function LocationPicker() {
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <MapPin className="h-4 w-4" />
          <span className="hidden sm:inline">{selectedLocation.flag}</span>
          <span className="hidden md:inline">{selectedLocation.label}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {LOCATIONS.map((location) => (
          <DropdownMenuItem
            key={location.value}
            onClick={() => setSelectedLocation(location)}
            className="flex items-center gap-2"
          >
            <span>{location.flag}</span>
            <span>{location.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
