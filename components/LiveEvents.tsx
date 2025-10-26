"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Clock,
  MapPin,
  Tv,
  RefreshCw,
  AlertCircle,
  Wifi,
  WifiOff,
  Trophy,
  ExternalLink,
  ChevronDown,
  Globe,
  Calendar,
  Share,
  Star,
  ShoppingBag,
  MessageCircle,
  Play,
  BookOpen,
  Headphones,
  Ticket,
  Map,
  Zap,
  Gift,
  Percent,
  Settings,
  Columns,
  Square,
  LayoutGrid,
  Github,
  Users,
  TrendingUp,
  Heart,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"

// Enhanced interfaces combining both components
interface SportsDBEvent {
  idEvent: string
  strEvent: string
  strLeague: string
  strSport: string
  strHomeTeam: string
  strAwayTeam: string
  idHomeTeam: string
  idAwayTeam: string
  dateEvent: string
  strTime: string
  strStatus: string
  strVenue: string | null
  strCity: string | null
  strCountry: string | null
  strTVStation: string | null
  intHomeScore: string | null
  intAwayScore: string | null
  strHomeTeamBadge: string | null
  strAwayTeamBadge: string | null
  // Enhanced fields from Component 2
  currentTime?: string
  events?: MatchEvent[]
  odds?: MatchOdds
  stats?: MatchStats
}

interface MatchEvent {
  time: string
  player: string
  type: "goal" | "yellow" | "substitution" | "red"
  team: string
}

interface MatchOdds {
  home: string
  draw: string
  away: string
}

interface MatchStats {
  possession: { home: number; away: number }
  shots: { home: number; away: number }
  corners: { home: number; away: number }
  fouls: { home: number; away: number }
}

interface LayoutSettings {
  showMicroAds: boolean
  showTVChannels: boolean
  showVenueInfo: boolean
  showActionButtons: boolean
  showMatchStats: boolean
  showLiveOdds: boolean
  showLiveEvents: boolean
  compactMode: boolean
  autoRefresh: boolean
  refreshInterval: number
  maxEvents: number
  theme: "light" | "dark" | "auto"
  tvDisplay: "dropdown" | "grid"
  layout: "grid" | "wide" | "single" | "match-center"
}

// Constants from both components
const SPORT_COLORS: Record<string, string> = {
  Football: "bg-gradient-to-r from-green-400 to-green-600",
  Soccer: "bg-gradient-to-r from-green-400 to-green-600",
  Basketball: "bg-gradient-to-r from-orange-400 to-orange-600",
  Cricket: "bg-gradient-to-r from-blue-400 to-blue-600",
  Tennis: "bg-gradient-to-r from-yellow-400 to-yellow-600",
  Rugby: "bg-gradient-to-r from-red-500 to-red-700",
  "American Football": "bg-gradient-to-r from-brown-400 to-brown-600",
  Baseball: "bg-gradient-to-r from-blue-500 to-blue-700",
  Golf: "bg-gradient-to-r from-green-500 to-green-700",
  "Formula 1": "bg-gradient-to-r from-red-400 to-red-600",
  Boxing: "bg-gradient-to-r from-purple-400 to-purple-600",
  "Ice Hockey": "bg-gradient-to-r from-blue-300 to-blue-500",
  Motorsport: "bg-gradient-to-r from-gray-600 to-gray-800",
}

const SPORT_EMOJIS: Record<string, string> = {
  Football: "⚽",
  Soccer: "⚽",
  Basketball: "🏀",
  Cricket: "🏏",
  Tennis: "🎾",
  Rugby: "🏉",
  "American Football": "🏈",
  Baseball: "⚾",
  Golf: "⛳",
  "Formula 1": "🏎️",
  Boxing: "🥊",
  "Ice Hockey": "🏒",
  Motorsport: "🏁",
}

const TV_CHANNEL_LOGOS: Record<string, string> = {
  "Sky Sports": "/placeholder.svg?height=24&width=60",
  "BT Sport": "/placeholder.svg?height=24&width=60",
  "TNT Sports": "/placeholder.svg?height=24&width=60",
  BBC: "/placeholder.svg?height=24&width=60",
  ITV: "/placeholder.svg?height=24&width=60",
  ESPN: "/placeholder.svg?height=24&width=60",
  "Fox Sports": "/placeholder.svg?height=24&width=60",
  NBC: "/placeholder.svg?height=24&width=60",
  "Amazon Prime": "/placeholder.svg?height=24&width=60",
  "Apple TV": "/placeholder.svg?height=24&width=60",
  "ESPN+": "/placeholder.svg?height=24&width=60",
  "Fox Sports 1": "/placeholder.svg?height=24&width=60",
  "Root Sports": "/placeholder.svg?height=24&width=60",
  "Spectrum Sports": "/placeholder.svg?height=24&width=60",
  TUDN: "/placeholder.svg?height=24&width=60",
  DAZN: "/placeholder.svg?height=24&width=60",
}

