import { NextResponse } from "next/server"
import { getAllSports, getSportById } from "@/lib/api/sports-service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  try {
    if (id) {
      const sport = await getSportById(id)
      return NextResponse.json({ sport })
    } else {
      const sports = await getAllSports()
      return NextResponse.json({ sports })
    }
  } catch (error) {
    console.error(`Error in sports API:`, error)
    return NextResponse.json(
      {
        error: "Failed to fetch sports data",
        sports: [],
      },
      { status: 500 },
    )
  }
}
