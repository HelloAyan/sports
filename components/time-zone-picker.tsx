"use client"

import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface TimeZonePickerProps {
  value: "local" | "your"
  onChange: (value: string) => void
}

export function TimeZonePicker({ value, onChange }: TimeZonePickerProps) {
  return (
    <div className="flex items-center space-x-4">
      <RadioGroup value={value} onValueChange={onChange} className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="local" id="local" />
          <Label htmlFor="local">Local Time</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="your" id="your" />
          <Label htmlFor="your">Your Time</Label>
        </div>
      </RadioGroup>
      <Button variant="ghost" size="sm">
        Change
      </Button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Choose between event local time or your local time zone</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
