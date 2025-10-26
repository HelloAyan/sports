"use client"

import { useState } from "react"
import { Clock, Users, Tv, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface LiveEvent {
  id: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  league: string
  status: "live" | "upcoming" | "finished"
  time: string
  venue: string
  viewers: string
  tvChannel?: string
}

export function TopLiveEvents() {
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([
    {
      id: "1",
      homeTeam: "Bears",
      awayTeam: "Lambton Jaffas",
      homeScore: 2,
      awayScore: 1,
      league: "Illawarra NSW NPL",
      status: "live",
      time: "78'",
      venue: "WIN Stadium",
      viewers: "12.5K",
      tvChannel: "ESPN",
    },
    {
      id: "2",
      homeTeam: "Charlestown Azzurri",
      awayTeam: "Edgeworth",
      homeScore: 0,
      awayScore: 0,
      league: "Australia Northern NSW NPL",
      status: "live",
      time: "23'",
      venue: "Darling Street Oval",
      viewers: "8.2K",
      tvChannel: "Fox Sports",
    },
    {
      id: "3",
      homeTeam: "New England Revolution",
      awayTeam: "Inter Miami",
      homeScore: 1,
      awayScore: 2,
      league: "American Major League Soccer",
      status: "live",
      time: "65'",
      venue: "Gillette Stadium",
      viewers: "45.3K",
      tvChannel: "MLS TV",
    },
    {
      id: "4",
      homeTeam: "Gold Coast Knights",
      awayTeam: "Brisbane Roar Youth",
      homeScore: 3,
      awayScore: 1,
      league: "Australia Queensland NPL",
      status: "live",
      time: "89'",
      venue: "Cbus Super Stadium",
      viewers: "15.7K",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-500 text-white"
      case "upcoming":
        return "bg-blue-500 text-white"
      case "finished":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "live":
        return "LIVE"
      case "upcoming":
        return "UPCOMING"
      case "finished":
        return "FINISHED"
      default:
        return "UNKNOWN"
    }
  }

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Top Live Events</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">Follow the most exciting live matches happening right now</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {liveEvents.map((event) => (
            <div
              key={event.id}
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors duration-200 cursor-pointer border border-gray-700"
            >
              {/* Status and League */}
              <div className="flex items-center justify-between mb-4">
                <Badge className={`${getStatusColor(event.status)} px-2 py-1 text-xs font-semibold`}>
                  {getStatusText(event.status)}
                </Badge>
                {event.tvChannel && (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Tv className="h-3 w-3" />
                    {event.tvChannel}
                  </div>
                )}
              </div>

              {/* League */}
              <p className="text-sm text-gray-400 mb-3">{event.league}</p>

              {/* Teams and Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{event.homeTeam}</span>
                  <span className="text-2xl font-bold text-white">{event.homeScore}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{event.awayTeam}</span>
                  <span className="text-2xl font-bold text-white">{event.awayScore}</span>
                </div>
              </div>

              {/* Match Info */}
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3" />
                  <span>{event.viewers} watching</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-200">
            View All Live Events
          </button>
        </div>
      </div>
    </section>
  )
}
