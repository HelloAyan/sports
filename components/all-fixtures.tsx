"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin } from "lucide-react"
import Link from "next/link"
import type { Event } from "@/lib/sports-db"

export function AllFixtures() {
  const [fixtures, setFixtures] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const today = new Date().toISOString().split("T")[0]
        const response = await fetch(`/api/fixtures?date=${today}`)
        if (!response.ok) throw new Error("Failed to fetch fixtures")
        const data = await response.json()
        setFixtures(data.events || [])
      } catch (err) {
        setError("Failed to fetch fixtures")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFixtures()
  }, [])

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1)
    // In a real app, you would fetch more fixtures here
  }

  if (isLoading && page === 1) return <div className="text-center py-4">Loading fixtures...</div>
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>
  if (fixtures.length === 0) return <div className="text-center py-4">No upcoming fixtures available.</div>

  // Display only a subset of fixtures based on the current page
  const itemsPerPage = 15
  const displayedFixtures = fixtures.slice(0, page * itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedFixtures.map((fixture) => (
          <Link href={`/events/${fixture.idEvent}`} key={fixture.idEvent}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{fixture.strEvent}</CardTitle>
                <Badge>{fixture.strSport}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{fixture.strLeague}</p>
                <p className="text-sm">{fixture.strVenue}</p>
                <div className="flex justify-between text-sm mt-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{fixture.strTime}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{fixture.dateEvent}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {fixtures.length > displayedFixtures.length && (
        <div className="text-center">
          <Button onClick={loadMore} disabled={isLoading}>
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  )
}
