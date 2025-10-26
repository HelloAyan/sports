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
}

interface ApiResponse {
  success: boolean
  events: SportsDBEvent[]
  total: number
  error?: string
  timestamp?: string
  source?: string
}

interface LayoutSettings {
  showMicroAds: boolean
  showTVChannels: boolean
  showVenueInfo: boolean
  showActionButtons: boolean
  compactMode: boolean
  autoRefresh: boolean
  refreshInterval: number
  maxEvents: number
  theme: "light" | "dark" | "auto"
}

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
  "Sky Sports Main Event": "/placeholder.svg?height=24&width=60",
  "Sky Sports Premier League": "/placeholder.svg?height=24&width=60",
  "Sky Sports Football": "/placeholder.svg?height=24&width=60",
  "Sky Sports Arena": "/placeholder.svg?height=24&width=60",
  "Sky Sports NFL": "/placeholder.svg?height=24&width=60",
  "BT Sport": "/placeholder.svg?height=24&width=60",
  "TNT Sports": "/placeholder.svg?height=24&width=60",
  BBC: "/placeholder.svg?height=24&width=60",
  "BBC Sport": "/placeholder.svg?height=24&width=60",
  ITV: "/placeholder.svg?height=24&width=60",
  ESPN: "/placeholder.svg?height=24&width=60",
  "ESPN Deportes": "/placeholder.svg?height=24&width=60",
  "Fox Sports": "/placeholder.svg?height=24&width=60",
  NBC: "/placeholder.svg?height=24&width=60",
  "NBC Sports": "/placeholder.svg?height=24&width=60",
  CBS: "/placeholder.svg?height=24&width=60",
  "CBS Sports": "/placeholder.svg?height=24&width=60",
  "CBS Sports Network": "/placeholder.svg?height=24&width=60",
  ABC: "/placeholder.svg?height=24&width=60",
  TNT: "/placeholder.svg?height=24&width=60",
  "NBA TV": "/placeholder.svg?height=24&width=60",
  "Amazon Prime": "/placeholder.svg?height=24&width=60",
  "Amazon Prime Video": "/placeholder.svg?height=24&width=60",
  Netflix: "/placeholder.svg?height=24&width=60",
  "Paramount+": "/placeholder.svg?height=24&width=60",
  DAZN: "/placeholder.svg?height=24&width=60",
  Eurosport: "/placeholder.svg?height=24&width=60",
  "beIN Sports": "/placeholder.svg?height=24&width=60",
  "Canal+": "/placeholder.svg?height=24&width=60",
  "Canal+ Sport": "/placeholder.svg?height=24&width=60",
  "Movistar LaLiga": "/placeholder.svg?height=24&width=60",
  SuperSport: "/placeholder.svg?height=24&width=60",
  "SuperSport Premier League": "/placeholder.svg?height=24&width=60",
  "Star Sports": "/placeholder.svg?height=24&width=60",
  TSN: "/placeholder.svg?height=24&width=60",
  Sportsnet: "/placeholder.svg?height=24&width=60",
  CTV: "/placeholder.svg?height=24&width=60",
}

