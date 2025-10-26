"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, MapPin, Calendar, Trophy, Globe, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Team {
  idTeam: string
  strTeam: string
  strAlternate: string
  strLeague: string
  strSport: string
  strCountry: string
  strStadium: string
  strStadiumThumb: string
  strStadiumDescription: string
  strStadiumLocation: string
  strWebsite: string
  strFacebook: string
  strTwitter: string
  strInstagram: string
  strDescriptionEN: string
  strTeamBadge: string
  strTeamJersey: string
  strTeamLogo: string
  intFormedYear: string
  strKeywords: string
}

interface TeamEvent {
  idEvent: string
  strEvent: string
  dateEvent: string
  strTime: string
  strStatus: string
  strHomeTeam: string
  strAwayTeam: string
  intHomeScore: string | null
  intAwayScore: string | null
}

export default function TeamPage() {
  const params = useParams()
  const [team, setTeam] = useState<Team | null>(null)
  const [upcomingEvents, setUpcomingEvents] = useState<TeamEvent[]>([])
  const [pastEvents, setPastEvents] = useState<TeamEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setIsLoading(true)

        // Fetch team details
        const teamResponse = await fetch(`/api/teams/${params.id}`)
        if (teamResponse.ok) {
          const teamData = await teamResponse.json()
          setTeam(teamData.team)
        }

        // Fetch upcoming events
        const upcomingResponse = await fetch(`/api/teams/${params.id}/upcoming`)
        if (upcomingResponse.ok) {
          const upcomingData = await upcomingResponse.json()
          setUpcomingEvents(upcomingData.events || [])
        }

        // Fetch past events
        const pastResponse = await fetch(`/api/teams/${params.id}/past`)
        if (pastResponse.ok) {
          const pastData = await pastResponse.json()
          setPastEvents(pastData.events || [])
        }

        setError(null)
      } catch (err) {
        console.error("Error fetching team data:", err)
        setError("Unable to load team details. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchTeamData()
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-4">
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !team) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Team Not Found</h1>
          <p className="mb-4">{error || "The team you're looking for could not be found."}</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

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

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Team Info */}
        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-full p-2">
                  <Image
                    src={team.strTeamBadge || "/placeholder.svg"}
                    alt={team.strTeam}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>
                <div>
                  <CardTitle className="text-2xl">{team.strTeam}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className="bg-white/20 text-white">{team.strSport}</Badge>
                    <Badge className="bg-white/20 text-white">{team.strLeague}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Team Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Country:</strong> {team.strCountry}
                    </div>
                    <div>
                      <strong>Founded:</strong> {team.intFormedYear}
                    </div>
                    <div>
                      <strong>Stadium:</strong> {team.strStadium}
                    </div>
                    {team.strStadiumLocation && (
                      <div>
                        <strong>Location:</strong> {team.strStadiumLocation}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Social Links
                  </h3>
                  <div className="space-y-2">
                    {team.strWebsite && (
                      <a
                        href={team.strWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 hover:underline text-sm"
                      >
                        Official Website
                      </a>
                    )}
                    {team.strFacebook && (
                      <a
                        href={team.strFacebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 hover:underline text-sm"
                      >
                        Facebook
                      </a>
                    )}
                    {team.strTwitter && (
                      <a
                        href={team.strTwitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 hover:underline text-sm"
                      >
                        Twitter
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {team.strDescriptionEN && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">About {team.strTeam}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{team.strDescriptionEN}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stadium Info */}
          {team.strStadium && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {team.strStadium}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {team.strStadiumThumb && (
                  <Image
                    src={team.strStadiumThumb || "/placeholder.svg"}
                    alt={team.strStadium}
                    width={600}
                    height={300}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                {team.strStadiumDescription && <p className="text-sm text-gray-700">{team.strStadiumDescription}</p>}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Calendar className="h-5 w-5 mr-2" />
                Upcoming Fixtures
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.slice(0, 5).map((event) => (
                    <Link key={event.idEvent} href={`/events/${event.idEvent}`}>
                      <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="font-medium text-sm">{event.strEvent}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(event.dateEvent).toLocaleDateString()} • {event.strTime?.substring(0, 5)}
                        </div>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {event.strStatus}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No upcoming fixtures</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Trophy className="h-5 w-5 mr-2" />
                Recent Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pastEvents.length > 0 ? (
                <div className="space-y-3">
                  {pastEvents.slice(0, 5).map((event) => (
                    <Link key={event.idEvent} href={`/events/${event.idEvent}`}>
                      <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="font-medium text-sm">{event.strEvent}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(event.dateEvent).toLocaleDateString()}
                        </div>
                        {event.intHomeScore !== null && event.intAwayScore !== null && (
                          <div className="text-sm font-bold mt-1">
                            {event.intHomeScore} - {event.intAwayScore}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No recent results</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
