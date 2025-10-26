"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

export function LeagueStats() {
  const [selectedLeague, setSelectedLeague] = useState("")
  const [selectedSeason, setSelectedSeason] = useState("")

  // Mock data - replace with actual API data
  const data = [
    { team: "Team A", points: 82, goalsFor: 75, goalsAgainst: 28 },
    { team: "Team B", points: 78, goalsFor: 68, goalsAgainst: 32 },
    { team: "Team C", points: 74, goalsFor: 65, goalsAgainst: 35 },
    { team: "Team D", points: 71, goalsFor: 59, goalsAgainst: 38 },
    { team: "Team E", points: 66, goalsFor: 55, goalsAgainst: 45 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Select value={selectedLeague} onValueChange={setSelectedLeague}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select League" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="premier-league">Premier League</SelectItem>
            <SelectItem value="la-liga">La Liga</SelectItem>
            <SelectItem value="bundesliga">Bundesliga</SelectItem>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Points Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="team" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="points" fill="var(--primary)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Goals Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="team" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="goalsFor" fill="var(--primary)" name="Goals For" />
                <Bar dataKey="goalsAgainst" fill="var(--destructive)" name="Goals Against" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
