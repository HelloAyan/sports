"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { getTeamsBySearch } from "@/lib/api/sports-db"
import type { Team } from "@/lib/api/sports-db"

export function TeamsBrowser() {
  const [teams, setTeams] = useState<Team[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery) return

    setIsLoading(true)
    try {
      const data = await getTeamsBySearch(searchQuery)
      setTeams(data)
    } catch (error) {
      console.error("Failed to search teams:", error)
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
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch} disabled={!searchQuery || isLoading}>
          Search
        </Button>
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
          {teams.map((team) => (
            <Link key={team.idTeam} href={`/teams/${team.idTeam}`}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="relative h-40">
                  {team.strTeamBanner ? (
                    <Image
                      src={team.strTeamBanner || "/placeholder.svg"}
                      alt={team.strTeam}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                      <Image
                        src={team.strTeamBadge || "/placeholder.svg"}
                        alt={team.strTeam}
                        width={120}
                        height={120}
                        className="object-contain"
                      />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-xl mb-2">{team.strTeam}</CardTitle>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{team.strLeague}</span>
                    <span>{team.strStadium}</span>
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