const CHANNEL_REGIONS: Record<string, string> = {
  "Sky Sports": "🇬🇧 UK",
  "Sky Sports Main Event": "🇬🇧 UK",
  "Sky Sports Premier League": "🇬🇧 UK",
  "Sky Sports Football": "🇬🇧 UK",
  "Sky Sports Arena": "🇬🇧 UK",
  "Sky Sports NFL": "🇬🇧 UK",
  "BT Sport": "🇬🇧 UK",
  "TNT Sports": "🇬🇧 UK",
  BBC: "🇬🇧 UK",
  "BBC Sport": "🇬🇧 UK",
  ITV: "🇬🇧 UK",
  ESPN: "🇺🇸 USA",
  "ESPN Deportes": "🇺🇸 USA",
  "Fox Sports": "🇺🇸 USA",
  NBC: "🇺🇸 USA",
  "NBC Sports": "🇺🇸 USA",
  CBS: "🇺🇸 USA",
  "CBS Sports": "🇺🇸 USA",
  "CBS Sports Network": "🇺🇸 USA",
  ABC: "🇺🇸 USA",
  TNT: "🇺🇸 USA",
  "NBA TV": "🇺🇸 USA",
  "Amazon Prime": "🌍 Global",
  "Amazon Prime Video": "🌍 Global",
  Netflix: "🌍 Global",
  "Paramount+": "🌍 Global",
  DAZN: "🌍 Global",
  Eurosport: "🇪🇺 Europe",
  "beIN Sports": "🌍 Global",
  "Canal+": "🇫🇷 France",
  "Canal+ Sport": "🇫🇷 France",
  "Movistar LaLiga": "🇪🇸 Spain",
  SuperSport: "🌍 Africa",
  "SuperSport Premier League": "🌍 Africa",
  "Star Sports": "🇮🇳 India",
  TSN: "🇨🇦 Canada",
  Sportsnet: "🇨🇦 Canada",
  CTV: "🇨🇦 Canada",
}

