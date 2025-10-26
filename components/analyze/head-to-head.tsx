"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pie, PieChart, Cell, Legend, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

export function HeadToHead() {
  const [selectedTeam1, setSelectedTeam1] = useState("")
  const [selectedTeam2, setSelectedTeam2] = useState("")

  // Mock data - replace with actual API data
  const h2hData = [
    { name: "Team 1 Wins", value: 15 },
    { name: "Team 2 Wins", value: 12 },
    { name: "Draws", value: 8 },
  ]

  const COLORS = ["var(--primary)", "var(--destructive)", "var(--muted)"]

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Select value={selectedTeam1} onValueChange={setSelectedTeam1}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Team 1" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="team-a">Team A</SelectItem>
            <SelectItem value="team-b">Team B</SelectItem>
            <SelectItem value="team-c">Team C</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedTeam2} onValueChange={setSelectedTeam2}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Team 2" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="team-a">Team A</SelectItem>
            <SelectItem value="team-b">Team B</SelectItem>
            <SelectItem value="team-c">Team C</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Head to Head Record</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[400px]">
            <PieChart>
              <Pie data={h2hData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} label>
                {h2hData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
