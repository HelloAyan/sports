"use client"

import { useEffect, useRef } from "react"
import type { Venue } from "@/lib/types"
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"

interface VenueMapProps {
  venues: Venue[]
}

export function VenueMap({ venues }: VenueMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Initialize Google Maps
  }, [mapRef]) //Removed unnecessary dependency: venues

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainer={<div ref={mapRef} className="w-full h-[600px] rounded-lg" />}
        center={{ lat: venues[0]?.coordinates.lat || 51.5074, lng: venues[0]?.coordinates.lng || -0.1278 }}
        zoom={13}
      >
        {venues.map((venue) => (
          <Marker
            key={venue.id}
            position={venue.coordinates}
            title={venue.name}
            onClick={() => {
              // Handle marker click - show venue details, etc.
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  )
}
