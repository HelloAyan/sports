"use client"

import type React from "react"

import { memo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Filter } from "lucide-react"
import type { FilterState } from "@/lib/types"

interface FiltersSidebarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onClearFilters: () => void
  isLoading?: boolean
}

const SPORTS = [
  { value: "all", label: "All Sports" },
  { value: "football", label: "Football" },
  { value: "basketball", label: "Basketball" },
  { value: "tennis", label: "Tennis" },
  { value: "cricket", label: "Cricket" },
]

const COMPETITIONS = [
  { value: "all", label: "All Competitions" },
  { value: "premier-league", label: "Premier League" },
  { value: "nba", label: "NBA" },
  { value: "wimbledon", label: "Wimbledon" },
  { value: "ipl", label: "IPL" },
]

const STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "not-started", label: "Not Started" },
  { value: "live", label: "Live" },
  { value: "finished", label: "Finished" },
]

export const FiltersSidebar = memo(function FiltersSidebar({
  filters,
  onFiltersChange,
  onClearFilters,
  isLoading = false,
}: FiltersSidebarProps) {
  const updateFilter = useCallback(
    (key: keyof FilterState, value: string) => {
      onFiltersChange({
        ...filters,
        [key]: value === "all" ? undefined : value,
      })
    },
    [filters, onFiltersChange],
  )

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateFilter("search", e.target.value)
    },
    [updateFilter],
  )

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {activeFiltersCount > 0 && <Badge variant="secondary">{activeFiltersCount}</Badge>}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearFilters} disabled={isLoading}>
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Search</label>
          <Input
            placeholder="Search fixtures..."
            value={filters.search || ""}
            onChange={handleSearchChange}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Sport</label>
          <Select
            value={filters.sport || "all"}
            onValueChange={(value) => updateFilter("sport", value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SPORTS.map((sport) => (
                <SelectItem key={sport.value} value={sport.value}>
                  {sport.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Competition</label>
          <Select
            value={filters.competition || "all"}
            onValueChange={(value) => updateFilter("competition", value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COMPETITIONS.map((competition) => (
                <SelectItem key={competition.value} value={competition.value}>
                  {competition.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Status</label>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) => updateFilter("status", value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
})
