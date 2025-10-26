"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface MultiSelectProps<T> {
  id: string
  options: T[]
  value: T[]
  onChange: (value: T[]) => void
}

export function MultiSelect<T>({ id, options, value, onChange }: MultiSelectProps<T>) {
  const [selectedValues, setSelectedValues] = useState(value)

  const handleSelect = (option: T) => {
    const newSelectedValues = selectedValues.includes(option)
      ? selectedValues.filter((val) => val !== option)
      : [...selectedValues, option]
    setSelectedValues(newSelectedValues)
    onChange(newSelectedValues)
  }

  return (
    <div>
      <button className="relative w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        {selectedValues.length === 0 ? (
          <span className="text-muted-foreground">Select options</span>
        ) : (
          <span className="flex flex-wrap gap-1">
            {selectedValues.map((val) => (
              <span key={val} className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
                {val.toString()}
              </span>
            ))}
          </span>
        )}
      </button>
      <div className="absolute top-full left-0 z-10 w-full rounded-md bg-background border border-input p-1 shadow-lg">
        {options.map((option) => (
          <div
            key={option.toString()}
            onClick={() => handleSelect(option)}
            className={cn(
              "relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
              selectedValues.includes(option) && "font-semibold",
            )}
          >
            <span>{option.toString()}</span>
            {selectedValues.includes(option) && <Check className="absolute right-2 h-4 w-4 text-accent" />}
          </div>
        ))}
      </div>
    </div>
  )
}
