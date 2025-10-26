"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  PlayCircle,
  RefreshCw,
  X,
  Volume2,
  VolumeX,
  Maximize2,
  Clock,
  Calendar,
  AlertCircle,
  Trophy,
  Eye,
  TrendingUp,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface SportsDBHighlight {
  idEvent: string
  strEvent: string
  strLeague: string
  strSport: string
  strHomeTeam: string
  strAwayTeam: string
  dateEvent: string
  strTime: string
  strVideo: string
  strThumb: string
  strVideoTitle: string
  strVideoDescription: string
  strHomeTeamBadge?: string
  strAwayTeamBadge?: string
  intHomeScore?: string
  intAwayScore?: string
  strStatus?: string
  strVenue?: string
  youtubeVideoId: string
  viewCount?: string
  publishedAt?: string
  channelTitle?: string
}

interface ApiResponse {
  success: boolean
  highlights: SportsDBHighlight[]
  total: number
  error?: string
  timestamp: string
  source: string
  nextUpdate?: string
}

const SPORT_COLORS: Record<string, string> = {
  Soccer: "bg-green-600 text-white",
  Football: "bg-green-600 text-white",
  Basketball: "bg-orange-600 text-white",
  "American Football": "bg-amber-700 text-white",
  Baseball: "bg-blue-600 text-white",
  "Ice Hockey": "bg-cyan-600 text-white",
  Tennis: "bg-yellow-600 text-black",
  Golf: "bg-emerald-600 text-white",
  Boxing: "bg-purple-600 text-white",
  "Formula 1": "bg-red-600 text-white",
  Cricket: "bg-indigo-600 text-white",
  Rugby: "bg-rose-600 text-white",
}

