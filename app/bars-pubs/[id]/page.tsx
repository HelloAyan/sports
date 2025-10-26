"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin, Phone, Globe, Clock, Star, Share2, Calendar, Tv } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VenueMap } from "@/components/venue-map"
import { VenueSchedule } from "@/components/venue-schedule"
import { VenueReviews } from "@/components/venue-reviews"
import type { Venue } from "@/lib/types"

// This would come from your API
const MOCK_VENUE: Venue = {
  id: "1",
  name: "The Sports Bar & Grill",
  address: "123 Main Street",
  city: "London",
  country: "United Kingdom",
  coordinates: { lat: 51.5074, lng: -0.1278 },
  rating: 4.5,
  reviewCount: 128,
  images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  sports: ["Football", "Rugby", "Cricket"],
  amenities: ["HD TVs", "WiFi", "Food", "Beer Garden"],
  openingHours: {
    monday: "12:00-23:00",
    tuesday: "12:00-23:00",
    wednesday: "12:00-23:00",
    thursday: "12:00-23:00",
    friday: "12:00-00:00",
    saturday: "11:00-00:00",
    sunday: "12:00-22:30",
  },
  channels: ["Sky Sports", "BT Sport", "ESPN"],
  description: "Your premier sports viewing destination in central London",
  priceRange: "££",
}

export default function VenueDetailPage({ params }: { params: { id: string } }) {
  const [activeImage, setActiveImage] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image Gallery */}
      <div className="relative h-[400px]">
        <Image
          src={MOCK_VENUE.images[activeImage] || "/placeholder.svg"}
          alt={MOCK_VENUE.name}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-4 left-4 flex gap-2">
          {MOCK_VENUE.images.map((_, index) => (
            <button
              key={index}
              className={`w-16 h-16 border-2 ${index === activeImage ? "border-sports-primary" : "border-white"}`}
              onClick={() => setActiveImage(index)}
            >
              <Image
                src={MOCK_VENUE.images[index] || "/placeholder.svg"}
                alt={`${MOCK_VENUE.name} ${index + 1}`}
                width={64}
                height={64}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{MOCK_VENUE.name}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{`${MOCK_VENUE.address}, ${MOCK_VENUE.city}`}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span>{MOCK_VENUE.rating}</span>
                    <span className="text-sm ml-1">({MOCK_VENUE.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="about" className="mt-6">
              <TabsList>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Description</h2>
                    <p className="text-gray-600">{MOCK_VENUE.description}</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-3">Amenities</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {MOCK_VENUE.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <Tv className="h-4 w-4" />
                          </div>
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-3">Sports Channels</h2>
                    <div className="flex flex-wrap gap-2">
                      {MOCK_VENUE.channels.map((channel) => (
                        <div key={channel} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                          {channel}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="schedule">
                <VenueSchedule venueId={params.id} />
              </TabsContent>

              <TabsContent value="reviews">
                <VenueReviews venueId={params.id} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Opening Hours */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Opening Hours
              </h2>
              <div className="space-y-2">
                {Object.entries(MOCK_VENUE.openingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="capitalize">{day}</span>
                    <span>{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Location</h2>
              <div className="h-[300px] rounded-lg overflow-hidden">
                <VenueMap venues={[MOCK_VENUE]} />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{`${MOCK_VENUE.address}, ${MOCK_VENUE.city}, ${MOCK_VENUE.country}`}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>+44 20 1234 5678</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4" />
                  <a href="#" className="text-blue-600 hover:underline">
                    Visit website
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Button className="w-full">Book a Table</Button>
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                View Full Schedule
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
