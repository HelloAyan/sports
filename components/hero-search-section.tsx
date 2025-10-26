"use client"

import { useState } from "react"
import { Search, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function HeroSearchSection() {
  const [selectedSport, setSelectedSport] = useState("")
  const [selectedLeague, setSelectedLeague] = useState("")
  const [selectedVenue, setSelectedVenue] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const trendingTags = [
    "Celtic FC",
    "St. Pauli",
    "Barcelona",
    "PGA Tour",
    "Formula 1",
    "Boxing",
    "MLS",
    "NBA",
    "NFL",
    "Champions League",
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white min-h-[600px]">
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: "url('/placeholder.svg?height=600&width=1200')",
        }}
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            SPORTS FIXTURES, TIME-ZONE PERFECT, TV LISTINGS, TICKETS & MORE!
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            Time zone accurate Fixture information for all sports, Fixture specific links to tickets, travel, news, and
            more
          </p>
        </div>

        {/* Search Interface */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* All Sports Dropdown */}
              <div className="lg:col-span-1">
                <Select value={selectedSport} onValueChange={setSelectedSport}>
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                    <SelectValue placeholder="All Sports" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="football">Football</SelectItem>
                    <SelectItem value="basketball">Basketball</SelectItem>
                    <SelectItem value="baseball">Baseball</SelectItem>
                    <SelectItem value="soccer">Soccer</SelectItem>
                    <SelectItem value="tennis">Tennis</SelectItem>
                    <SelectItem value="golf">Golf</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* All Leagues Dropdown */}
              <div className="lg:col-span-1">
                <Select value={selectedLeague} onValueChange={setSelectedLeague}>
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                    <SelectValue placeholder="All Leagues" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nfl">NFL</SelectItem>
                    <SelectItem value="nba">NBA</SelectItem>
                    <SelectItem value="mlb">MLB</SelectItem>
                    <SelectItem value="premier-league">Premier League</SelectItem>
                    <SelectItem value="champions-league">Champions League</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* All Venues Dropdown */}
              <div className="lg:col-span-1">
                <Select value={selectedVenue} onValueChange={setSelectedVenue}>
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                    <SelectValue placeholder="All Venues" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wembley">Wembley Stadium</SelectItem>
                    <SelectItem value="old-trafford">Old Trafford</SelectItem>
                    <SelectItem value="yankee-stadium">Yankee Stadium</SelectItem>
                    <SelectItem value="staples-center">Staples Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Picker */}
              <div className="lg:col-span-1">
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="dd/mm/yyyy"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Search Input */}
              <div className="lg:col-span-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Team, event, or..."
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-3 py-2 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* View All Fixtures Button */}
              <div className="lg:col-span-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  View All Fixtures
                </Button>
              </div>
            </div>
          </div>

          {/* Trending Tags */}
          <div className="flex flex-wrap justify-center gap-3">
            {trendingTags.map((tag, index) => (
              <button
                key={index}
                className="bg-gray-700/50 hover:bg-gray-600/50 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 backdrop-blur-sm border border-gray-600/30"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