export function MatchHighlights() {
  const [highlights, setHighlights] = useState<SportsDBHighlight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [nextUpdate, setNextUpdate] = useState<Date | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<SportsDBHighlight | null>(null)
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(true)

  const fetchHighlights = useCallback(async (forceRefresh = false) => {
    try {
      setIsLoading(true)
      setError(null)

      console.log("[MatchHighlights] Fetching highlights...")

      const url = `/api/highlights?limit=8${forceRefresh ? "&refresh=true" : ""}`
      const response = await fetch(url, {
        cache: forceRefresh ? "no-store" : "default",
        headers: {
          "Cache-Control": forceRefresh ? "no-cache" : "default",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()

      if (data.success) {
        setHighlights(data.highlights)
        setLastUpdated(new Date())
        if (data.nextUpdate) {
          setNextUpdate(new Date(data.nextUpdate))
        }
        console.log(`[MatchHighlights] Loaded ${data.highlights.length} highlights from ${data.source}`)
      } else {
        throw new Error(data.error || "Failed to fetch highlights")
      }
    } catch (err) {
      console.error("[MatchHighlights] Error fetching highlights:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch highlights")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHighlights()

    // Auto-refresh every hour (3,600,000 ms)
    const interval = setInterval(() => fetchHighlights(), 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [fetchHighlights])

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    } catch {
      return "Recent"
    }
  }

  const formatTime = (timeStr: string): string => {
    if (!timeStr) return ""
    return timeStr.substring(0, 5) // HH:MM format
  }

  const formatViewCount = (viewCount?: string): string => {
    if (!viewCount) return ""
    const count = Number.parseInt(viewCount)
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`
    }
    return `${count} views`
  }

  const getTimeAgo = (publishedAt?: string): string => {
    if (!publishedAt) return ""
    const now = new Date()
    const published = new Date(publishedAt)
    const diffMs = now.getTime() - published.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffHours < 1) return "Just now"
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  const getSportColor = (sport: string): string => {
    return SPORT_COLORS[sport] || "bg-gray-600 text-white"
  }

  const getVideoEmbedUrl = (highlight: SportsDBHighlight): string => {
    return `https://www.youtube.com/embed/${highlight.youtubeVideoId}?autoplay=1&mute=${isMuted ? 1 : 0}&rel=0&modestbranding=1&controls=1`
  }

  const getVideoPreviewUrl = (highlight: SportsDBHighlight): string => {
    return `https://www.youtube.com/embed/${highlight.youtubeVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${highlight.youtubeVideoId}&rel=0&modestbranding=1&showinfo=0`
  }

  const openVideoModal = (highlight: SportsDBHighlight) => {
    setSelectedVideo(highlight)
  }

  const closeVideoModal = () => {
    setSelectedVideo(null)
  }

  const getScoreDisplay = (highlight: SportsDBHighlight): string => {
    if (highlight.intHomeScore && highlight.intAwayScore) {
      return `${highlight.intHomeScore} - ${highlight.intAwayScore}`
    }
    return ""
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement
    // Try different thumbnail sizes if maxresdefault fails
    if (target.src.includes("maxresdefault")) {
      target.src = target.src.replace("maxresdefault", "hqdefault")
    } else if (target.src.includes("hqdefault")) {
      target.src = target.src.replace("hqdefault", "mqdefault")
    } else {
      target.src = `/placeholder.svg?height=180&width=320&query=${encodeURIComponent("video thumbnail")}`
    }
  }

  if (isLoading && highlights.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Match Centre YouTube Highlights</h2>
            <Badge className="bg-red-600 text-white animate-pulse">
              <TrendingUp className="w-3 h-3 mr-1" />
              TRENDING
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300 animate-pulse">
              Loading trending highlights...
            </span>
          </div>
        </div>

        {/* 2x4 Grid Layout for Loading */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <Card
              key={index}
              className="animate-pulse border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gray-300 dark:bg-gray-600 animate-pulse rounded-t-lg"></div>
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3 animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Match Centre YouTube Highlights</h2>
          <Badge className="bg-red-600 text-white">
            <TrendingUp className="w-3 h-3 mr-1" />
            TRENDING
          </Badge>
        </div>

        <div className="flex items-center space-x-4">
          {lastUpdated && (
            <div className="flex flex-col items-end text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
                <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
              {nextUpdate && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Next update: {nextUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchHighlights(true)}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white transition-all duration-300"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 animate-pulse" />
            <div>
              <p className="text-red-800 dark:text-red-200 font-medium">Failed to load trending highlights</p>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              {highlights.length > 0 && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">Showing cached data</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Highlights Grid - 2x4 Layout */}
      {highlights.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <PlayCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              No Trending Highlights Available
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              No trending match highlights are currently available from recent finished events.
            </p>
            <Button
              onClick={() => fetchHighlights(true)}
              variant="outline"
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {highlights.slice(0, 8).map((highlight) => {
            const sportColor = getSportColor(highlight.strSport)
            const isHovered = hoveredVideo === highlight.idEvent
            const score = getScoreDisplay(highlight)

            return (
              <Card
                key={highlight.idEvent}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 hover:border-gray-300 dark:hover:border-gray-600 overflow-hidden"
                onMouseEnter={() => setHoveredVideo(highlight.idEvent)}
                onMouseLeave={() => setHoveredVideo(null)}
                onClick={() => openVideoModal(highlight)}
              >
                <CardContent className="p-0">
                  {/* Video Thumbnail/Preview */}
                  <div className="relative aspect-video overflow-hidden">
                    {isHovered ? (
                      // Live preview on hover
                      <iframe
                        src={getVideoPreviewUrl(highlight)}
                        className="w-full h-full object-cover"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen={false}
                        style={{ pointerEvents: "none" }}
                      />
                    ) : (
                      // YouTube thumbnail
                      <Image
                        src={highlight.strThumb || "/placeholder.svg"}
                        alt={highlight.strVideoTitle}
                        fill
                        className="object-cover transition-transform duration-300"
                        onError={handleImageError}
                        priority={false}
                        unoptimized={true}
                      />
                    )}

                    {/* Overlay Controls */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors duration-300">
                      {!isHovered && (
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <PlayCircle className="w-6 h-6 text-white fill-current" />
                        </div>
                      )}
                    </div>

                    {/* Sport Badge */}
                    <div className="absolute top-2 left-2 z-10">
                      <Badge className={`${sportColor} text-xs px-2 py-1 shadow-lg font-medium`}>
                        {highlight.strSport}
                      </Badge>
                    </div>

                    {/* Score Badge */}
                    {score && (
                      <div className="absolute top-2 right-2 z-10">
                        <Badge className="bg-black/70 text-white text-xs px-2 py-1 shadow-lg font-bold">{score}</Badge>
                      </div>
                    )}

                    {/* View Count */}
                    {highlight.viewCount && (
                      <div className="absolute bottom-2 left-2 z-10">
                        <Badge className="bg-black/70 text-white text-xs px-2 py-1 shadow-lg">
                          <Eye className="w-3 h-3 mr-1" />
                          {formatViewCount(highlight.viewCount)}
                        </Badge>
                      </div>
                    )}

                    {/* Full Screen Icon */}
                    <div className="absolute bottom-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                        <Maximize2 className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 space-y-2">
                    {/* Title */}
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                      {highlight.strVideoTitle}
                    </h3>

                    {/* Channel and Time */}
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                      <span className="truncate max-w-[100px] font-medium">{highlight.channelTitle}</span>
                      <span>{getTimeAgo(highlight.publishedAt)}</span>
                    </div>

                    {/* League and Date */}
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                      <Link
                        href={`/leagues/${encodeURIComponent(highlight.strLeague)}`}
                        className="hover:text-gray-900 dark:hover:text-white hover:underline transition-colors duration-300 truncate max-w-[100px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {highlight.strLeague}
                      </Link>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(highlight.dateEvent)}</span>
                      </div>
                    </div>

                    {/* Teams */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Image
                          src={highlight.strHomeTeamBadge || "/placeholder.svg?height=16&width=16"}
                          alt={highlight.strHomeTeam}
                          width={16}
                          height={16}
                          className="rounded-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = `/placeholder.svg?height=16&width=16&query=${encodeURIComponent(highlight.strHomeTeam + " logo")}`
                          }}
                        />
                        <span className="text-xs text-gray-700 dark:text-gray-200 truncate max-w-[50px] font-medium">
                          {highlight.strHomeTeam}
                        </span>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">VS</span>
                        {score && <span className="text-xs text-gray-600 dark:text-gray-300 font-bold">{score}</span>}
                      </div>

                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-700 dark:text-gray-200 truncate max-w-[50px] font-medium">
                          {highlight.strAwayTeam}
                        </span>
                        <Image
                          src={highlight.strAwayTeamBadge || "/placeholder.svg?height=16&width=16"}
                          alt={highlight.strAwayTeam}
                          width={16}
                          height={16}
                          className="rounded-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = `/placeholder.svg?height=16&width=16&query=${encodeURIComponent(highlight.strAwayTeam + " logo")}`
                          }}
                        />
                      </div>
                    </div>

                    {/* Status and Time */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      {highlight.strStatus && (
                        <div className="flex items-center space-x-1">
                          <Trophy className="w-3 h-3" />
                          <span>{highlight.strStatus}</span>
                        </div>
                      )}
                      {highlight.strTime && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(highlight.strTime)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={closeVideoModal}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black">
          <DialogHeader className="absolute top-4 left-4 z-50">
            <DialogTitle className="text-white text-lg font-semibold">{selectedVideo?.strVideoTitle}</DialogTitle>
          </DialogHeader>

          {/* Close and Controls */}
          <div className="absolute top-4 right-4 z-50 flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="text-white hover:bg-white/20"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={closeVideoModal} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Video Player */}
          {selectedVideo && (
            <div className="relative aspect-video">
              <iframe
                src={getVideoEmbedUrl(selectedVideo)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Video Info */}
          <div className="p-4 bg-gray-900 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Badge className={`${getSportColor(selectedVideo?.strSport || "")} text-xs px-2 py-1`}>
                  {selectedVideo?.strSport}
                </Badge>
                <span className="text-sm text-gray-300">{selectedVideo?.strLeague}</span>
                {selectedVideo && getScoreDisplay(selectedVideo) && (
                  <Badge className="bg-green-600 text-white text-xs px-2 py-1">
                    Final: {getScoreDisplay(selectedVideo)}
                  </Badge>
                )}
                {selectedVideo?.viewCount && (
                  <Badge className="bg-blue-600 text-white text-xs px-2 py-1">
                    <Eye className="w-3 h-3 mr-1" />
                    {formatViewCount(selectedVideo.viewCount)}
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-300">
                <Calendar className="w-4 h-4" />
                <span>{selectedVideo && formatDate(selectedVideo.dateEvent)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <Image
                  src={selectedVideo?.strHomeTeamBadge || "/placeholder.svg?height=24&width=24"}
                  alt={selectedVideo?.strHomeTeam || ""}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="font-medium">{selectedVideo?.strHomeTeam}</span>
                {selectedVideo?.intHomeScore && (
                  <span className="text-green-400 font-bold text-lg">{selectedVideo.intHomeScore}</span>
                )}
              </div>

              <span className="text-gray-400 font-bold">VS</span>

              <div className="flex items-center space-x-2">
                {selectedVideo?.intAwayScore && (
                  <span className="text-green-400 font-bold text-lg">{selectedVideo.intAwayScore}</span>
                )}
                <span className="font-medium">{selectedVideo?.strAwayTeam}</span>
                <Image
                  src={selectedVideo?.strAwayTeamBadge || "/placeholder.svg?height=24&width=24"}
                  alt={selectedVideo?.strAwayTeam || ""}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              </div>
            </div>

            <div className="text-center text-sm text-gray-400 mt-2 space-y-1">
              {selectedVideo?.strVenue && <div>Venue: {selectedVideo.strVenue}</div>}
              {selectedVideo?.channelTitle && (
                <div>
                  Channel: {selectedVideo.channelTitle} • {getTimeAgo(selectedVideo.publishedAt)}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer Info */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-300">
        Showing {Math.min(highlights.length, 8)} trending highlights from recently finished events • Data from
        TheSportsDB.com + YouTube • Updates hourly
        {lastUpdated && ` • Last updated: ${lastUpdated.toLocaleTimeString()}`}
      </div>
    </div>
  )
}
