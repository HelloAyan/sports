"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar } from "lucide-react"
import Link from "next/link"
import type { Event } from "@/lib/sports-db"

export function LeagueFixtures({ leagueId }: { leagueId: string }) {
  const [fixtures, setFixtures] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/leagues/${leagueId}/fixtures`)
        if (!response.ok) {
          throw new Error("Failed to fetch fixtures")
        }
        const data = await response.json()
        setFixtures(data.events || [])
        setError(null)
      } catch (err) {
        console.error("Failed to load fixtures:", err)
        setError("Failed to load fixtures")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFixtures()
  }, [leagueId])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Fixtures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex justify-between items-center border-b pb-2 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Fixtures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (fixtures.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Fixtures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">No upcoming fixtures found for this league.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Fixtures</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {fixtures.slice(0, 5).map((fixture) => (
            <li key={fixture.idEvent} className="flex justify-between items-center border-b pb-2">
              <Link href={`/events/${fixture.idEvent}`} className="hover:underline">
                <div>
                  <span className="font-medium">{fixture.strEvent}</span>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{new Date(fixture.dateEvent).toLocaleDateString()}</span>
                    <Clock className="h-3 w-3 ml-2 mr-1" />
                    <span>{fixture.strTime?.substring(0, 5)}</span>
                  </div>
                </div>
              </Link>
              <Badge variant="outline" className="text-xs">
                {fixture.strStatus || "Upcoming"}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
