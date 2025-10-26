"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import type { Event } from "@/lib/sports-db"

export function CalendarView({
  events,
  onDateSelect,
}: {
  events: Event[]
  onDateSelect: (date: Date) => void
}) {
  const [date, setDate] = useState<Date>(new Date())

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setDate(date)
      onDateSelect(date)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-[300px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar mode="single" selected={date} onSelect={handleSelect} className="rounded-md border" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Fixtures for {format(date, "MMMM d, yyyy")}</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-muted-foreground">No fixtures scheduled for this date.</p>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.idEvent} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-medium">{event.strEvent}</h3>
                    <p className="text-sm text-muted-foreground">{event.strLeague}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{event.strTime}</p>
                    {event.strTVStation && <p className="text-sm text-muted-foreground">{event.strTVStation}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
