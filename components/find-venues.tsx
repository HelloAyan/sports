"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Loader } from "lucide-react"
import type { Fixture, Venue } from "@/lib/types"

interface FindVenuesProps {
  isOpen: boolean
  onClose: () => void
  fixture: Fixture | null
}

export function FindVenues({ isOpen, onClose, fixture }: FindVenuesProps) {
  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [venues, setVenues] = useState<Venue[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      getUserLocation()
    }
  }, [isOpen])

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation(`${latitude},${longitude}`)
          fetchNearbyVenues(`${latitude},${longitude}`)
        },
        (error) => {
          console.error("Error getting user location:", error)
          setError("Unable to get your location. Please enter it manually.")
        },
      )
    } else {
      setError("Geolocation is not supported by your browser. Please enter your location manually.")
    }
  }

  const fetchNearbyVenues = async (location: string) => {
    if (!fixture) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/venues/nearby?location=${location}&fixtureId=${fixture.id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch nearby venues")
      }
      const data = await response.json()
      setVenues(data.venues)
    } catch (error) {
      console.error("Error fetching nearby venues:", error)
      setError("Failed to fetch nearby venues. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    if (location) {
      fetchNearbyVenues(location)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Find Venues Showing This Fixture</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Enter location (e.g., city or postcode)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="mt-4">
            {isLoading ? (
              <div className="text-center">
                <Loader className="h-8 w-8 animate-spin mx-auto" />
                <p className="mt-2">Searching for venues...</p>
              </div>
            ) : venues.length > 0 ? (
              <ul className="space-y-2">
                {venues.map((venue) => (
                  <li key={venue.id} className="border rounded p-2">
                    <h3 className="font-semibold">{venue.name}</h3>
                    <p className="text-sm text-gray-600">{venue.address}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">No venues found. Try a different location.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
