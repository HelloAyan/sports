import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import type { BarOwner } from "@/lib/types/bar-owner"

// This is a mock database. In a real application, you'd use a proper database.
const barOwners: BarOwner[] = []

export async function POST(request: Request) {
  const body = await request.json()

  const newBarOwner: BarOwner = {
    id: uuidv4(),
    name: body.name,
    email: body.email,
    barName: body.barName,
    address: body.address,
    openingHours: body.openingHours,
    favoriteTeams: [],
    favoriteSports: [],
    favoriteEvents: [],
  }

  barOwners.push(newBarOwner)

  return NextResponse.json({ success: true, barOwner: newBarOwner })
}
