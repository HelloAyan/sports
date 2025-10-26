"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin } from "lucide-react"
import Image from "next/image"

type Event = {
  id: number
  sport: string
  league: string
  homeTeam: string
  awayTeam: string
  startTime: Date
  venue: string
}

const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    sport: "Football",
    league: "Premier League",
    homeTeam: "Manchester United",
    awayTeam: "Liverpool",
    startTime: new Date(Date.now() + 1000 * 60 * 30), // 30 minutes from now
    venue: "Old Trafford",
  },
  // ... add more mock events here
]

export function UpcomingEvents() {
  const [showAll, setShowAll] = useState(false)

  const currentTime = new Date()
  const filteredEvents = MOCK_EVENTS.filter(
    (event) => event.startTime > new Date(currentTime.getTime() - 5 * 60 * 1000),
  ).sort((a, b) => a.startTime.getTime() - b.startTime.getTime())

  const displayedEvents = showAll ? filteredEvents.slice(0, 20) : filteredEvents.slice(0, 8)

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary">{event.sport}</Badge>
                  <span className="text-sm text-gray-500">{event.league}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Image
                      src="/placeholder.svg"
                      alt={event.homeTeam}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span className="ml-2 font-semibold">{event.homeTeam}</span>
                  </div>
                  <span className="text-lg font-bold">VS</span>
                  <div className="flex items-center">
                    <span className="mr-2 font-semibold">{event.awayTeam}</span>
                    <Image
                      src="/placeholder.svg"
                      alt={event.awayTeam}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{event.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{event.venue}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredEvents.length > 8 && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="hover:bg-primary hover:text-primary-foreground"
            >
              {showAll ? "Show Less" : "Show More"}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
