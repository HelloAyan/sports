"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import Image from "next/image"

export default function SportPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const apiId = searchParams.get("apiId")
  const [sportData, setSportData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSportData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/sports/${params.id}?apiId=${apiId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch sport data: ${response.status}`)
        }

        const data = await response.json()
        setSportData(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching sport data:", err)
        setError("Unable to load sport data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    if (apiId) {
      fetchSportData()
    } else {
      setError("API ID is required")
      setIsLoading(false)
    }
  }, [params.id, apiId])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-1/3 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-500 mb-2">{error}</p>
          <p className="text-sm text-gray-500">We're working to resolve this issue. Please check back later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">{params.id.replace(/-/g, " ")}</h1>

      {/* Leagues Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Popular Leagues</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sportData?.leagues?.slice(0, 6).map((league: any) => (
            <Link key={league.idLeague} href={`/leagues/${league.idLeague}`}>
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{league.strLeague}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge>{league.strCountry || "International"}</Badge>
                    {league.strBadge && (
                      <div className="w-12 h-12 relative">
                        <Image
                          src={league.strBadge || "/placeholder.svg"}
                          alt={league.strLeague}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
        {sportData?.events?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sportData.events.slice(0, 6).map((event: any) => (
              <Link key={event.idEvent} href={`/events/${event.idEvent}`}>
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{event.strEvent}</CardTitle>
                    <p className="text-sm text-gray-500">{event.strLeague}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm">{event.dateEvent}</p>
                        <p className="text-sm">{event.strTime}</p>
                      </div>
                      {event.strVenue && <Badge variant="outline">{event.strVenue}</Badge>}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No upcoming events found for this sport.</p>
        )}
      </div>
    </div>
  )
}
