"use client"

import { ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format, addDays, isSameDay } from "date-fns"

interface DateNavigationProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export function DateNavigation({ selectedDate, onDateChange }: DateNavigationProps) {
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i))

  return (
    <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
      <Button variant="ghost" onClick={() => onDateChange(addDays(selectedDate, -1))}>
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex space-x-2">
        {dates.map((date) => (
          <Button
            key={date.toISOString()}
            variant={isSameDay(date, selectedDate) ? "default" : "ghost"}
            onClick={() => onDateChange(date)}
            className="min-w-[100px]"
          >
            <div className="text-center">
              <div className="text-xs uppercase">{format(date, "EEE")}</div>
              <div className="font-bold">{format(date, "d MMM")}</div>
            </div>
          </Button>
        ))}
        <Button variant="ghost">
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>

      <Button variant="ghost" onClick={() => onDateChange(addDays(selectedDate, 1))}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
