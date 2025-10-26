"use client"

import { useState, useCallback, memo } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FixtureCard } from "@/components/fixture-card"
import type { Fixture, TimePreference } from "@/lib/types"

interface FixtureListProps {
  fixtures: Fixture[]
  hasMore: boolean
  timePreference: TimePreference
  onFixtureClick: (fixture: Fixture) => void
  onLoadMore: () => void
  isLoading: boolean
}

export const FixtureList = memo(function FixtureList({
  fixtures,
  hasMore,
  timePreference,
  onFixtureClick,
  onLoadMore,
  isLoading,
}: FixtureListProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleLoadMore = useCallback(() => {
    if (!isLoading) {
      onLoadMore()
    }
  }, [isLoading, onLoadMore])

  const handleFixtureClick = useCallback(
    (fixture: Fixture) => {
      onFixtureClick(fixture)
    },
    [onFixtureClick],
  )

  if (fixtures.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No fixtures found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {fixtures.map((fixture) => (
          <FixtureCard
            key={fixture.id}
            fixture={fixture}
            timePreference={timePreference}
            onFixtureClick={handleFixtureClick}
          />
        ))}
      </div>

      {hasMore && (
        <div className="text-center py-4">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={isLoading}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full max-w-md py-8 border-2 border-dashed hover:border-primary group"
          >
            <ChevronDown
              className={`w-6 h-6 transition-transform duration-300 ${isHovered ? "transform translate-y-1" : ""}`}
            />
            <span className="ml-2">{isLoading ? "Loading more fixtures..." : "Show more fixtures"}</span>
          </Button>
        </div>
      )}
    </div>
  )
})
