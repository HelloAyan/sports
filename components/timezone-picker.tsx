"use client"

import { useState, memo } from "react"
import { Clock, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const TIMEZONES = [
  { value: "auto", label: "Auto-detect", offset: "Auto" },
  { value: "UTC", label: "UTC", offset: "+00:00" },
  { value: "GMT", label: "GMT", offset: "+00:00" },
  { value: "EST", label: "EST", offset: "-05:00" },
  { value: "PST", label: "PST", offset: "-08:00" },
  { value: "CET", label: "CET", offset: "+01:00" },
  { value: "JST", label: "JST", offset: "+09:00" },
  { value: "AEST", label: "AEST", offset: "+10:00" },
]

export const TimezonePicker = memo(function TimezonePicker() {
  const [selectedTimezone, setSelectedTimezone] = useState(TIMEZONES[0])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Clock className="h-4 w-4" />
          <span className="hidden sm:inline">{selectedTimezone.label}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {TIMEZONES.map((timezone) => (
          <DropdownMenuItem
            key={timezone.value}
            onClick={() => setSelectedTimezone(timezone)}
            className="flex items-center justify-between"
          >
            <span>{timezone.label}</span>
            <span className="text-sm text-muted-foreground">{timezone.offset}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
