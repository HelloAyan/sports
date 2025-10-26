"use client"

import { useState } from "react"
import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { VenueCard } from "@/components/venue-card"
import { VenueMap } from "@/components/venue-map"
import { VenueFilters } from "@/components/venue-filters"
import type { Venue } from "@/lib/types"

const TRENDING_TAGS = ["Premier League", "Champions League", "NFL", "NBA", "Live Sports", "Sky Sports", "BT Sport"]

const MOCK_VENUES: Venue[] = [
  {
    id: "1",
    name: "The Sports Bar & Grill",
    address: "123 Main Street",
    city: "London",
    country: "United Kingdom",
    coordinates: { lat: 51.5074, lng: -0.1278 },
    rating: 4.5,
    reviewCount: 128,
    images: ["/placeholder.svg"],
    sports: ["Football", "Rugby", "Cricket"],
    amenities: ["HD TVs", "WiFi", "Food", "Beer Garden"],
    openingHours: {
      monday: "12:00-23:00",
      tuesday: "12:00-23:00",
      wednesday: "12:00-23:00",
      thursday: "12:00-23:00",
      friday: "12:00-00:00",
      saturday: "11:00-00:00",
      sunday: "12:00-22:30",
    },
    channels: ["Sky Sports", "BT Sport", "ESPN"],
    description: "Your premier sports viewing destination in central London",
    priceRange: "££",
  },
  // Add more mock venues...
]

export default function BarsAndPubsPage() {
  const [view, setView] = useState<"list" | "map">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-sports-dark text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Sports Bars and Pubs</h1>
          <p className="text-lg mb-8">Find the perfect venue to watch your favorite sports</p>

          {/* Search Bar */}
          <div className="flex gap-4 max-w-4xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for bars and pubs..."
                className="w-full pl-10 h-12 text-gray-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative w-72">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input type="text" placeholder="Location" className="w-full pl-10 h-12 text-gray-900" />
            </div>
            <Button className="h-12 px-6 bg-sports-primary hover:bg-sports-primary/90">Search</Button>
          </div>

          {/* Trending Tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {TRENDING_TAGS.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-white/10 hover:bg-white/20 cursor-pointer">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <VenueFilters selectedFilters={selectedFilters} onFilterChange={setSelectedFilters} />
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* View Toggle and Stats */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-lg">
                <span className="font-semibold">123</span> venues found
              </div>
              <div className="flex gap-2">
                <Button variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")}>
                  List View
                </Button>
                <Button variant={view === "map" ? "default" : "outline"} onClick={() => setView("map")}>
                  Map View
                </Button>
              </div>
            </div>

            {view === "list" ? (
              <div className="grid gap-6">
                {MOCK_VENUES.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} />
                ))}
              </div>
            ) : (
              <VenueMap venues={MOCK_VENUES} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
