"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin } from "lucide-react"
import type { Event } from "@/lib/sports-db"
import Link from "next/link"

export function SportEventsToday() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSportEventsToday = async () => {
      try {
        const response = await fetch("/api/events/today")
        if (!response.ok) {
          throw new Error("Failed to fetch today's events")
        }
        const data = await response.json()
        setEvents(data.events || [])
      } catch (err) {
        setError("Failed to fetch today's sport events")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSportEventsToday()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-2">Error: {error}</p>
        <p className="text-gray-500">Please try again later</p>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No events scheduled for today</p>
        <p className="text-sm text-gray-400">Check back later for updates</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event) => (
        <Link href={`/events/${event.idEvent}`} key={event.idEvent}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="bg-sports-primary text-white">
                  {event.strSport}
                </Badge>
              </div>
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-sports-text">{event.strEvent}</h3>
                <p className="text-sm text-sports-secondary">{event.strLeague}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-sports-text">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-sports-accent" />
                  <span>{event.strTime}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1 text-sports-accent" />
                  <span>{event.strVenue || "Venue TBA"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
