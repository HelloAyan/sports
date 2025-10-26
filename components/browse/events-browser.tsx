"use client"

import { useState } from "react"
import { Search, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { getEventsBySearch, getEventsByDate } from "@/lib/api/sports-db"
import type { Event } from "@/lib/api/sports-db"

export function EventsBrowser() {
  const [events, setEvents] = useState<Event[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery) return

    setIsLoading(true)
    try {
      const data = await getEventsBySearch(searchQuery)
      setEvents(data)
    } catch (error) {
      console.error("Failed to search events:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDateSelect = async (date: Date | undefined) => {
    if (!date) return

    setSelectedDate(date)
    setIsLoading(true)
    try {
      const formattedDate = format(date, "yyyy-MM-dd")
      const data = await getEventsByDate(formattedDate)
      setEvents(data)
    } catch (error) {
      console.error("Failed to load events by date:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch} disabled={!searchQuery || isLoading}>
          Search
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <Calendar className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent mode="single" selected={selectedDate} onSelect={handleDateSelect} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <Card key={n} className="animate-pulse">
              <CardHeader className="h-40 bg-gray-200" />
              <CardContent className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <Link key={event.idEvent} href={`/events/${event.idEvent}`}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="relative h-40">
                  {event.strThumb ? (
                    <Image
                      src={event.strThumb || "/placeholder.svg"}
                      alt={event.strEvent}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                      <span className="text-xl font-bold text-gray-400">No Image</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-xl mb-2">{event.strEvent}</CardTitle>
                  <div className="flex flex-col text-sm text-gray-500">
                    <div className="flex justify-between">
                      <span>{event.dateEvent}</span>
                      <span>{event.strTime}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>{event.strLeague}</span>
                      <span>{event.strVenue}</span>
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
