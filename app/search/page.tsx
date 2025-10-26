"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const initialType = searchParams.get("type") || "all"

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeTab, setActiveTab] = useState(initialType)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any>(null)

  // Perform search when component mounts or when search params change
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery, initialType as string)
    }
  }, [initialQuery, initialType])

  const performSearch = async (query: string, type: string) => {
    if (!query) return

    setIsSearching(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${type}`)
      if (!response.ok) throw new Error("Search failed")

      const data = await response.json()
      setSearchResults(data.results)
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults(null)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(searchQuery, activeTab)

    // Update URL with search params without refreshing the page
    const url = new URL(window.location.href)
    url.searchParams.set("q", searchQuery)
    url.searchParams.set("type", activeTab)
    window.history.pushState({}, "", url.toString())
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>

      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search teams, events, leagues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={isSearching}>
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <SearchIcon className="h-4 w-4 mr-2" />}
            Search
          </Button>
        </div>
      </form>

      {/* Results tabs */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Results</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="leagues">Leagues</TabsTrigger>
        </TabsList>

        {isSearching ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Searching...</span>
          </div>
        ) : searchResults ? (
          <>
            {/* All Results Tab */}
            <TabsContent value="all">
              {/* Events Section */}
              {searchResults.events && searchResults.events.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Events</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.events.map((event: any) => (
                      <Link key={event.idEvent} href={`/events/${event.idEvent}`}>
                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{event.strEvent}</h3>
                                <p className="text-sm text-gray-500">{event.strLeague}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {event.dateEvent} {event.strTime}
                                </p>
                              </div>
                              <Badge>{event.strSport}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Teams Section */}
              {searchResults.teams && searchResults.teams.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Teams</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {searchResults.teams.map((team: any) => (
                      <Link key={team.idTeam} href={`/teams/${team.idTeam}`}>
                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center">
                              {team.strTeamBadge && (
                                <div className="w-12 h-12 mr-3 relative">
                                  <Image
                                    src={team.strTeamBadge || "/placeholder.svg"}
                                    alt={team.strTeam}
                                    width={48}
                                    height={48}
                                    className="object-contain"
                                  />
                                </div>
                              )}
                              <div>
                                <h3 className="font-medium">{team.strTeam}</h3>
                                <p className="text-sm text-gray-500">{team.strLeague}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Leagues Section */}
              {searchResults.leagues && searchResults.leagues.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Leagues</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.leagues.map((league: any) => (
                      <Link key={league.idLeague} href={`/leagues/${league.idLeague}`}>
                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center">
                              {league.strBadge && (
                                <div className="w-12 h-12 mr-3 relative">
                                  <Image
                                    src={league.strBadge || "/placeholder.svg"}
                                    alt={league.strLeague}
                                    width={48}
                                    height={48}
                                    className="object-contain"
                                  />
                                </div>
                              )}
                              <div>
                                <h3 className="font-medium">{league.strLeague}</h3>
                                <p className="text-sm text-gray-500">{league.strCountry}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* No results */}
              {(!searchResults.events || searchResults.events.length === 0) &&
                (!searchResults.teams || searchResults.teams.length === 0) &&
                (!searchResults.leagues || searchResults.leagues.length === 0) && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No results found for "{initialQuery}"</p>
                  </div>
                )}
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events">
              {searchResults.events && searchResults.events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.events.map((event: any) => (
                    <Link key={event.idEvent} href={`/events/${event.idEvent}`}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{event.strEvent}</h3>
                              <p className="text-sm text-gray-500">{event.strLeague}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {event.dateEvent} {event.strTime}
                              </p>
                            </div>
                            <Badge>{event.strSport}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No events found for "{initialQuery}"</p>
                </div>
              )}
            </TabsContent>

            {/* Teams Tab */}
            <TabsContent value="teams">
              {searchResults.teams && searchResults.teams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {searchResults.teams.map((team: any) => (
                    <Link key={team.idTeam} href={`/teams/${team.idTeam}`}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center">
                            {team.strTeamBadge && (
                              <div className="w-12 h-12 mr-3 relative">
                                <Image
                                  src={team.strTeamBadge || "/placeholder.svg"}
                                  alt={team.strTeam}
                                  width={48}
                                  height={48}
                                  className="object-contain"
                                />
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium">{team.strTeam}</h3>
                              <p className="text-sm text-gray-500">{team.strLeague}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No teams found for "{initialQuery}"</p>
                </div>
              )}
            </TabsContent>

            {/* Leagues Tab */}
            <TabsContent value="leagues">
              {searchResults.leagues && searchResults.leagues.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.leagues.map((league: any) => (
                    <Link key={league.idLeague} href={`/leagues/${league.idLeague}`}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center">
                            {league.strBadge && (
                              <div className="w-12 h-12 mr-3 relative">
                                <Image
                                  src={league.strBadge || "/placeholder.svg"}
                                  alt={league.strLeague}
                                  width={48}
                                  height={48}
                                  className="object-contain"
                                />
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium">{league.strLeague}</h3>
                              <p className="text-sm text-gray-500">{league.strCountry}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No leagues found for "{initialQuery}"</p>
                </div>
              )}
            </TabsContent>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Enter a search term to find events, teams, and leagues</p>
          </div>
        )}
      </Tabs>
    </div>
  )
}
