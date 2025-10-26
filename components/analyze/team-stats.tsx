"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

export function TeamStats() {
  const [selectedTeam, setSelectedTeam] = useState("")
  const [selectedSeason, setSelectedSeason] = useState("")

  // Mock data - replace with actual API data
  const formData = [
    { match: "Match 1", result: "W", performance: 85 },
    { match: "Match 2", result: "W", performance: 82 },
    { match: "Match 3", result: "L", performance: 65 },
    { match: "Match 4", result: "D", performance: 75 },
    { match: "Match 5", result: "W", performance: 88 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Select value={selectedTeam} onValueChange={setSelectedTeam}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="team-a">Team A</SelectItem>
            <SelectItem value="team-b">Team B</SelectItem>
            <SelectItem value="team-c">Team C</SelectItem>
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
          <CardTitle>Team Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[400px]">
            <LineChart data={formData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="match" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="performance" stroke="var(--primary)" />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
