"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Tv, Calendar, Info, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sport color mapping for highlighting
const SPORT_COLORS: Record<string, string> = {
  Football: "text-green-500",
  Soccer: "text-green-500", // Keep this for backward compatibility, but we'll normalize to Football
  Basketball: "text-orange-500",
  Cricket: "text-blue-500",
  Tennis: "text-yellow-600",
  Rugby: "text-red-600",
  "American Football": "text-brown-500",
  Baseball: "text-blue-600",
  Golf: "text-green-600",
  "Formula 1": "text-red-500",
  Boxing: "text-purple-500",
  "Ice Hockey": "text-blue-400",
  Motorsport: "text-gray-700",
  WWE: "text-red-700",
  Athletics: "text-blue-700",
  MMA: "text-red-800",
  Cycling: "text-green-700",
  Volleyball: "text-yellow-500",
  "Field Hockey": "text-green-800",
  Snooker: "text-green-900",
  Skiing: "text-blue-300",
}

// Helper function to identify non-scoring sports
const isNonScoringEvent = (sport: string | undefined): boolean => {
  if (!sport) return false

  const nonScoringSports = [
    "motorsport",
    "formula 1",
    "motogp",
    "cycling",
    "athletics",
    "swimming",
    "golf",
    "tennis",
    "skiing",
    "snowboarding",
    "surfing",
    "skateboarding",
  ]

  return nonScoringSports.some((s) => sport.toLowerCase().includes(s))
}

// Function to normalize sport names (Soccer → Football)
const normalizeSportName = (sportName: string): string => {
  return sportName?.toLowerCase() === "soccer" ? "Football" : sportName
}

export default function EventPage() {
  const params = useParams()
  const [event, setEvent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/events/${params.id}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch event: ${response.status}`)
        }

        const data = await response.json()
        setEvent(data.event)
        setError(null)
      } catch (err) {
        console.error("Error fetching event details:", err)
        setError("Unable to load event details. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchEventDetails()
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-4">
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-[600px] w-full rounded-lg" />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="mb-4">{error || "The event you're looking for could not be found."}</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  // Normalize sport name (Soccer → Football)
  const normalizedSportName = normalizeSportName(event.strSport)

  // Get sport color for highlighting
  const sportColor = SPORT_COLORS[normalizedSportName] || "text-sports-green"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/">
          <Button variant="ghost" className="text-sports-green hover:text-sports-green/80">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">{event.strEvent}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-sports-green text-white">
                  <span className={sportColor}>{normalizedSportName}</span>
                </Badge>
                <Badge variant="outline" className="text-gray-200 border-gray-500">
                  {event.strLeague}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Calendar className="h-4 w-4" />
                <span>{event.dateEvent}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
                <Clock className="h-4 w-4" />
                <span>{event.strTime}</span>
              </div>
            </div>
          </div>

          {/* TV Channels - Dropdown */}
          {event.strTVStation && (
            <div className="mt-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center bg-sports-green/20 p-3 rounded cursor-pointer group">
                    <Tv className="h-6 w-6 mr-3 flex-shrink-0 group-hover:animate-pulse text-sports-green" />
                    <div>
                      <span className="font-semibold text-white">TV Coverage: </span>
                      <span className="text-gray-200">
                        {event.strTVStation.split(",")[0]}
                        {event.strTVStation.includes(",") ? ` + ${event.strTVStation.split(",").length - 1} more` : ""}
                      </span>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 p-3">
                  <div className="font-semibold mb-2 text-center border-b pb-2">All TV Channels</div>
                  <div className="max-h-60 overflow-y-auto">
                    <table className="w-full">
                      <tbody>
                        {event.strTVStation.split(",").map((channel: string, idx: number) => (
                          <tr key={idx} className="hover:bg-gray-100">
                            <td className="text-sm px-2 py-2">{channel.trim()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {/* Match Status Banner */}
          <div className="bg-gray-100 p-2 text-center">
            <Badge
              variant="outline"
              className="bg-sports-green/10 text-sports-green border-sports-green/20 text-sm px-3 py-1"
            >
              {event.strStatus || "Upcoming"}
            </Badge>
          </div>

          {/* Teams and Score */}
          <div className="flex justify-between items-center p-8 bg-white">
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 relative mb-3 bg-gray-100 rounded-full p-2 flex items-center justify-center">
                {event.strHomeTeamBadge ? (
                  <Image
                    src={event.strHomeTeamBadge || "/placeholder.svg"}
                    alt={event.strHomeTeam}
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                ) : (
                  <div className="text-2xl font-bold text-gray-400">
                    {event.strHomeTeam ? event.strHomeTeam.substring(0, 2).toUpperCase() : "NA"}
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-center text-lg">{event.strHomeTeam}</h3>
            </div>

            <div className="text-center">
              {!isNonScoringEvent(event.strSport) && event.intHomeScore !== null && event.intAwayScore !== null ? (
                <div className="text-5xl font-bold text-gray-800 px-8 py-4 bg-gray-100 rounded-lg">
                  {event.intHomeScore} - {event.intAwayScore}
                </div>
              ) : (
                <div className="text-3xl font-semibold text-sports-green px-8 py-4 bg-gray-100 rounded-lg">VS</div>
              )}
            </div>

            <div className="flex flex-col items-center">
              <div className="w-28 h-28 relative mb-3 bg-gray-100 rounded-full p-2 flex items-center justify-center">
                {event.strAwayTeamBadge ? (
                  <Image
                    src={event.strAwayTeamBadge || "/placeholder.svg"}
                    alt={event.strAwayTeam}
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                ) : (
                  <div className="text-2xl font-bold text-gray-400">
                    {event.strAwayTeam ? event.strAwayTeam.substring(0, 2).toUpperCase() : "NA"}
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-center text-lg">{event.strAwayTeam}</h3>
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-gray-50 border-t">
            {event.strVenue && (
              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <MapPin className="h-5 w-5 text-sports-green" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Venue</h4>
                  <p className="text-gray-700">{event.strVenue}</p>
                  {event.strCity && event.strCountry && (
                    <p className="text-sm text-gray-500">
                      {event.strCity}, {event.strCountry}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Event Description */}
          {event.strDescriptionEN && (
            <div className="p-8 bg-white border-t">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gray-100 p-2 rounded-full">
                  <Info className="h-5 w-5 text-sports-green" />
                </div>
                <h4 className="font-semibold text-gray-800 text-lg">Event Details</h4>
              </div>
              <p className="text-gray-700 leading-relaxed">{event.strDescriptionEN}</p>
            </div>
          )}

          {/* Event Image */}
          {event.strThumb && (
            <div className="border-t">
              <Image
                src={event.strThumb || "/placeholder.svg"}
                alt={event.strEvent}
                width={800}
                height={400}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Event Video */}
          {event.strVideo && (
            <div className="p-8 border-t bg-gray-50">
              <h4 className="font-semibold text-gray-800 text-lg mb-4">Event Video</h4>
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${event.strVideo.split("v=")[1]}`}
                  title={event.strEvent}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
