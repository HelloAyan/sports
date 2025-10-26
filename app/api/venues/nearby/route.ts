import { NextResponse } from "next/server"
import type { Venue } from "@/lib/types"

// This is a mock implementation. In a real application, you'd query a database or external API.
const MOCK_VENUES: Venue[] = [
  {
    id: "1",
    name: "The Sports Bar & Grill",
    address: "123 Main Street, London, UK",
    city: "London",
    country: "United Kingdom",
    coordinates: { lat: 51.5074, lng: -0.1278 },
    rating: 4.5,
    reviewCount: 128,
    images: ["/placeholder.svg"],
    sports: ["Football", "Rugby", "Cricket"],
    amenities: ["HD TVs", "WiFi", "Food", "Beer Garden"],
    openingHours: {
      monday: "12:00-23:00",
      tuesday: "12:00-23:00",
      wednesday: "12:00-23:00",
      thursday: "12:00-23:00",
      friday: "12:00-00:00",
      saturday: "11:00-00:00",
      sunday: "12:00-22:30",
    },
    channels: ["Sky Sports", "BT Sport", "ESPN"],
    description: "Your premier sports viewing destination in central London",
    priceRange: "££",
  },
  // Add more mock venues here...
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get("location")
  const fixtureId = searchParams.get("fixtureId")

  if (!location || !fixtureId) {
    return NextResponse.json({ error: "Missing location or fixtureId parameter" }, { status: 400 })
  }

  // In a real application, you would use the location and fixtureId to query your database
  // or external API for nearby venues that are showing the specific fixture.
  // For this example, we'll just return the mock venues.

  return NextResponse.json({ venues: MOCK_VENUES })
}
