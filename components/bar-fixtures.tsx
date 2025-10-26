"use client"

import { useState, useEffect } from "react"
import type { BarFixture } from "@/lib/types/bar-owner"
import { FixtureCard } from "@/components/fixture-card"

type BarFixturesProps = {
  barOwnerId: string
}

export function BarFixtures({ barOwnerId }: BarFixturesProps) {
  const [fixtures, setFixtures] = useState<BarFixture[]>([])

  useEffect(() => {
    // Fetch bar fixtures
    const fetchFixtures = async () => {
      const response = await fetch(`/api/bar-owners/${barOwnerId}/fixtures`)
      const data = await response.json()
      setFixtures(data.fixtures)
    }
    fetchFixtures()
  }, [barOwnerId])

  return (
    <div className="space-y-4">
      {fixtures.map((fixture) => (
        <FixtureCard
          key={fixture.id}
          fixture={fixture}
          timePreference="local"
          onFixtureClick={() => {}}
          isDisplayed={fixture.isDisplayed}
        />
      ))}
    </div>
  )
}
