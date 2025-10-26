"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getLeagueStats } from "@/lib/api/sports-db"
import type { LeagueStats as LeagueStatsType } from "@/lib/api/sports-db"

export function LeagueStats({ leagueId }: { leagueId: string }) {
  const [stats, setStats] = useState<LeagueStatsType | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getLeagueStats(leagueId)
      setStats(data)
    }
    fetchStats()
  }, [leagueId])

  if (!stats) return null

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>League Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <h3 className="font-semibold">Total Teams</h3>
            <p>{stats.totalTeams}</p>
          </div>
          <div>
            <h3 className="font-semibold">Total Players</h3>
            <p>{stats.totalPlayers}</p>
          </div>
          <div>
            <h3 className="font-semibold">Foreign Players</h3>
            <p>{stats.foreignPlayers}</p>
          </div>
          <div>
            <h3 className="font-semibold">Avg. Player Age</h3>
            <p>{stats.avgPlayerAge}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
