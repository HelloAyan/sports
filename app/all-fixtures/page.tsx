"use client"

import { useState, useEffect, useCallback } from "react"
import { FiltersSidebar } from "@/components/filters-sidebar"
import { FixtureList } from "@/components/fixture-list"
import { FixtureDetailModal } from "@/components/fixture-detail-modal"
import { DateNavigation } from "@/components/date-navigation"
import { fetchFixtures } from "@/lib/api"
import type { Fixture, FilterState, TimePreference } from "@/lib/types"
import { debounce } from "@/lib/utils"

export default function AllFixturesPage() {
  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [filters, setFilters] = useState<FilterState>({})
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null)
  const [timePreference, setTimePreference] = useState<TimePreference>("local")
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentBatch, setCurrentBatch] = useState(1)

  const loadFixtures = useCallback(
    async (batch = 1, reset = true) => {
      setIsLoading(true)
      try {
        const result = await fetchFixtures(filters, batch, timePreference)

        if (reset) {
          setFixtures(result.data)
        } else {
          setFixtures((prev) => [...prev, ...result.data])
        }

        setHasMore(result.hasMore || false)
        setCurrentBatch(batch)
      } catch (error) {
        console.error("Error loading fixtures:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [filters, timePreference],
  )

  const debouncedLoadFixtures = useCallback(
    debounce(() => loadFixtures(1, true), 300),
    [loadFixtures],
  )

  useEffect(() => {
    debouncedLoadFixtures()
  }, [filters, timePreference, selectedDate])

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [])

  const handleClearFilters = useCallback(() => {
    setFilters({})
  }, [])

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadFixtures(currentBatch + 1, false)
    }
  }, [isLoading, hasMore, currentBatch, loadFixtures])

  const handleFixtureClick = useCallback((fixture: Fixture) => {
    setSelectedFixture(fixture)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedFixture(null)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">All Fixtures</h1>
        <DateNavigation selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <FiltersSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            isLoading={isLoading}
          />
        </div>

        <div className="lg:col-span-3">
          <FixtureList
            fixtures={fixtures}
            hasMore={hasMore}
            timePreference={timePreference}
            onFixtureClick={handleFixtureClick}
            onLoadMore={handleLoadMore}
            isLoading={isLoading}
          />
        </div>
      </div>

      <FixtureDetailModal
        fixture={selectedFixture}
        timePreference={timePreference}
        isOpen={!!selectedFixture}
        onClose={handleCloseModal}
      />
    </div>
  )
}
