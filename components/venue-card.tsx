import Image from "next/image"
import Link from "next/link"
import { Star, MapPin, Clock, Tv, Wifi, CreditCard } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Venue } from "@/lib/types"

interface VenueCardProps {
  venue: Venue
}

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex">
        {/* Venue Image */}
        <div className="w-48 h-48 relative flex-shrink-0">
          <Image src={venue.images[0] || "/placeholder.svg"} alt={venue.name} fill className="object-cover" />
        </div>

        {/* Venue Details */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold mb-2">
                <Link href={`/bars-pubs/${venue.id}`} className="hover:text-sports-primary">
                  {venue.name}
                </Link>
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <MapPin className="h-4 w-4" />
                <span>{`${venue.address}, ${venue.city}`}</span>
              </div>
            </div>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="ml-1 font-semibold">{venue.rating}</span>
              <span className="text-sm text-gray-500 ml-1">({venue.reviewCount})</span>
            </div>
          </div>

          {/* Sports & Features */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {venue.sports.map((sport) => (
                <Badge key={sport} variant="outline">
                  {sport}
                </Badge>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Tv className="h-4 w-4" />
              <span>{venue.channels.length} channels</span>
            </div>
            {venue.amenities.includes("WiFi") && (
              <div className="flex items-center gap-1">
                <Wifi className="h-4 w-4" />
                <span>Free WiFi</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <CreditCard className="h-4 w-4" />
              <span>{venue.priceRange}</span>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>Today: {venue.openingHours.monday}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
