import { NextResponse } from "next/server"
import { getTeamsByLeague } from "@/lib/sports-db"

// This is a mock implementation as TheSportsDB doesn't have a direct endpoint for standings
// In a real application, you would calculate these from match results
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const leagueId = params.id
    const teams = await getTeamsByLeague(leagueId)

    // Create mock standings data
    const standings = teams
      .map((team, index) => {
        const position = index + 1
        const played = Math.floor(Math.random() * 20) + 10
        const won = Math.floor(Math.random() * played)
        const drawn = Math.floor(Math.random() * (played - won))
        const lost = played - won - drawn
        const goalsFor = won * 2 + drawn
        const goalsAgainst = lost * 2 + drawn
        const points = won * 3 + drawn

        return {
          position,
          teamName: team.strTeam,
          played,
          won,
          drawn,
          lost,
          goalsFor,
          goalsAgainst,
          points,
        }
      })
      .sort((a, b) => b.points - a.points)

    return NextResponse.json(standings)
  } catch (error) {
    console.error(`Error fetching standings for league ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch standings" }, { status: 500 })
  }
}