const CHANNEL_REGIONS: Record<string, string> = {
  "Sky Sports": "🇬🇧 UK",
  "BT Sport": "🇬🇧 UK",
  "TNT Sports": "🇬🇧 UK",
  BBC: "🇬🇧 UK",
  ITV: "🇬🇧 UK",
  ESPN: "🇺🇸 USA",
  "Fox Sports": "🇺🇸 USA",
  NBC: "🇺🇸 USA",
  "Amazon Prime": "🌍 Global",
  "Apple TV": "🇺🇸 USA",
  "ESPN+": "🇺🇸 USA",
  "Fox Sports 1": "🇺🇸 USA",
  "Root Sports": "🇺🇸 USA",
  "Spectrum Sports": "🇺🇸 USA",
  TUDN: "🇺🇸 USA",
  DAZN: "🌍 Global",
}

// Enhanced mock data combining features from both components
const enhancedMockData: SportsDBEvent[] = [
  {
    idEvent: "1",
    strEvent: "San Jose vs Austin FC",
    strLeague: "MLS - Major League Soccer",
    strSport: "Soccer",
    strHomeTeam: "San Jose Earthquakes",
    strAwayTeam: "Austin FC",
    idHomeTeam: "133739",
    idAwayTeam: "134847",
    dateEvent: "2025-07-09",
    strTime: "19:30:00",
    strStatus: "LIVE",
    strVenue: "PayPal Park",
    strCity: "San Jose",
    strCountry: "USA",
    strTVStation: "Apple TV, ESPN+, Fox Sports 1, TUDN",
    intHomeScore: "1",
    intAwayScore: "1",
    strHomeTeamBadge: null,
    strAwayTeamBadge: null,
    currentTime: "94'",
    events: [
      { time: "23'", player: "C. Espinoza", type: "goal", team: "SJ" },
      { time: "67'", player: "S. Driussi", type: "goal", team: "ATX" },
      { time: "78'", player: "J. Ebobisse", type: "yellow", team: "SJ" },
      { time: "85'", player: "D. Pereira", type: "substitution", team: "ATX" },
    ],
    odds: { home: "2.10", draw: "3.40", away: "3.20" },
    stats: {
      possession: { home: 52, away: 48 },
      shots: { home: 8, away: 6 },
      corners: { home: 4, away: 3 },
      fouls: { home: 12, away: 14 }
    },
  },
  {
    idEvent: "2",
    strEvent: "LA Galaxy vs Seattle Sounders",
    strLeague: "MLS - Major League Soccer",
    strSport: "Soccer",
    strHomeTeam: "LA Galaxy",
    strAwayTeam: "Seattle Sounders",
    idHomeTeam: "133741",
    idAwayTeam: "134849",
    dateEvent: "2025-07-09",
    strTime: "20:00:00",
    strStatus: "LIVE",
    strVenue: "Dignity Health Sports Park",
    strCity: "Los Angeles",
    strCountry: "USA",
    strTVStation: "Apple TV, TUDN, Spectrum Sports, DAZN",
    intHomeScore: "2",
    intAwayScore: "0",
    strHomeTeamBadge: null,
    strAwayTeamBadge: null,
    currentTime: "76'",
    events: [
      { time: "15'", player: "R. Puig", type: "goal", team: "LA" },
      { time: "43'", player: "D. Fagundez", type: "goal", team: "LA" },
      { time: "58'", player: "C. Roldan", type: "yellow", team: "SEA" },
      { time: "71'", player: "J. Morris", type: "substitution", team: "SEA" },
    ],
    odds: { home: "1.85", draw: "3.60", away: "4.20" },
    stats: {
      possession: { home: 58, away: 42 },
      shots: { home: 12, away: 4 },
      corners: { home: 6, away: 2 },
      fouls: { home: 8, away: 11 }
    },
  },
  {
    idEvent: "3",
    strEvent: "Golden State Warriors vs LA Lakers",
    strLeague: "NBA - National Basketball Association",
    strSport: "Basketball",
    strHomeTeam: "Golden State Warriors",
    strAwayTeam: "Los Angeles Lakers",
    idHomeTeam: "134672",
    idAwayTeam: "134673",
    dateEvent: "2025-07-09",
    strTime: "22:30:00",
    strStatus: "UPCOMING",
    strVenue: "Chase Center",
    strCity: "San Francisco",
    strCountry: "USA",
    strTVStation: "ESPN, ABC, TNT",
    intHomeScore: null,
    intAwayScore: null,
    strHomeTeamBadge: null,
    strAwayTeamBadge: null,
    currentTime: "Q1 10:32",
    events: [],
    odds: { home: "1.75", draw: "8.50", away: "2.10" },
    stats: {
      possession: { home: 0, away: 0 },
      shots: { home: 0, away: 0 },
      corners: { home: 0, away: 0 },
      fouls: { home: 0, away: 0 }
    },
  }
]

