"use client"

import { useState } from "react"
import { TrendingUp, Clock, FlameIcon as Fire } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const TRENDING_TOPICS = [
  { name: "Premier League", count: "2.3M", type: "league", href: "/leagues/premier-league" },
  { name: "Champions League", count: "1.8M", type: "tournament", href: "/leagues/champions-league" },
  { name: "NBA Finals", count: "1.5M", type: "tournament", href: "/leagues/nba" },
  { name: "Formula 1", count: "1.2M", type: "sport", href: "/sports/formula-1" },
  { name: "Wimbledon", count: "980K", type: "tournament", href: "/sports/tennis" },
  { name: "NFL", count: "850K", type: "league", href: "/leagues/nfl" },
  { name: "World Cup", count: "750K", type: "tournament", href: "/tournaments/world-cup" },
  { name: "Olympics", count: "650K", type: "event", href: "/events/olympics" },
]

const TRENDING_MATCHES = [
  {
    id: 1,
    homeTeam: "Manchester United",
    awayTeam: "Liverpool",
    league: "Premier League",
    time: "15:30",
    status: "LIVE",
    score: "2-1",
  },
  {
    id: 2,
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    league: "La Liga",
    time: "20:00",
    status: "UPCOMING",
    score: "vs",
  },
  {
    id: 3,
    homeTeam: "Lakers",
    awayTeam: "Warriors",
    league: "NBA",
    time: "02:30",
    status: "LIVE",
    score: "98-102",
  },
]

export function TrendingSection() {
  const [activeTab, setActiveTab] = useState<"topics" | "matches">("topics")

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Fire className="h-8 w-8 text-red-500" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Trending Now
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover what's hot in the sports world right now</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-md">
            <button
              onClick={() => setActiveTab("topics")}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeTab === "topics" ? "bg-red-500 text-white" : "text-gray-600 hover:text-red-500"
              }`}
            >
              <TrendingUp className="h-4 w-4 inline mr-2" />
              Trending Topics
            </button>
            <button
              onClick={() => setActiveTab("matches")}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeTab === "matches" ? "bg-red-500 text-white" : "text-gray-600 hover:text-red-500"
              }`}
            >
              <Clock className="h-4 w-4 inline mr-2" />
              Hot Matches
            </button>
          </div>
        </div>

        {/* Trending Topics */}
        {activeTab === "topics" && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {TRENDING_TOPICS.map((topic, index) => (
              <Link key={topic.name} href={topic.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-red-500 mr-1">#{index + 1}</span>
                      <TrendingUp className="h-4 w-4 text-red-500 group-hover:animate-bounce" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1 group-hover:text-red-600 transition-colors">
                      {topic.name}
                    </h3>
                    <p className="text-xs text-gray-500">{topic.count} mentions</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {topic.type}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Hot Matches */}
        {activeTab === "matches" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRENDING_MATCHES.map((match) => (
              <Card key={match.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant={match.status === "LIVE" ? "destructive" : "secondary"} className="animate-pulse">
                      {match.status}
                    </Badge>
                    <span className="text-sm text-gray-500">{match.time}</span>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{match.homeTeam}</span>
                      <span className="font-bold text-lg">{match.score}</span>
                      <span className="font-medium text-sm">{match.awayTeam}</span>
                    </div>
                    <p className="text-xs text-gray-500">{match.league}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-8">
          <button className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:from-red-600 hover:to-orange-600 transition-colors shadow-lg">
            View All Trending
          </button>
        </div>
      </div>
    </section>
  )
}
