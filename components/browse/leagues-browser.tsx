"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import Link from "next/link"
import { getAllLeagues, getLeaguesByCountry, getLeaguesBySearch } from "@/lib/api/sports-db"
import type { League } from "@/lib/api/sports-db"

export function LeaguesBrowser() {
  const [leagues, setLeagues] = useState<League[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadLeagues()
  }, [])

  const loadLeagues = async () => {
    setIsLoading(true)
    try {
      const data = await getAllLeagues()
      setLeagues(data)
    } catch (error) {
      console.error("Failed to load leagues:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery) return

    setIsLoading(true)
    try {
      const data = await getLeaguesBySearch(searchQuery)
      setLeagues(data)
    } catch (error) {
      console.error("Failed to search leagues:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCountryChange = async (country: string) => {
    setSelectedCountry(country)
    if (!country) {
      loadLeagues()
      return
    }

    setIsLoading(true)
    try {
      const data = await getLeaguesByCountry(country)
      setLeagues(data)
    } catch (error) {
      console.error("Failed to load leagues by country:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search leagues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch} disabled={!searchQuery || isLoading}>
          Search
        </Button>
        <Select value={selectedCountry} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            <SelectItem value="England">England</SelectItem>
            <SelectItem value="Spain">Spain</SelectItem>
            <SelectItem value="Germany">Germany</SelectItem>
            <SelectItem value="Italy">Italy</SelectItem>
            <SelectItem value="France">France</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Card key={n} className="animate-pulse">
              <CardHeader className="h-40 bg-gray-200" />
              <CardContent className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leagues.map((league) => (
            <Link key={league.idLeague} href={`/leagues/${league.idLeague}`}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="relative h-40">
                  {league.strBanner ? (
                    <Image
                      src={league.strBanner || "/placeholder.svg"}
                      alt={league.strLeague}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                      <Image
                        src={league.strBadge || "/placeholder.svg"}
                        alt={league.strLeague}
                        width={120}
                        height={120}
                        className="object-contain"
                      />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-xl mb-2">{league.strLeague}</CardTitle>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{league.strSport}</span>
                    <span>{league.strCountry}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