interface LiveEventsProps {
  layout?: "grid" | "wide" | "single" | "match-center"
  title?: string
}

export function LiveEvents({ layout = "grid", title = "Live Sports Events" }: LiveEventsProps) {
  const [events, setEvents] = useState<SportsDBEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>({
    showMicroAds: true,
    showTVChannels: true,
    showVenueInfo: true,
    showActionButtons: true,
    showMatchStats: true,
    showLiveOdds: true,
    showLiveEvents: true,
    compactMode: false,
    autoRefresh: true,
    refreshInterval: 120000,
    maxEvents: 6,
    theme: "light",
    tvDisplay: "dropdown",
    layout: layout,
  })

  const fetchLiveEvents = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Use enhanced mock data
      setTimeout(() => {
        setEvents(enhancedMockData)
        setLastUpdated(new Date())
        setIsOnline(true)
        setIsLoading(false)
      }, 1000)

    } catch (err) {
      console.error("Error fetching live events:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch live events")
      setIsOnline(false)
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLiveEvents()
    if (layoutSettings.autoRefresh) {
      const interval = setInterval(fetchLiveEvents, layoutSettings.refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchLiveEvents, layoutSettings.autoRefresh, layoutSettings.refreshInterval])

  const isEventLive = (event: SportsDBEvent): boolean => {
    const liveStatuses = ["LIVE", "IN PLAY", "1H", "2H", "HT", "ET", "PEN"]
    return liveStatuses.some((status) => event.strStatus?.toUpperCase().includes(status))
  }

  const formatTime = (timeStr: string): string => {
    if (!timeStr) return "TBA"
    return timeStr.substring(0, 5)
  }

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "TBA"
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getTeamInitials = (teamName: string): string => {
    return teamName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 3)
      .toUpperCase()
  }

  const TeamBadge = ({
    src,
    alt,
    teamName,
    size = 32,
  }: { src: string | null; alt: string; teamName: string; size?: number }) => {
    const [imageError, setImageError] = useState(false)

    if (!src || imageError) {
      return (
        <div
          className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
          style={{ width: size, height: size }}
        >
          <span style={{ fontSize: size * 0.3 }}>{getTeamInitials(teamName)}</span>
        </div>
      )
    }

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={size}
          height={size}
          className="object-contain rounded-full shadow-md"
          onError={() => setImageError(true)}
        />
      </div>
    )
  }

  // Enhanced TV Channels Component combining both approaches
  const TVChannelsDisplay = ({ tvStation }: { tvStation: string | null }) => {
    if (!layoutSettings.showTVChannels) return null

    const channels =
      tvStation && tvStation !== "TV info not available" && tvStation.trim() !== ""
        ? tvStation
          .split(",")
          .map((channel) => channel.trim())
          .filter(Boolean)
        : []

    if (channels.length === 0) {
      return (
        <div className="w-full">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200">
            <div className="flex items-center space-x-2">
              <Tv className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">TV Info Not Available</span>
            </div>
            <AlertCircle className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      )
    }

    if (layoutSettings.tvDisplay === "grid") {
      return (
        <div className="w-full p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <Tv className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-800">TV Channels</span>
            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
              {channels.length}
            </span>
          </div>
          <div className="text-xs text-blue-600 mb-3">Live Broadcasting</div>

          <div className="grid grid-cols-2 gap-2">
            {channels.slice(0, 4).map((channel, idx) => (
              <div key={idx} className="bg-white p-2 rounded-lg text-center border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center mb-1">
                  <Image
                    src={TV_CHANNEL_LOGOS[channel] || "/placeholder.svg?height=24&width=60"}
                    alt={channel}
                    width={24}
                    height={24}
                    className="object-contain rounded"
                  />
                </div>
                <div className="text-xs font-medium text-blue-800 truncate">{channel}</div>
                <div className="text-xs text-blue-600">{CHANNEL_REGIONS[channel] || "🌍 Global"}</div>
              </div>
            ))}
          </div>
          {channels.length > 4 && (
            <div className="text-center mt-2">
              <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-800">
                +{channels.length - 4} more channels
              </Button>
            </div>
          )}
        </div>
      )
    }

    // Default dropdown view
    const primaryChannel = channels[0]
    return (
      <div className="w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 cursor-pointer transition-all duration-300 border-2 border-purple-200 hover:border-purple-300">
              <div className="flex items-center space-x-2">
                <Tv className="h-4 w-4 text-purple-600" />
                <div className="flex items-center space-x-2">
                  <Image
                    src={TV_CHANNEL_LOGOS[primaryChannel] || "/placeholder.svg?height=24&width=60"}
                    alt={primaryChannel}
                    width={30}
                    height={18}
                    className="object-contain rounded border"
                  />
                  <span className="text-sm font-medium text-gray-700">{primaryChannel}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {channels.length > 1 && (
                  <Badge variant="secondary" className="text-xs px-2 py-1 bg-purple-200 text-purple-800">
                    +{channels.length - 1}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end">
            <div className="font-semibold text-sm p-3 border-b bg-gradient-to-r from-purple-50 to-pink-50 flex items-center space-x-2">
              <Globe className="h-4 w-4 text-purple-600" />
              <span>📺 TV Channels ({channels.length})</span>
            </div>
            <ScrollArea className="max-h-80">
              {channels.map((channel, index) => (
                <DropdownMenuItem key={index} className="flex items-center space-x-3 p-3 hover:bg-purple-50 cursor-pointer">
                  <Image
                    src={TV_CHANNEL_LOGOS[channel] || "/placeholder.svg?height=24&width=60"}
                    alt={channel}
                    width={40}
                    height={24}
                    className="object-contain rounded border"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium block">{channel}</span>
                    <div className="text-xs text-gray-500">{CHANNEL_REGIONS[channel] || "🌍 Global"}</div>
                  </div>
                  <ExternalLink className="h-3 w-3 text-gray-400" />
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  // Venue Info from Component 1
  const VenueInfo = ({ event }: { event: SportsDBEvent }) => {
    if (!layoutSettings.showVenueInfo) return null

    const venue = event.strVenue || "Stadium TBA"
    const location = [event.strCity, event.strCountry].filter(Boolean).join(", ") || "Location TBA"
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue} ${location}`)}`

    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 cursor-pointer transition-all duration-300 border-2 border-orange-200 hover:border-orange-300">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-orange-600" />
              <div>
                <span className="text-sm font-medium text-gray-700 block">{venue}</span>
                <span className="text-xs text-gray-500">{location}</span>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-orange-600" />
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-sm flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-orange-600" />
                {venue}
              </h4>
              <p className="text-sm text-muted-foreground">{location}</p>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" asChild className="flex-1 bg-transparent">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-1"
                >
                  <MapPin className="h-3 w-3" />
                  <span className="text-xs">View on Maps</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              🗺️ Click to open Google Maps with venue location
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    )
  }

  // Enhanced Match Center Layout (Combining both components)
  const MatchCenterLayout = ({ event }: { event: SportsDBEvent }) => {
    const isLive = isEventLive(event)
    const sportColor = SPORT_COLORS[event.strSport] || "bg-gradient-to-r from-gray-500 to-gray-700"
    const sportEmoji = SPORT_EMOJIS[event.strSport] || "🏆"

    return (
      <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
        {/* Header with live time and micro ads */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">{formatDate(event.dateEvent)}</span>
            </div>
            {isLive && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-red-300">LIVE</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-lg font-bold">{event.currentTime || formatTime(event.strTime)}</span>
            </div>
          </div>

          {layoutSettings.showMicroAds && (
            <div className="flex gap-2">
              <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md">
                BETTING <span className="text-xs">50% Bonus</span>
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md">
                GEAR <span className="text-xs">30% Off</span>
              </button>
              <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md">
                TRAVEL <span className="text-xs">Book Now</span>
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 min-h-[220px]">
          {/* Left Team Section */}
          <div className="col-span-2 bg-gradient-to-br from-purple-600 to-purple-700 text-white flex flex-col items-center justify-center relative">
            <div className="absolute top-4 left-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl">{sportEmoji}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs font-medium mb-2 bg-white/20 px-2 py-1 rounded-full">{event.strSport.toUpperCase()}</div>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-center">
                  <TeamBadge
                    src={event.strHomeTeamBadge}
                    alt={event.strHomeTeam}
                    teamName={event.strHomeTeam}
                    size={48}
                  />
                  <div className="text-xs font-medium mt-1">{getTeamInitials(event.strHomeTeam)}</div>
                </div>
                <div className="text-white/60 text-sm font-bold">VS</div>
                <div className="text-center">
                  <TeamBadge
                    src={event.strAwayTeamBadge}
                    alt={event.strAwayTeam}
                    teamName={event.strAwayTeam}
                    size={48}
                  />
                  <div className="text-xs font-medium mt-1">{getTeamInitials(event.strAwayTeam)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Match Info */}
          <div className="col-span-7 bg-gradient-to-br from-gray-50 to-blue-50 p-4">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LIVE MATCH CENTER
              </h3>
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">
                      {getTeamInitials(event.strHomeTeam)}
                    </span>
                    <span className="text-lg font-semibold text-gray-800">{event.strHomeTeam}</span>
                  </div>
                  <div className="text-4xl font-bold text-blue-600 bg-white px-4 py-2 rounded-lg shadow-inner">
                    {event.intHomeScore || "0"}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-400 mb-2">VS</div>
                  {isLive && <div className="w-3 h-3 bg-red-500 rounded-full mx-auto animate-pulse"></div>}
                </div>

                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 bg-green-500 rounded text-white text-xs flex items-center justify-center font-bold">
                      {getTeamInitials(event.strAwayTeam)}
                    </span>
                    <span className="text-lg font-semibold text-gray-800">{event.strAwayTeam}</span>
                  </div>
                  <div className="text-4xl font-bold text-green-600 bg-white px-4 py-2 rounded-lg shadow-inner">
                    {event.intAwayScore || "0"}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Tabs - All features combined */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              {/* Match Events from Component 2 */}
              {layoutSettings.showLiveEvents && (
                <div className="bg-blue-100 p-3 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center gap-1 mb-2">
                    <Play className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-blue-800">MATCH EVENTS</span>
                  </div>
                  <div className="space-y-2">
                    {(event.events || []).slice(0, 3).map((matchEvent, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white/80 p-2 rounded-lg">
                        <span className="text-xs font-bold text-gray-600 bg-gray-100 px-1 rounded">{matchEvent.time}</span>
                        <span className="text-xs text-gray-700 flex-1 truncate">{matchEvent.player}</span>
                        <span
                          className={`w-2 h-2 rounded-full ${matchEvent.type === "goal"
                              ? "bg-green-500"
                              : matchEvent.type === "yellow"
                                ? "bg-yellow-500"
                                : matchEvent.type === "red"
                                  ? "bg-red-500"
                                  : "bg-blue-500"
                            }`}
                        ></span>
                      </div>
                    ))}
                    {(event.events || []).length === 0 && (
                      <div className="text-xs text-gray-500 text-center py-2">No events yet</div>
                    )}
                  </div>
                </div>
              )}

              {/* Live Odds from Component 2 */}
              {layoutSettings.showLiveOdds && (
                <div className="bg-orange-100 p-3 rounded-xl border-2 border-orange-200">
                  <div className="flex items-center gap-1 mb-2">
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                    <span className="font-semibold text-orange-800">LIVE ODDS</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-orange-700">Match Winner</div>
                    <div className="flex justify-between text-xs bg-white/80 p-2 rounded-lg">
                      <span>{getTeamInitials(event.strHomeTeam)}</span>
                      <span className="font-bold text-green-600">{event.odds?.home || "2.00"}</span>
                    </div>
                    <div className="flex justify-between text-xs bg-white/80 p-2 rounded-lg">
                      <span>Draw</span>
                      <span className="font-bold text-blue-600">{event.odds?.draw || "3.50"}</span>
                    </div>
                    <div className="flex justify-between text-xs bg-white/80 p-2 rounded-lg">
                      <span>{getTeamInitials(event.strAwayTeam)}</span>
                      <span className="font-bold text-green-600">{event.odds?.away || "3.00"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Match Stats from Component 2 */}
              {layoutSettings.showMatchStats && (
                <div className="bg-purple-100 p-3 rounded-xl border-2 border-purple-200">
                  <div className="flex items-center gap-1 mb-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="font-semibold text-purple-800">MATCH STATS</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-purple-700">Possession</div>
                    <div className="flex justify-between text-xs bg-white/80 p-2 rounded-lg">
                      <span>{getTeamInitials(event.strHomeTeam)}</span>
                      <span className="font-bold">{event.stats?.possession.home || 50}%</span>
                    </div>
                    <div className="flex justify-between text-xs bg-white/80 p-2 rounded-lg">
                      <span>{getTeamInitials(event.strAwayTeam)}</span>
                      <span className="font-bold">{event.stats?.possession.away || 50}%</span>
                    </div>
                    <div className="flex justify-between text-xs bg-white/80 p-2 rounded-lg">
                      <span>Shots</span>
                      <span className="font-bold">{event.stats?.shots.home || 0}-{event.stats?.shots.away || 0}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right TV Channels & Venue Info */}
          <div className="col-span-3 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 border-l border-blue-200">
            <TVChannelsDisplay tvStation={event.strTVStation} />

            {/* Venue Info from Component 1 */}
            {layoutSettings.showVenueInfo && (
              <div className="mt-4">
                <VenueInfo event={event} />
              </div>
            )}

            {/* Micro Ads from Component 1 */}
            {layoutSettings.showMicroAds && (
              <div className="mt-4 p-3 bg-gradient-to-r from-gray-900 to-black rounded-lg">
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded p-2 text-white text-center">
                    <Zap className="h-3 w-3 mx-auto mb-1" />
                    <span className="text-xs font-bold block">BETTING</span>
                    <span className="text-xs opacity-90">50% Bonus</span>
                  </div>
                  <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded p-2 text-white text-center">
                    <Gift className="h-3 w-3 mx-auto mb-1" />
                    <span className="text-xs font-bold block">GEAR</span>
                    <span className="text-xs opacity-90">30% Off</span>
                  </div>
                  <div className="bg-gradient-to-r from-green-400 to-teal-500 rounded p-2 text-white text-center">
                    <Percent className="h-3 w-3 mx-auto mb-1" />
                    <span className="text-xs font-bold block">TRAVEL</span>
                    <span className="text-xs opacity-90">Book Now</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Action Buttons combining both components */}
        {layoutSettings.showActionButtons && (
          <div className="grid grid-cols-6 h-[55px] border-t border-gray-200">
            <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 text-sm font-medium transition-colors rounded-none h-full">
              <Ticket className="h-4 w-4" />
              <span className="text-xs font-bold">BUY TICKETS</span>
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center gap-2 text-sm font-medium transition-colors rounded-none h-full">
              <MapPin className="h-4 w-4" />
              <span className="text-xs font-bold">PLAN A TRIP</span>
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 text-sm font-medium transition-colors rounded-none h-full">
              <ShoppingBag className="h-4 w-4" />
              <span className="text-xs font-bold">SHOP</span>
            </Button>
            <Button className="bg-green-400 hover:bg-green-500 text-white flex items-center justify-center gap-2 text-sm font-medium transition-colors rounded-none h-full">
              <Heart className="h-4 w-4" />
              <span className="text-xs font-bold">ENGAGE</span>
            </Button>
            <Button className="bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center gap-2 text-sm font-medium transition-colors rounded-none h-full">
              <Tv className="h-4 w-4" />
              <span className="text-xs font-bold">WATCH LIVE/TV</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-lime-500 hover:bg-lime-600 text-white flex items-center justify-center gap-2 text-sm font-medium transition-colors rounded-none h-full">
                  <Headphones className="h-4 w-4" />
                  <span className="text-xs font-bold">MORE</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Read Articles
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Headphones className="h-4 w-4 mr-2" />
                  Listen to Podcast
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="h-4 w-4 mr-2" />
                  Share Event
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="h-4 w-4 mr-2" />
                  Add to Favorites
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    )
  }

  // Grid Layout from Component 1 (Enhanced)
  const GridEventCard = ({ event }: { event: SportsDBEvent }) => {
    const isLive = isEventLive(event)
    const sportColor = SPORT_COLORS[event.strSport] || "bg-gradient-to-r from-gray-500 to-gray-700"
    const sportEmoji = SPORT_EMOJIS[event.strSport] || "🏆"

    return (
      <Card className="hover:shadow-2xl transition-all duration-300 group border-2 border-gray-200 hover:border-blue-300 bg-white overflow-hidden h-full">
        <CardHeader className="pb-3 bg-gradient-to-br from-blue-50 to-purple-50 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="font-semibold truncate group-hover:text-blue-600 transition-colors text-lg">
                {event.strLeague}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xl">{sportEmoji}</span>
                <p className="text-muted-foreground text-sm">{event.strSport}</p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              {isLive && (
                <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse shadow-lg border-0 text-xs">
                  🔴 LIVE
                </Badge>
              )}
              <div className={`rounded-full ${sportColor} shadow-lg animate-pulse w-4 h-4`}></div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-4">
          {/* Enhanced Teams Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 p-3">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <TeamBadge src={event.strHomeTeamBadge} alt={event.strHomeTeam} teamName={event.strHomeTeam} />
                <span className="font-medium truncate bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent text-sm">
                  {event.strHomeTeam}
                </span>
              </div>
              {event.intHomeScore !== null && (
                <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent px-2 py-1 rounded-full bg-white shadow-md border-2 border-blue-200 text-lg">
                  {event.intHomeScore}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 p-3">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <TeamBadge src={event.strAwayTeamBadge} alt={event.strAwayTeam} teamName={event.strAwayTeam} />
                <span className="font-medium truncate bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent text-sm">
                  {event.strAwayTeam}
                </span>
              </div>
              {event.intAwayScore !== null && (
                <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent px-2 py-1 rounded-full bg-white shadow-md border-2 border-purple-200 text-lg">
                  {event.intAwayScore}
                </span>
              )}
            </div>
          </div>

          {/* Match Details */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Time:</span>
              </div>
              <span className="font-semibold text-gray-800">{formatTime(event.strTime)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Date:</span>
              </div>
              <span className="font-semibold text-gray-800">{formatDate(event.dateEvent)}</span>
            </div>
          </div>

          {/* Live Events from Component 2 */}
          {layoutSettings.showLiveEvents && event.events && event.events.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center space-x-1 mb-2">
                <Play className="h-3 w-3 text-blue-600" />
                <span className="text-xs font-semibold text-blue-800">RECENT EVENTS</span>
              </div>
              <div className="space-y-1">
                {event.events.slice(0, 2).map((matchEvent, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs">
                    <span className="text-gray-600 font-medium">{matchEvent.time}</span>
                    <span className="text-gray-700 truncate flex-1">{matchEvent.player}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${matchEvent.type === "goal"
                          ? "bg-green-500"
                          : matchEvent.type === "yellow"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }`}
                    ></span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Venue Information */}
          {layoutSettings.showVenueInfo && (
            <div className="rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 transition-all duration-300 p-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-orange-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{event.strVenue || "Venue: N/A"}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {event.strCity || "City: N/A"}, {event.strCountry || "Country: N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TV Channels */}
          {layoutSettings.showTVChannels && (
            <TVChannelsDisplay tvStation={event.strTVStation} />
          )}

          {/* Quick Stats from Component 2 */}
          {layoutSettings.showMatchStats && event.stats && (
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-2 text-center">
                <div className="font-bold text-blue-600">{event.stats.possession.home}%</div>
                <div className="text-gray-600">Possession</div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-2 text-center">
                <div className="font-bold text-green-600">{event.stats.shots.home}</div>
                <div className="text-gray-600">Shots</div>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-2 text-center">
                <div className="font-bold text-orange-600">{event.stats.corners.home}</div>
                <div className="text-gray-600">Corners</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Settings Panel (Enhanced with new options)
  const LayoutSettingsPanel = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Card className="bg-white shadow-2xl border-0">
            <CardHeader className="text-center pb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-bold mb-2">Live Events Settings</CardTitle>
              <p className="text-blue-100">Configure your sports viewing experience</p>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              {/* Layout Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">Layout & Display</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Layout Type</Label>
                    <Select
                      value={layoutSettings.layout}
                      onValueChange={(value: any) => setLayoutSettings(prev => ({ ...prev, layout: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Grid Layout</SelectItem>
                        <SelectItem value="wide">Wide Layout</SelectItem>
                        <SelectItem value="single">Single Layout</SelectItem>
                        <SelectItem value="match-center">Match Center</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">TV Display</Label>
                    <Select
                      value={layoutSettings.tvDisplay}
                      onValueChange={(value: "dropdown" | "grid") => setLayoutSettings(prev => ({ ...prev, tvDisplay: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dropdown">Dropdown View</SelectItem>
                        <SelectItem value="grid">Grid View</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Maximum Events</Label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={layoutSettings.maxEvents}
                    onChange={(e) => setLayoutSettings(prev => ({ ...prev, maxEvents: Number.parseInt(e.target.value) || 6 }))}
                  />
                </div>
              </div>

              <Separator />

              {/* Feature Toggles */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">Features</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={layoutSettings.showTVChannels}
                      onCheckedChange={(checked) => setLayoutSettings(prev => ({ ...prev, showTVChannels: checked }))}
                    />
                    <Label>TV Channels</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={layoutSettings.showVenueInfo}
                      onCheckedChange={(checked) => setLayoutSettings(prev => ({ ...prev, showVenueInfo: checked }))}
                    />
                    <Label>Venue Info</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={layoutSettings.showMatchStats}
                      onCheckedChange={(checked) => setLayoutSettings(prev => ({ ...prev, showMatchStats: checked }))}
                    />
                    <Label>Match Stats</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={layoutSettings.showLiveOdds}
                      onCheckedChange={(checked) => setLayoutSettings(prev => ({ ...prev, showLiveOdds: checked }))}
                    />
                    <Label>Live Odds</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={layoutSettings.showLiveEvents}
                      onCheckedChange={(checked) => setLayoutSettings(prev => ({ ...prev, showLiveEvents: checked }))}
                    />
                    <Label>Live Events</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={layoutSettings.showActionButtons}
                      onCheckedChange={(checked) => setLayoutSettings(prev => ({ ...prev, showActionButtons: checked }))}
                    />
                    <Label>Action Buttons</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={layoutSettings.showMicroAds}
                      onCheckedChange={(checked) => setLayoutSettings(prev => ({ ...prev, showMicroAds: checked }))}
                    />
                    <Label>Micro Ads</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={layoutSettings.autoRefresh}
                      onCheckedChange={(checked) => setLayoutSettings(prev => ({ ...prev, autoRefresh: checked }))}
                    />
                    <Label>Auto Refresh</Label>
                  </div>
                </div>
              </div>

              {layoutSettings.autoRefresh && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Refresh Interval</Label>
                  <Select
                    value={layoutSettings.refreshInterval.toString()}
                    onValueChange={(value) => setLayoutSettings(prev => ({ ...prev, refreshInterval: Number.parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30000">30 seconds</SelectItem>
                      <SelectItem value="60000">1 minute</SelectItem>
                      <SelectItem value="120000">2 minutes</SelectItem>
                      <SelectItem value="300000">5 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Apply Settings
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Loading skeleton
  const SkeletonLoader = () => {
    const skeletonCount = layout === "wide" ? 4 : layout === "single" ? 2 : layout === "match-center" ? 1 : 6

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>

        <div className={
          layout === "grid" ? "grid gap-6 md:grid-cols-3" :
            layout === "wide" ? "grid gap-6 md:grid-cols-2" :
              layout === "single" ? "grid gap-6 grid-cols-1" :
                "grid gap-6 grid-cols-1"
        }>
          {[...Array(skeletonCount)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow border border-gray-200 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-100 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Show settings panel if requested
  if (showSettings) {
    return <LayoutSettingsPanel />
  }

  if (isLoading && events.length === 0) {
    return <SkeletonLoader />
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {title}
              </h2>
              <p className="text-sm text-gray-600">Live sports events and match centers</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-500 animate-pulse" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            {lastUpdated && (
              <span className="text-sm text-gray-500">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(true)}
            className="flex items-center space-x-2 bg-white hover:bg-gray-50 border-2 border-purple-200"
          >
            <Settings className="h-4 w-4 text-purple-600" />
            <span className="text-purple-600 font-medium">Settings</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchLiveEvents}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-white hover:bg-gray-50 border-2 border-blue-200"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin text-blue-600" : "text-blue-600"}`} />
            <span className="text-blue-600 font-medium">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 animate-pulse" />
            <div className="flex-1">
              <p className="text-yellow-800 font-medium">Connection Issue</p>
              <p className="text-yellow-700 text-sm">{error}</p>
              {events.length > 0 && (
                <p className="text-yellow-600 text-sm mt-1">Showing cached data</p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLiveEvents}
              className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Events Display */}
      {events.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-blue-50">
          <CardContent className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 bg-gradient-to-br from-gray-700 to-gray-900 bg-clip-text text-transparent">
              No Live Events Available
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              There are currently no live sports events. Please check back later or try refreshing the page.
            </p>
            <Button
              onClick={fetchLiveEvents}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Events
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={
          layoutSettings.layout === "grid" ? "grid gap-6 md:grid-cols-3" :
            layoutSettings.layout === "wide" ? "grid gap-6 md:grid-cols-2" :
              layoutSettings.layout === "single" ? "grid gap-6 grid-cols-1" :
                "grid gap-6 grid-cols-1"
        }>
          {events.slice(0, layoutSettings.maxEvents).map((event) => {
            if (layoutSettings.layout === "match-center") {
              return <MatchCenterLayout key={event.idEvent} event={event} />
            } else {
              return <GridEventCard key={event.idEvent} event={event} />
            }
          })}
        </div>
      )}
    </div>
  )
}