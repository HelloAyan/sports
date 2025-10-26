"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Tv, Users, ShoppingBag, Plane, Heart, Play, Info } from "lucide-react"

interface FixtureCardProps {
  fixture: {
    id: string
    homeTeam: string
    awayTeam: string
    homeTeamLogo?: string
    awayTeamLogo?: string
    league: string
    date: string
    time: string
    venue: string
    location: string
    status: "upcoming" | "live" | "finished"
    tvInfo?: string[]
    isLive?: boolean
  }
}

export default function FixtureCard({ fixture }: FixtureCardProps) {
  const [showTvInfo, setShowTvInfo] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-500 animate-pulse"
      case "upcoming":
        return "bg-green-500"
      case "finished":
        return "bg-gray-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
      <CardContent className="p-0">
        <div className="grid grid-cols-12 gap-0 min-h-[200px]">
          {/* Left Section - Team Matchup */}
          <div className="col-span-4 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white p-6 flex flex-col justify-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-white rounded-full"></div>
            </div>

            {/* Live Status Indicator */}
            {fixture.isLive && (
              <div className="absolute top-4 right-4">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(fixture.status)}`}></div>
              </div>
            )}

            {/* Team Logos and VS */}
            <div className="relative z-10 flex items-center justify-between">
              {/* Home Team */}
              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 mx-auto shadow-lg">
                  {fixture.homeTeamLogo ? (
                    <img
                      src={fixture.homeTeamLogo || "/placeholder.svg"}
                      alt={fixture.homeTeam}
                      className="w-12 h-12 object-contain"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {fixture.homeTeam.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm font-semibold leading-tight">
                  {fixture.homeTeam.length > 12 ? fixture.homeTeam.substring(0, 12) + "..." : fixture.homeTeam}
                </p>
              </div>

              {/* VS Divider */}
              <div className="text-center mx-4">
                <div className="text-2xl font-black text-white/90 mb-2">VS</div>
                <div className={`w-2 h-2 rounded-full mx-auto ${getStatusColor(fixture.status)}`}></div>
              </div>

              {/* Away Team */}
              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 mx-auto shadow-lg">
                  {fixture.awayTeamLogo ? (
                    <img
                      src={fixture.awayTeamLogo || "/placeholder.svg"}
                      alt={fixture.awayTeam}
                      className="w-12 h-12 object-contain"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {fixture.awayTeam.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm font-semibold leading-tight">
                  {fixture.awayTeam.length > 12 ? fixture.awayTeam.substring(0, 12) + "..." : fixture.awayTeam}
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Match Information */}
          <div className="col-span-8 bg-white p-6">
            {/* TV Info Banner */}
            <div className="mb-4">
              <div
                className="bg-blue-50 border border-blue-200 rounded-lg p-3 cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => setShowTvInfo(!showTvInfo)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tv className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-800">TV Channels</span>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {fixture.tvInfo ? fixture.tvInfo.length : "Not Available"}
                  </Badge>
                </div>
                {fixture.tvInfo && fixture.tvInfo.length > 0 ? (
                  <p className="text-xs text-blue-600 mt-1">Click to view available channels</p>
                ) : (
                  <p className="text-xs text-blue-600 mt-1">TV Info Not Available</p>
                )}
              </div>
            </div>

            {/* Match Details */}
            <div className="space-y-4">
              {/* Date */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">{formatDate(fixture.date)}</span>
              </div>

              {/* Match Title */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {fixture.homeTeam} vs {fixture.awayTeam}
                </h3>
                <p className="text-sm text-blue-600 font-medium">{fixture.league}</p>
              </div>

              {/* Time and Venue */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{fixture.time}</p>
                    <p className="text-xs text-gray-500">Your Time</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{fixture.venue}</p>
                    <p className="text-xs text-gray-500">Location: {fixture.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 grid grid-cols-6 gap-2">
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Users className="w-3 h-3 mr-1" />
                <span className="text-xs">Tickets</span>
              </Button>

              <Button
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                <ShoppingBag className="w-3 h-3 mr-1" />
                <span className="text-xs">Shop</span>
              </Button>

              <Button
                size="sm"
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Plane className="w-3 h-3 mr-1" />
                <span className="text-xs">Travel</span>
              </Button>

              <Button
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Heart className="w-3 h-3 mr-1" />
                <span className="text-xs">Follow</span>
              </Button>

              <Button
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Play className="w-3 h-3 mr-1" />
                <span className="text-xs">Watch</span>
              </Button>

              <Button
                size="sm"
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Info className="w-3 h-3 mr-1" />
                <span className="text-xs">More</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Expandable TV Info Section */}
        {showTvInfo && fixture.tvInfo && fixture.tvInfo.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-blue-50">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Available TV Channels:</h4>
            <div className="flex flex-wrap gap-2">
              {fixture.tvInfo.map((channel, index) => (
                <Badge key={index} variant="outline" className="bg-white border-blue-200 text-blue-700">
                  {channel}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
