import { format, isSameDay } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Event } from "@/lib/types"

interface DailyScheduleProps {
  date: Date
  events: Event[]
}

export function DailySchedule({ date, events }: DailyScheduleProps) {
  const dayEvents = events.filter((event) => isSameDay(new Date(event.dateEvent), date))

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Schedule for {format(date, "MMMM d, yyyy")}</CardTitle>
      </CardHeader>
      <CardContent>
        {dayEvents.length === 0 ? (
          <p className="text-muted-foreground">No events scheduled for this day.</p>
        ) : (
          <ul className="space-y-4">
            {dayEvents.map((event) => (
              <li key={event.idEvent} className="flex items-center justify-between border-b pb-2">
                <div>
                  <h3 className="font-medium">{event.strEvent}</h3>
                  <p className="text-sm text-muted-foreground">{event.strLeague}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{event.strTime}</p>
                  {event.strVenue && <p className="text-sm text-muted-foreground">{event.strVenue}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
