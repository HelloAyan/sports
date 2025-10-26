"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MultiSelect } from "@/components/ui/multi-select"
import type { BarOwner } from "@/lib/types/bar-owner"

type BarOwnerPreferencesProps = {
  barOwnerId: string
}

export function BarOwnerPreferences({ barOwnerId }: BarOwnerPreferencesProps) {
  const [preferences, setPreferences] = useState<BarOwner | null>(null)

  useEffect(() => {
    // Fetch bar owner preferences
    const fetchPreferences = async () => {
      const response = await fetch(`/api/bar-owners/${barOwnerId}`)
      const data = await response.json()
      setPreferences(data.barOwner)
    }
    fetchPreferences()
  }, [barOwnerId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch(`/api/bar-owners/${barOwnerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferences),
    })
    const data = await response.json()
    if (data.success) {
      // Handle successful update
      console.log("Preferences updated successfully")
    } else {
      // Handle update error
      console.error("Failed to update preferences")
    }
  }

  if (!preferences) return <div>Loading...</div>

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="favoriteTeams">Favorite Teams</Label>
        <MultiSelect
          id="favoriteTeams"
          options={["Team 1", "Team 2", "Team 3", "Team 4", "Team 5"]}
          value={preferences.favoriteTeams}
          onChange={(value) => setPreferences({ ...preferences, favoriteTeams: value })}
        />
      </div>
      <div>
        <Label htmlFor="favoriteSports">Favorite Sports</Label>
        <MultiSelect
          id="favoriteSports"
          options={["Football", "Basketball", "Tennis", "Golf", "Rugby"]}
          value={preferences.favoriteSports}
          onChange={(value) => setPreferences({ ...preferences, favoriteSports: value })}
        />
      </div>
      <div>
        <Label htmlFor="favoriteEvents">Favorite Events</Label>
        <MultiSelect
          id="favoriteEvents"
          options={["Premier League", "Champions League", "NBA Finals", "Wimbledon", "Super Bowl"]}
          value={preferences.favoriteEvents}
          onChange={(value) => setPreferences({ ...preferences, favoriteEvents: value })}
        />
      </div>
      <div>
        <Label htmlFor="xiboDisplayId">Xibo Display ID</Label>
        <Input
          id="xiboDisplayId"
          value={preferences.xiboDisplayId || ""}
          onChange={(e) => setPreferences({ ...preferences, xiboDisplayId: e.target.value })}
        />
      </div>
      <Button type="submit">Save Preferences</Button>
    </form>
  )
}