interface LiveEventsProps {
  layout?: "grid" | "wide" | "single"
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
    compactMode: false,
    autoRefresh: true,
    refreshInterval: 120000,
    maxEvents: 6,
    theme: "light",
  })

  const fetchLiveEvents = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/live-events?limit=12", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()

      if (data.success) {
        setEvents(data.events)
        setLastUpdated(new Date())
        setIsOnline(true)
        console.log(`Loaded ${data.events.length} events from ${data.source || "API"}`)
      } else {
        throw new Error(data.error || "Failed to fetch events")
      }
    } catch (err) {
      console.error("Error fetching live events:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch live events")
      setIsOnline(false)

      if (events.length === 0) {
        try {
          const fallbackResponse = await fetch("/api/events/today?limit=12")
          if (fallbackResponse.ok) {
            const fallbackData: ApiResponse = await fallbackResponse.json()
            if (fallbackData.success) {
              setEvents(fallbackData.events)
              setLastUpdated(new Date())
              console.log(`Loaded ${fallbackData.events.length} fallback events`)
            }
          }
        } catch (fallbackErr) {
          console.error("Fallback fetch also failed:", fallbackErr)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }, [events.length])

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

  const TVChannelsDropdown = ({ tvStation }: { tvStation: string | null }) => {
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
                    src={
                      TV_CHANNEL_LOGOS[primaryChannel] || "/placeholder.svg?height=24&width=60&query=TV channel logo"
                    }
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
          <DropdownMenuContent className="w-80">
            <div className="font-semibold text-sm p-3 border-b bg-gradient-to-r from-purple-50 to-pink-50 flex items-center space-x-2">
              <Globe className="h-4 w-4 text-purple-600" />
              <span>📺 TV Channels ({channels.length})</span>
            </div>
            <ScrollArea className="max-h-80">
              {channels.map((channel, index) => (
                <DropdownMenuItem key={index} className="flex items-center space-x-3 p-3 hover:bg-purple-50">
                  <Image
                    src={TV_CHANNEL_LOGOS[channel] || "/placeholder.svg?height=24&width=60&query=TV channel logo"}
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
            <div className="p-2 border-t bg-gray-50">
              <p className="text-xs text-gray-600 text-center flex items-center justify-center space-x-1">
                <Globe className="h-3 w-3" />
                <span>Live data from TheSportsDB</span>
              </p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

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

  // Enhanced Layout Settings Panel (v0.dev inspired design)
  const LayoutSettingsPanel = () => {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
              <Settings className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Main Card */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-semibold text-gray-900 mb-2">Live Events Settings</CardTitle>
              <p className="text-gray-600">Configure your display preferences using your account settings.</p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Layout Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Layout Type</Label>
                <Select defaultValue={layout}>
                  <SelectTrigger className="w-full h-12 border-gray-300 focus:border-gray-400 focus:ring-0">
                    <SelectValue placeholder="Select layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">
                      <div className="flex items-center space-x-2">
                        <LayoutGrid className="h-4 w-4" />
                        <span>Grid Layout (3 columns)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="wide">
                      <div className="flex items-center space-x-2">
                        <Columns className="h-4 w-4" />
                        <span>Wide Layout (2 columns)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="single">
                      <div className="flex items-center space-x-2">
                        <Square className="h-4 w-4" />
                        <span>Single Layout (1x2)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Max Events */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Maximum Events</Label>
                <Input
                  type="number"
                  min="2"
                  max="20"
                  value={layoutSettings.maxEvents}
                  onChange={(e) =>
                    setLayoutSettings((prev) => ({ ...prev, maxEvents: Number.parseInt(e.target.value) || 6 }))
                  }
                  className="h-12 border-gray-300 focus:border-gray-400 focus:ring-0"
                  placeholder="Enter number of events"
                />
              </div>

              {/* Apply Settings Button */}
              <Button
                onClick={() => setShowSettings(false)}
                className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-md transition-colors"
              >
                Apply Settings
              </Button>

              {/* Alternative Options */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(false)}
                  className="w-full h-12 border-gray-300 hover:bg-gray-50 font-medium rounded-md transition-colors flex items-center justify-center space-x-2"
                >
                  <Globe className="h-4 w-4" />
                  <span>Continue with Default Settings</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowSettings(false)}
                  className="w-full h-12 border-gray-300 hover:bg-gray-50 font-medium rounded-md transition-colors flex items-center justify-center space-x-2"
                >
                  <Github className="h-4 w-4" />
                  <span>Load from GitHub Config</span>
                </Button>
              </div>

              {/* Show other options */}
              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => {
                    // Toggle advanced options
                  }}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Show other options
                </Button>
              </div>

              <Separator className="my-6" />

              {/* Advanced Settings (collapsible) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-micro-ads" className="text-sm text-gray-700 font-medium">
                    Show Micro Ads
                  </Label>
                  <Switch
                    id="show-micro-ads"
                    checked={layoutSettings.showMicroAds}
                    onCheckedChange={(checked) => setLayoutSettings((prev) => ({ ...prev, showMicroAds: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-tv-channels" className="text-sm text-gray-700 font-medium">
                    Show TV Channels
                  </Label>
                  <Switch
                    id="show-tv-channels"
                    checked={layoutSettings.showTVChannels}
                    onCheckedChange={(checked) => setLayoutSettings((prev) => ({ ...prev, showTVChannels: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-venue-info" className="text-sm text-gray-700 font-medium">
                    Show Venue Info
                  </Label>
                  <Switch
                    id="show-venue-info"
                    checked={layoutSettings.showVenueInfo}
                    onCheckedChange={(checked) => setLayoutSettings((prev) => ({ ...prev, showVenueInfo: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-action-buttons" className="text-sm text-gray-700 font-medium">
                    Show Action Buttons
                  </Label>
                  <Switch
                    id="show-action-buttons"
                    checked={layoutSettings.showActionButtons}
                    onCheckedChange={(checked) =>
                      setLayoutSettings((prev) => ({ ...prev, showActionButtons: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="compact-mode" className="text-sm text-gray-700 font-medium">
                    Compact Mode
                  </Label>
                  <Switch
                    id="compact-mode"
                    checked={layoutSettings.compactMode}
                    onCheckedChange={(checked) => setLayoutSettings((prev) => ({ ...prev, compactMode: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-refresh" className="text-sm text-gray-700 font-medium">
                    Enable Auto Refresh
                  </Label>
                  <Switch
                    id="auto-refresh"
                    checked={layoutSettings.autoRefresh}
                    onCheckedChange={(checked) => setLayoutSettings((prev) => ({ ...prev, autoRefresh: checked }))}
                  />
                </div>

                {layoutSettings.autoRefresh && (
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-700 font-medium">Refresh Interval</Label>
                    <Select
                      value={layoutSettings.refreshInterval.toString()}
                      onValueChange={(value) =>
                        setLayoutSettings((prev) => ({ ...prev, refreshInterval: Number.parseInt(value) }))
                      }
                    >
                      <SelectTrigger className="h-12 border-gray-300 focus:border-gray-400 focus:ring-0">
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
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-800 font-medium">
                Sign Up
              </Button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  const HorizontalEventCard = ({ event }: { event: SportsDBEvent }) => {
    const isLive = isEventLive(event)
    const sportColor = SPORT_COLORS[event.strSport] || "bg-gradient-to-r from-gray-500 to-gray-700"
    const sportEmoji = SPORT_EMOJIS[event.strSport] || "🏆"
    const venue = event.strVenue || "Stadium TBA"
    const location = [event.strCity, event.strCountry].filter(Boolean).join(", ") || "Location TBA"

    return (
      <Card className="hover:shadow-2xl transition-all duration-300 group border-2 border-gray-200 hover:border-blue-300 bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className={`flex ${layoutSettings.compactMode ? "h-64" : "h-80"}`}>
            {/* Left side - Match visual */}
            <div className="w-80 relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/20"></div>

              {/* Sport icon at top left */}
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 border border-white/30">
                  <span className="text-2xl">{sportEmoji}</span>
                </div>
              </div>

              {/* Live indicator */}
              {isLive && (
                <div className="absolute top-4 right-4 z-20">
                  <Badge className="bg-red-500 text-white animate-pulse border-0 text-sm px-3 py-1">🔴 LIVE</Badge>
                </div>
              )}

              {/* Teams display */}
              <div className="relative z-10 flex items-center justify-between w-full px-6">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-2">
                    <TeamBadge
                      src={event.strHomeTeamBadge}
                      alt={event.strHomeTeam}
                      teamName={event.strHomeTeam}
                      size={80}
                    />
                  </div>
                  <p className="text-white text-xs font-bold truncate max-w-20 bg-black/30 px-2 py-1 rounded">
                    {event.strHomeTeam}
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-white text-2xl font-bold mb-2 bg-black/30 px-3 py-1 rounded-lg">VS</div>
                  <div className={`w-6 h-6 rounded-full ${sportColor} mx-auto animate-pulse shadow-lg`}></div>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-2">
                    <TeamBadge
                      src={event.strAwayTeamBadge}
                      alt={event.strAwayTeam}
                      teamName={event.strAwayTeam}
                      size={80}
                    />
                  </div>
                  <p className="text-white text-xs font-bold truncate max-w-20 bg-black/30 px-2 py-1 rounded">
                    {event.strAwayTeam}
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Content area */}
            <div className="flex-1 flex flex-col">
              {/* Top section - TV channels and micro ads */}
              {(layoutSettings.showTVChannels || layoutSettings.showMicroAds) && (
                <div className={`${layoutSettings.compactMode ? "h-16" : "h-24"} flex border-b border-gray-200`}>
                  {/* TV Channels section */}
                  {layoutSettings.showTVChannels && (
                    <div className="flex-1 p-3 bg-gradient-to-br from-blue-50 to-indigo-50">
                      <div className="h-full bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg border-2 border-blue-300 p-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-1">
                            <Tv className="h-3 w-3 text-blue-600" />
                            <span className="font-bold text-blue-800 text-xs">TV Channels</span>
                          </div>
                          <Badge className="bg-blue-200 text-blue-800 text-xs px-1 py-0">
                            {event.strTVStation ? event.strTVStation.split(",").length : 0}
                          </Badge>
                        </div>
                        <div className="text-xs text-blue-700 truncate">
                          {event.strTVStation || "TV Info Not Available"}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Top Micro Ad Section */}
                  {layoutSettings.showMicroAds && (
                    <div className="w-48 p-3">
                      <div className="h-full bg-gradient-to-r from-gray-900 to-black rounded-lg p-2">
                        <div className="grid grid-cols-3 gap-1 h-full">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded p-1 text-white text-center">
                            <Zap className="h-3 w-3 mx-auto mb-1" />
                            <span className="text-xs font-bold block">BETTING</span>
                            <span className="text-xs opacity-90">50% Bonus</span>
                          </div>
                          <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded p-1 text-white text-center">
                            <Gift className="h-3 w-3 mx-auto mb-1" />
                            <span className="text-xs font-bold block">GEAR</span>
                            <span className="text-xs opacity-90">30% Off</span>
                          </div>
                          <div className="bg-gradient-to-r from-green-400 to-teal-500 rounded p-1 text-white text-center">
                            <Percent className="h-3 w-3 mx-auto mb-1" />
                            <span className="text-xs font-bold block">TRAVEL</span>
                            <span className="text-xs opacity-90">Book Now</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Middle section - Event details */}
              <div className="flex-1 p-4 bg-white">
                <div className="space-y-3">
                  {/* Event header */}
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 font-medium">{formatDate(event.dateEvent)}</span>
                    </div>
                    <h3
                      className={`${layoutSettings.compactMode ? "text-lg" : "text-xl"} font-bold text-gray-900 mb-1`}
                    >
                      {event.strHomeTeam} vs {event.strAwayTeam}
                    </h3>
                    <p className="text-sm text-blue-600 font-semibold">{event.strLeague}</p>
                  </div>

                  {/* Time and location */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-2">
                      <div className="flex items-center space-x-1 mb-1">
                        <Clock className="h-3 w-3 text-blue-600" />
                        <span className="text-xs font-semibold text-gray-700">Match Time</span>
                      </div>
                      <p className="text-sm font-bold text-blue-600">{formatTime(event.strTime)}</p>
                      <p className="text-xs text-gray-600">Your Time</p>
                    </div>

                    {layoutSettings.showVenueInfo && (
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-2">
                        <div className="flex items-center space-x-1 mb-1">
                          <MapPin className="h-3 w-3 text-orange-600" />
                          <span className="text-xs font-semibold text-gray-700">Venue</span>
                        </div>
                        <p className="text-xs font-bold text-orange-600 truncate">{venue}</p>
                        <p className="text-xs text-gray-600 truncate">{location}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom section - Action buttons */}
              {layoutSettings.showActionButtons && (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                  {/* Action buttons row */}
                  <div className="grid grid-cols-6 gap-0">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white rounded-none border-r border-white/20 h-12 flex flex-col items-center justify-center"
                    >
                      <Ticket className="h-3 w-3 mb-1" />
                      <span className="text-xs font-bold">BUY TICKETS</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="border-teal-500 text-teal-600 hover:bg-teal-50 bg-transparent rounded-none border-r border-gray-300 h-12 flex flex-col items-center justify-center"
                    >
                      <Map className="h-3 w-3 mb-1" />
                      <span className="text-xs font-bold">PLAN A TRIP</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50 bg-transparent rounded-none border-r border-gray-300 h-12 flex flex-col items-center justify-center"
                    >
                      <ShoppingBag className="h-3 w-3 mb-1" />
                      <span className="text-xs font-bold">SHOP</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="border-purple-500 text-purple-600 hover:bg-purple-50 bg-transparent rounded-none border-r border-gray-300 h-12 flex flex-col items-center justify-center"
                    >
                      <MessageCircle className="h-3 w-3 mb-1" />
                      <span className="text-xs font-bold">ENGAGE</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-600 hover:bg-red-50 bg-transparent rounded-none border-r border-gray-300 h-12 flex flex-col items-center justify-center"
                    >
                      <Play className="h-3 w-3 mb-1" />
                      <span className="text-xs font-bold">WATCH LIVE/TV</span>
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-400 text-gray-600 hover:bg-gray-50 bg-transparent rounded-none h-12 flex flex-col items-center justify-center"
                        >
                          <BookOpen className="h-3 w-3 mb-1" />
                          <span className="text-xs font-bold">READ, LISTEN & MORE</span>
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

                  {/* Bottom Micro Ad Section */}
                  {layoutSettings.showMicroAds && (
                    <div className="p-3 border-t border-gray-300">
                      <div className="bg-gradient-to-r from-gray-900 to-black rounded-lg p-2">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-gradient-to-r from-red-400 to-pink-500 rounded p-2 text-white text-center">
                            <Play className="h-3 w-3 mx-auto mb-1" />
                            <span className="text-xs font-bold block">STREAMING</span>
                            <span className="text-xs opacity-90">Watch Free</span>
                          </div>
                          <div className="bg-gradient-to-r from-indigo-400 to-blue-500 rounded p-2 text-white text-center">
                            <BookOpen className="h-3 w-3 mx-auto mb-1" />
                            <span className="text-xs font-bold block">NEWS</span>
                            <span className="text-xs opacity-90">Stay Updated</span>
                          </div>
                          <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded p-2 text-white text-center">
                            <Headphones className="h-3 w-3 mx-auto mb-1" />
                            <span className="text-xs font-bold block">PODCASTS</span>
                            <span className="text-xs opacity-90">Listen Now</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const maxEvents = layout === "wide" ? 4 : layout === "single" ? 2 : 6
  const skeletonCount = layout === "wide" ? 4 : layout === "single" ? 2 : 6

  // Show settings panel if requested
  if (showSettings) {
    return <LayoutSettingsPanel />
  }

  if (isLoading && events.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500 animate-pulse">Loading...</span>
          </div>
        </div>

        <div
          className={
            layout === "grid"
              ? "grid gap-4 md:grid-cols-3"
              : layout === "single"
                ? "grid gap-6 grid-cols-1"
                : "grid gap-6 md:grid-cols-2"
          }
        >
          {[...Array(skeletonCount)].map((_, i) => (
            <Card key={i} className="animate-pulse border-2 border-gray-100">
              {layout === "single" ? (
                <CardContent className="p-0">
                  <div className="flex h-80">
                    <div className="w-80 h-full bg-gradient-to-br from-gray-300 to-gray-400 animate-pulse"></div>
                    <div className="flex-1 flex flex-col">
                      <div className="h-24 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
                      <div className="flex-1 p-6 space-y-4">
                        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3 animate-pulse"></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                          <div className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
                    </div>
                  </div>
                </CardContent>
              ) : (
                <>
                  <CardHeader className="space-y-2">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 animate-pulse"></div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="h-8 w-8 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full animate-pulse"></div>
                      <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12 animate-pulse"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-8 w-8 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full animate-pulse"></div>
                      <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12 animate-pulse"></div>
                    </div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full animate-pulse"></div>
                  </CardContent>
                </>
              )}
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
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <div className="flex items-center space-x-1">
            {isOnline ? (
              <Wifi className="h-6 w-6 text-green-500 animate-pulse" />
            ) : (
              <WifiOff className="h-6 w-6 text-red-500" />
            )}
            <Trophy className="h-6 w-6 text-yellow-500 animate-bounce" />
          </div>
          {layout === "wide" && (
            <Badge
              variant="outline"
              className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-300 text-orange-700"
            >
              Wide Layout Test
            </Badge>
          )}
          {layout === "single" && (
            <Badge
              variant="outline"
              className="bg-gradient-to-r from-green-50 to-blue-50 border-green-300 text-green-700"
            >
              Enhanced Single Layout (1x2)
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {lastUpdated && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div
                className={`w-3 h-3 rounded-full ${isOnline ? "bg-gradient-to-r from-green-400 to-green-600 animate-pulse shadow-lg" : "bg-red-500"}`}
              ></div>
              <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-2 border-purple-200 hover:border-pink-300 transition-all duration-300"
          >
            <Settings className="h-4 w-4 text-purple-600" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-medium">
              Settings
            </span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchLiveEvents}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-2 border-blue-200 hover:border-purple-300 transition-all duration-300"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin text-blue-600" : "text-purple-600"}`} />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">
              Refresh
            </span>
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 animate-pulse" />
            <div>
              <p className="text-yellow-800 font-medium">Connection Issue</p>
              <p className="text-yellow-700 text-sm">{error}</p>
              {events.length > 0 && <p className="text-yellow-600 text-sm mt-1">Showing cached data</p>}
            </div>
          </div>
        </div>
      )}

      {/* Events Grid */}
      {events.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 bg-gradient-to-br from-gray-700 to-gray-900 bg-clip-text text-transparent">
              No Live Events
            </h3>
            <p className="text-muted-foreground mb-4">There are no live sports events at the moment.</p>
            <Button
              onClick={fetchLiveEvents}
              variant="outline"
              className="bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-2 border-blue-200 hover:border-purple-300"
            >
              <RefreshCw className="h-4 w-4 mr-2 text-blue-600" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">
                Try Again
              </span>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            layout === "grid"
              ? "grid gap-6 md:grid-cols-3"
              : layout === "single"
                ? "grid gap-8 grid-cols-1"
                : "grid gap-8 md:grid-cols-2"
          }
        >
          {events.slice(0, maxEvents).map((event) => {
            if (layout === "single") {
              return <HorizontalEventCard key={event.idEvent} event={event} />
            }

            const isLive = isEventLive(event)
            const sportColor = SPORT_COLORS[event.strSport] || "bg-gradient-to-r from-gray-500 to-gray-700"
            const sportEmoji = SPORT_EMOJIS[event.strSport] || "🏆"

            return (
              <Card
                key={event.idEvent}
                className="hover:shadow-2xl transition-all duration-300 group border-2 border-gray-200 hover:border-blue-300 bg-white overflow-hidden"
              >
                <CardHeader className="pb-3 bg-gradient-to-br from-blue-50 to-purple-50">
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
                      <Link
                        href={`/teams/${event.idHomeTeam || event.strHomeTeam.replace(/\s+/g, "-").toLowerCase()}`}
                        className="flex items-center space-x-3 flex-1 min-w-0 hover:text-blue-600 transition-colors"
                      >
                        <TeamBadge src={event.strHomeTeamBadge} alt={event.strHomeTeam} teamName={event.strHomeTeam} />
                        <span className="font-medium truncate bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent hover:from-blue-600 hover:to-purple-600 text-sm">
                          {event.strHomeTeam}
                        </span>
                      </Link>
                      {event.intHomeScore !== null && (
                        <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent px-2 py-1 rounded-full bg-white shadow-md border-2 border-blue-200 text-lg">
                          {event.intHomeScore}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 p-3">
                      <Link
                        href={`/teams/${event.idAwayTeam || event.strAwayTeam.replace(/\s+/g, "-").toLowerCase()}`}
                        className="flex items-center space-x-3 flex-1 min-w-0 hover:text-purple-600 transition-colors"
                      >
                        <TeamBadge src={event.strAwayTeamBadge} alt={event.strAwayTeam} teamName={event.strAwayTeam} />
                        <span className="font-medium truncate bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-600 text-sm">
                          {event.strAwayTeam}
                        </span>
                      </Link>
                      {event.intAwayScore !== null && (
                        <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent px-2 py-1 rounded-full bg-white shadow-md border-2 border-purple-200 text-lg">
                          {event.intAwayScore}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Match Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        <Clock className="inline-block h-4 w-4 mr-1 text-gray-500" />
                        <span className="align-middle">Time:</span>
                        <span className="font-semibold text-gray-800 ml-1">{formatTime(event.strTime)}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        <Calendar className="inline-block h-4 w-4 mr-1 text-gray-500" />
                        <span className="align-middle">Date:</span>
                        <span className="font-semibold text-gray-800 ml-1">{formatDate(event.dateEvent)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Venue Information */}
                  {layoutSettings.showVenueInfo && (
                    <div className="rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 transition-all duration-300 p-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-orange-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">{event.strVenue || "Venue: N/A"}</p>
                          <p className="text-xs text-gray-500">
                            {event.strCity || "City: N/A"}, {event.strCountry || "Country: N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TV Channels */}
                  {layoutSettings.showTVChannels && (
                    <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 p-3">
                      <div className="flex items-center space-x-2">
                        <Tv className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">TV Channels:</p>
                          <p className="text-xs text-gray-500">{event.strTVStation || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
