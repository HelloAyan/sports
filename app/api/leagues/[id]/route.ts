import { NextResponse } from "next/server"
import { getLeagueById } from "@/lib/api/leagues-service"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const leagueId = params.id

  try {
    const league = await getLeagueById(leagueId)

    if (!league) {
      return NextResponse.json(
        {
          error: "League not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({ league })
  } catch (error) {
    console.error(`Error fetching league ${leagueId}:`, error)
    return NextResponse.json(
      {
        error: `Failed to fetch league ${leagueId}`,
      },
      { status: 500 },
    )
  }
}
