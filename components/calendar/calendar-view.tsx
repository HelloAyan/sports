"use client"

import { useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DailySchedule } from "@/components/calendar/daily-schedule"
import { UpcomingEvents } from "@/components/calendar/upcoming-events"
import { mockEvents } from "@/lib/mock-data"

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">{format(currentDate, "MMMM yyyy")}</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            {monthDays.map((day, dayIdx) => (
              <div
                key={day.toString()}
                className={`bg-white p-2 text-center text-sm ${
                  !isSameMonth(day, monthStart)
                    ? "text-gray-400"
                    : isSameDay(day, selectedDate)
                      ? "bg-primary text-primary-foreground"
                      : ""
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
              </div>
            ))}
          </div>
        </div>
        <DailySchedule date={selectedDate} events={mockEvents} />
      </div>
      <div className="lg:col-span-1">
        <UpcomingEvents events={mockEvents} />
      </div>
    </div>
  )
}
