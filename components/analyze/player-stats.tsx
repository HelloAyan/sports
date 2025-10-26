"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

export function PlayerStats() {
  const [selectedPlayer, setSelectedPlayer] = useState("")
  const [selectedSeason, setSelectedSeason] = useState("")

  // Mock data - replace with actual API data
  const statsData = [
    { attribute: "Pace", value: 85 },
    { attribute: "Shooting", value: 78 },
    { attribute: "Passing", value: 82 },
    { attribute: "Dribbling", value: 88 },
    { attribute: "Defending", value: 45 },
    { attribute: "Physical", value: 70 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Player" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="player-a">Player A</SelectItem>
            <SelectItem value="player-b">Player B</SelectItem>
            <SelectItem value="player-c">Player C</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedSeason} onValueChange={setSelectedSeason}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Season" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2023-24">2023-24</SelectItem>
            <SelectItem value="2022-23">2022-23</SelectItem>
            <SelectItem value="2021-22">2021-22</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Player Attributes</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[400px]">
            <RadarChart data={statsData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="attribute" />
              <PolarRadiusAxis />
              <Radar dataKey="value" fill="var(--primary)" fillOpacity={0.6} />
            </RadarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
