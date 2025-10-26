"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Tv, Clock, MapPin } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import type { Event } from "@/lib/sports-db"

export default function TVGuidePage() {
  const [date, setDate] = useState<Date>(new Date())
  const [sport, setSport] = useState<string>("all")
  const [country, setCountry] = useState<string>("all")
  const [tvGuide, setTvGuide] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTVGuide()
  }, [date, sport, country])

  const fetchTVGuide = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const formattedDate = format(date, "yyyy-MM-dd")
      let url = `/api/tv-guide?date=${formattedDate}`

      if (sport !== "all") {
        url += `&sport=${encodeURIComponent(sport)}`
      }

      if (country !== "all") {
        url += `&country=${encodeURIComponent(country)}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Failed to fetch TV guide")
      }

      const data = await response.json()
      setTvGuide(data.tvGuide || [])
    } catch (error) {
      console.error("Error fetching TV guide:", error)
      setError("Failed to load TV guide. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">TV Guide</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Sport</label>
          <Select value={sport} onValueChange={setSport}>
            <SelectTrigger>
              <SelectValue placeholder="All Sports" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              <SelectItem value="Soccer">Soccer</SelectItem>
              <SelectItem value="Basketball">Basketball</SelectItem>
              <SelectItem value="American Football">American Football</SelectItem>
              <SelectItem value="Baseball">Baseball</SelectItem>
              <SelectItem value="Ice Hockey">Ice Hockey</SelectItem>
              <SelectItem value="Rugby">Rugby</SelectItem>
              <SelectItem value="Tennis">Tennis</SelectItem>
              <SelectItem value="Golf">Golf</SelectItem>
              <SelectItem value="Motorsport">Motorsport</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Country</label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger>
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              <SelectItem value="UK">United Kingdom</SelectItem>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="Australia">Australia</SelectItem>
              <SelectItem value="Germany">Germany</SelectItem>
              <SelectItem value="France">France</SelectItem>
              <SelectItem value="Spain">Spain</SelectItem>
              <SelectItem value="Italy">Italy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* TV Guide Content */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading TV guide...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <p>{error}</p>
        </div>
      ) : tvGuide.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No TV listings found for the selected filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tvGuide.map((event) => (
            <Link key={event.idEvent} href={`/events/${event.idEvent}`}>
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <div>{event.strEvent}</div>
                    <Badge>{event.strSport}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{event.strTime}</span>
                    </div>

                    {event.strVenue && (
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{event.strVenue}</span>
                      </div>
                    )}

                    <div className="flex items-start text-sm">
                      <Tv className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                      <div>
                        <div className="font-medium mb-1">TV Channels:</div>
                        <div className="flex flex-wrap gap-1">
                          {event.strTVStation.split(",").map((channel, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {channel.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
