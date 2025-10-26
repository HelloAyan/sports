"use client"

import { useState, useEffect, useRef } from "react"
import { SearchIcon, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { useDebounce } from "@/lib/hooks/use-debounce"

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const debouncedSearchTerm = useDebounce(searchQuery, 500)

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Perform search when debounced search term changes
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchTerm.length < 3) {
        setSearchResults(null)
        setIsOpen(false)
        return
      }

      setIsSearching(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedSearchTerm)}`)
        if (!response.ok) throw new Error("Search failed")

        const data = await response.json()
        setSearchResults(data.results)
        setIsOpen(true)
      } catch (error) {
        console.error("Search error:", error)
        setSearchResults(null)
      } finally {
        setIsSearching(false)
      }
    }

    performSearch()
  }, [debouncedSearchTerm])

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults(null)
    setIsOpen(false)
  }

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Search teams, events, leagues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={clearSearch}>
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {isOpen && searchResults && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-[80vh] overflow-auto">
          <CardContent className="p-2">
            {/* Events */}
            {searchResults.events && searchResults.events.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 px-2">Events</h3>
                <div className="space-y-1">
                  {searchResults.events.slice(0, 5).map((event: any) => (
                    <Link
                      key={event.idEvent}
                      href={`/events/${event.idEvent}`}
                      className="block p-2 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">{event.strEvent}</div>
                          <div className="text-xs text-gray-500">{event.strLeague}</div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {event.strSport}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                  {searchResults.events.length > 5 && (
                    <Link
                      href={`/search?q=${encodeURIComponent(searchQuery)}&type=events`}
                      className="block text-center text-sm text-blue-600 hover:underline p-2"
                      onClick={() => setIsOpen(false)}
                    >
                      View all {searchResults.events.length} events
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Teams */}
            {searchResults.teams && searchResults.teams.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 px-2">Teams</h3>
                <div className="space-y-1">
                  {searchResults.teams.slice(0, 5).map((team: any) => (
                    <Link
                      key={team.idTeam}
                      href={`/teams/${team.idTeam}`}
                      className="block p-2 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center">
                        {team.strTeamBadge && (
                          <div className="w-8 h-8 mr-2 relative">
                            <Image
                              src={team.strTeamBadge || "/placeholder.svg"}
                              alt={team.strTeam}
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{team.strTeam}</div>
                          <div className="text-xs text-gray-500">{team.strLeague}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {searchResults.teams.length > 5 && (
                    <Link
                      href={`/search?q=${encodeURIComponent(searchQuery)}&type=teams`}
                      className="block text-center text-sm text-blue-600 hover:underline p-2"
                      onClick={() => setIsOpen(false)}
                    >
                      View all {searchResults.teams.length} teams
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Leagues */}
            {searchResults.leagues && searchResults.leagues.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2 px-2">Leagues</h3>
                <div className="space-y-1">
                  {searchResults.leagues.slice(0, 5).map((league: any) => (
                    <Link
                      key={league.idLeague}
                      href={`/leagues/${league.idLeague}`}
                      className="block p-2 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center">
                        {league.strBadge && (
                          <div className="w-8 h-8 mr-2 relative">
                            <Image
                              src={league.strBadge || "/placeholder.svg"}
                              alt={league.strLeague}
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{league.strLeague}</div>
                          <div className="text-xs text-gray-500">{league.strCountry}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {searchResults.leagues.length > 5 && (
                    <Link
                      href={`/search?q=${encodeURIComponent(searchQuery)}&type=leagues`}
                      className="block text-center text-sm text-blue-600 hover:underline p-2"
                      onClick={() => setIsOpen(false)}
                    >
                      View all {searchResults.leagues.length} leagues
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* No results */}
            {(!searchResults.events || searchResults.events.length === 0) &&
              (!searchResults.teams || searchResults.teams.length === 0) &&
              (!searchResults.leagues || searchResults.leagues.length === 0) && (
                <div className="p-4 text-center text-gray-500">No results found for "{searchQuery}"</div>
              )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
