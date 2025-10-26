import { type NextRequest, NextResponse } from "next/server"
import { getTeamById } from "@/lib/api/teams-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const teamId = params.id
    console.log(`[API] Fetching team details for ID: ${teamId}`)

    const team = await getTeamById(teamId)

    if (!team) {
      return NextResponse.json(
        {
          success: false,
          error: "Team not found",
          team: null,
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      team: team,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error(`[API] Error fetching team ${params.id}:`, error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        team: null,
      },
      { status: 500 },
    )
  }
}
