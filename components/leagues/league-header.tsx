import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import type { League } from "@/lib/api/sports-db"

export function LeagueHeader({ league }: { league: League }) {
  return (
    <div className="flex items-center space-x-4">
      <Image
        src={league.strBadge || "/placeholder.svg"}
        alt={league.strLeague}
        width={100}
        height={100}
        className="rounded-full"
      />
      <div>
        <h1 className="text-3xl font-bold">{league.strLeague}</h1>
        <div className="flex items-center space-x-2 mt-2">
          <Badge>{league.strSport}</Badge>
          <Badge variant="outline">{league.strCountry}</Badge>
        </div>
      </div>
    </div>
  )
}
