"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { MapPin, Calendar, Clock, TvIcon } from "lucide-react"
import type { Fixture } from "@/lib/types"
import { formatDate, formatTime } from "@/lib/utils"

interface FixtureDetailModalProps {
  fixture: Fixture | null
  timePreference: "local" | "your"
  isOpen: boolean
  onClose: () => void
}

export function FixtureDetailModal({ fixture, timePreference, isOpen, onClose }: FixtureDetailModalProps) {
  if (!fixture) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {fixture.homeTeam.name} vs {fixture.awayTeam.name}
          </DialogTitle>
          <DialogDescription>
            {fixture.competition} - {fixture.sport}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Teams */}
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center gap-2">
              <Image
                src={fixture.homeTeam.logo || "/placeholder.svg"}
                alt={fixture.homeTeam.name}
                width={80}
                height={80}
                className="rounded-full"
              />
              <span className="font-semibold">{fixture.homeTeam.name}</span>
            </div>
            {fixture.score ? (
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold">{fixture.score.home}</span>
                <span className="text-4xl font-bold">-</span>
                <span className="text-4xl font-bold">{fixture.score.away}</span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-sports-primary">VS</span>
            )}
            <div className="flex flex-col items-center gap-2">
              <Image
                src={fixture.awayTeam.logo || "/placeholder.svg"}
                alt={fixture.awayTeam.name}
                width={80}
                height={80}
                className="rounded-full"
              />
              <span className="font-semibold">{fixture.awayTeam.name}</span>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(fixture.date, timePreference)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{formatTime(fixture.time, timePreference)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{fixture.venue}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TvIcon className="h-4 w-4" />
                <span className="font-semibold">TV Channels:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {fixture.tvChannels.map((channel) => (
                  <Badge key={channel} variant="outline">
                    {channel}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button>Add to Calendar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
