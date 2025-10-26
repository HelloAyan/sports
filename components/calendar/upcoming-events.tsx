import { format, isFuture, parseISO } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Event } from "@/lib/types"

interface UpcomingEventsProps {
  events: Event[]
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  const upcomingEvents = events
    .filter((event) => isFuture(parseISO(event.dateEvent)))
    .sort((a, b) => parseISO(a.dateEvent).getTime() - parseISO(b.dateEvent).getTime())
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {upcomingEvents.map((event) => (
            <li key={event.idEvent} className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{event.strEvent}</h3>
                <span className="text-sm text-muted-foreground">{format(parseISO(event.dateEvent), "MMM d")}</span>
              </div>
              <p className="text-sm text-muted-foreground">{event.strLeague}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
