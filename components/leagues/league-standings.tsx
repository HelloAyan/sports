"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Standing = {
  position: number
  teamName: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

export function LeagueStandings({ leagueId }: { leagueId: string }) {
  const [standings, setStandings] = useState<Standing[]>([])
  const [seasons, setSeasons] = useState<string[]>([])
  const [selectedSeason, setSelectedSeason] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch available seasons
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await fetch(`/api/leagues/${leagueId}/seasons`)
        if (!response.ok) {
          throw new Error("Failed to fetch seasons")
        }
        const data = await response.json()
        setSeasons(data.seasons || [])
        if (data.seasons && data.seasons.length > 0) {
          setSelectedSeason(data.seasons[0]) // Select the most recent season
        }
      } catch (err) {
        console.error("Failed to load seasons:", err)
        setError("Failed to load seasons")
      }
    }

    fetchSeasons()
  }, [leagueId])

  // Fetch standings when season changes
  useEffect(() => {
    if (!selectedSeason) return

    const fetchStandings = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/leagues/${leagueId}/table?season=${selectedSeason}`)
        if (!response.ok) {
          throw new Error("Failed to fetch standings")
        }
        const data = await response.json()

        // Map API data to our Standing type
        const formattedStandings: Standing[] = (data.table || []).map((item: any) => ({
          position: Number.parseInt(item.intRank) || 0,
          teamName: item.strTeam || "",
          played: Number.parseInt(item.intPlayed) || 0,
          won: Number.parseInt(item.intWin) || 0,
          drawn: Number.parseInt(item.intDraw) || 0,
          lost: Number.parseInt(item.intLoss) || 0,
          goalsFor: Number.parseInt(item.intGoalsFor) || 0,
          goalsAgainst: Number.parseInt(item.intGoalsAgainst) || 0,
          goalDifference: Number.parseInt(item.intGoalDifference) || 0,
          points: Number.parseInt(item.intPoints) || 0,
        }))

        setStandings(formattedStandings)
        setError(null)
      } catch (err) {
        console.error("Failed to load standings:", err)
        setError("Failed to load standings")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStandings()
  }, [leagueId, selectedSeason])

  if (isLoading) return <div>Loading standings...</div>
  if (error) return <div>Error loading standings: {error}</div>

  return (
    <div>
      {seasons.length > 0 && (
        <div className="mb-4">
          <Select value={selectedSeason} onValueChange={setSelectedSeason}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season) => (
                <SelectItem key={season} value={season}>
                  {season}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Pos</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-center w-12">P</TableHead>
            <TableHead className="text-center w-12">W</TableHead>
            <TableHead className="text-center w-12">D</TableHead>
            <TableHead className="text-center w-12">L</TableHead>
            <TableHead className="text-center w-12">GF</TableHead>
            <TableHead className="text-center w-12">GA</TableHead>
            <TableHead className="text-center w-12">GD</TableHead>
            <TableHead className="text-center w-12">Pts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((standing) => (
            <TableRow key={standing.teamName}>
              <TableCell>{standing.position}</TableCell>
              <TableCell>{standing.teamName}</TableCell>
              <TableCell className="text-center">{standing.played}</TableCell>
              <TableCell className="text-center">{standing.won}</TableCell>
              <TableCell className="text-center">{standing.drawn}</TableCell>
              <TableCell className="text-center">{standing.lost}</TableCell>
              <TableCell className="text-center">{standing.goalsFor}</TableCell>
              <TableCell className="text-center">{standing.goalsAgainst}</TableCell>
              <TableCell className="text-center">{standing.goalDifference}</TableCell>
              <TableCell className="text-center font-bold">{standing.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
