"use client"

import { useState } from "react"
import { Flame, TrendingUp, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TrendingTopic {
  rank: number
  name: string
  mentions: string
  category: string
  trend: "up" | "down" | "stable"
}

interface HotMatch {
  rank: number
  homeTeam: string
  awayTeam: string
  league: string
  time: string
  viewers: string
}

export function TrendingNowSection() {
  const [activeTab, setActiveTab] = useState<"topics" | "matches">("topics")

  const trendingTopics: TrendingTopic[] = [
    { rank: 1, name: "Premier League", mentions: "2.3M mentions", category: "league", trend: "up" },
    { rank: 2, name: "Champions League", mentions: "1.8M mentions", category: "tournament", trend: "up" },
    { rank: 3, name: "NBA Finals", mentions: "1.5M mentions", category: "tournament", trend: "up" },
    { rank: 4, name: "Formula 1", mentions: "1.2M mentions", category: "sport", trend: "up" },
    { rank: 5, name: "Wimbledon", mentions: "980K mentions", category: "tournament", trend: "up" },
    { rank: 6, name: "NFL", mentions: "850K mentions", category: "league", trend: "up" },
    { rank: 7, name: "World Cup", mentions: "750K mentions", category: "tournament", trend: "up" },
    { rank: 8, name: "Olympics", mentions: "650K mentions", category: "event", trend: "up" },
  ]

  const hotMatches: HotMatch[] = [
    {
      rank: 1,
      homeTeam: "Manchester United",
      awayTeam: "Liverpool",
      league: "Premier League",
      time: "15:00",
      viewers: "2.1M viewers",
    },
    {
      rank: 2,
      homeTeam: "Real Madrid",
      awayTeam: "Barcelona",
      league: "La Liga",
      time: "20:00",
      viewers: "1.9M viewers",
    },
    { rank: 3, homeTeam: "Lakers", awayTeam: "Warriors", league: "NBA", time: "02:30", viewers: "1.7M viewers" },
    {
      rank: 4,
      homeTeam: "Chelsea",
      awayTeam: "Arsenal",
      league: "Premier League",
      time: "17:30",
      viewers: "1.5M viewers",
    },
    {
      rank: 5,
      homeTeam: "Bayern Munich",
      awayTeam: "Dortmund",
      league: "Bundesliga",
      time: "18:30",
      viewers: "1.3M viewers",
    },
    { rank: 6, homeTeam: "PSG", awayTeam: "Marseille", league: "Ligue 1", time: "21:00", viewers: "1.1M viewers" },
    {
      rank: 7,
      homeTeam: "Juventus",
      awayTeam: "Inter Milan",
      league: "Serie A",
      time: "19:45",
      viewers: "950K viewers",
    },
    { rank: 8, homeTeam: "Celtics", awayTeam: "Heat", league: "NBA", time: "01:00", viewers: "800K viewers" },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Flame className="h-8 w-8 text-red-500" />
            <h2 className="text-4xl font-bold text-red-500">Trending Now</h2>
          </div>
          <p className="text-gray-600 text-lg">Discover what's hot in the sports world right now</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-md">
            <button
              onClick={() => setActiveTab("topics")}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                activeTab === "topics" ? "bg-red-500 text-white shadow-md" : "text-gray-600 hover:text-red-500"
              }`}
            >
              <TrendingUp className="inline h-4 w-4 mr-2" />
              Trending Topics
            </button>
            <button
              onClick={() => setActiveTab("matches")}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                activeTab === "matches" ? "bg-red-500 text-white shadow-md" : "text-gray-600 hover:text-red-500"
              }`}
            >
              <Clock className="inline h-4 w-4 mr-2" />
              Hot Matches
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-8">
          {activeTab === "topics"
            ? trendingTopics.map((topic) => (
                <div
                  key={topic.rank}
                  className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-red-500">#{topic.rank}</span>
                    <TrendingUp className="h-4 w-4 text-red-500 group-hover:animate-bounce" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-red-500 transition-colors">
                    {topic.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{topic.mentions}</p>
                  <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                    {topic.category}
                  </span>
                </div>
              ))
            : hotMatches.map((match) => (
                <div
                  key={match.rank}
                  className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-red-500">#{match.rank}</span>
                    <Clock className="h-4 w-4 text-red-500" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm group-hover:text-red-500 transition-colors">
                    {match.homeTeam} vs {match.awayTeam}
                  </h3>
                  <p className="text-xs text-gray-600 mb-1">{match.league}</p>
                  <p className="text-xs text-gray-600 mb-2">{match.time}</p>
                  <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                    {match.viewers}
                  </span>
                </div>
              ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
            View All Trending
          </Button>
        </div>
      </div>
    </section>
  )
}
