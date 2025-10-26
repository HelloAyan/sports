"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { getPlayersBySearch } from "@/lib/api/sports-db"
import type { Player } from "@/lib/api/sports-db"

export function PlayersBrowser() {
  const [players, setPlayers] = useState<Player[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery) return

    setIsLoading(true)
    try {
      const data = await getPlayersBySearch(searchQuery)
      setPlayers(data)
    } catch (error) {
      console.error("Failed to search players:", error)
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
            placeholder="Search players..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <Card key={n} className="animate-pulse">
              <CardHeader className="h-48 bg-gray-200" />
              <CardContent className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {players.map((player) => (
            <Link key={player.idPlayer} href={`/players/${player.idPlayer}`}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="relative h-48">
                  {player.strThumb ? (
                    <Image
                      src={player.strThumb || "/placeholder.svg"}
                      alt={player.strPlayer}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                      <Image
                        src={player.strCutout || "/placeholder.svg"}
                        alt={player.strPlayer}
                        width={120}
                        height={120}
                        className="object-contain"
                      />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-xl mb-2">{player.strPlayer}</CardTitle>
                  <div className="flex flex-col text-sm text-gray-500">
                    <span>{player.strTeam}</span>
                    <span>{player.strPosition}</span>
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
