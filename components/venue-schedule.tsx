"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"

interface VenueScheduleProps {
  venueId: string
}

// Mock schedule data
const MOCK_SCHEDULE = [
  {
    id: "1",
    event: "Liverpool vs Real Madrid",
    competition: "UEFA Champions League",
    date: "2024-02-21",
    time: "20:00",
    sport: "Football",
    channel: "BT Sport 1",
  },
  {
    id: "2",
    event: "Arsenal vs Manchester United",
    competition: "Premier League",
    date: "2024-02-21",
    time: "17:30",
    sport: "Football",
    channel: "Sky Sports Main Event",
  },
  // Add more events...
]

export function VenueSchedule({ venueId }: VenueScheduleProps) {
  const [date, setDate] = useState<Date>(new Date())

  const formattedDate = format(date, "yyyy-MM-dd")
  const events = MOCK_SCHEDULE.filter((event) => event.date === formattedDate)

  return (
    <div className="grid grid-cols-[300px_1fr] gap-6">
      <div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => date && setDate(date)}
          className="rounded-md border"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Events on {format(date, "EEEE, MMMM d, yyyy")}</h3>

        {events.length > 0 ? (
          events.map((event) => (
            <Card key={event.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{event.event}</h4>
                  <p className="text-sm text-gray-600">{event.competition}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{event.time}</p>
                  <p className="text-sm text-gray-600">{event.channel}</p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No events scheduled for this date.</p>
        )}
      </div>
    </div>
  )
}
