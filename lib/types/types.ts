export type Venue = {
  id: string
  name: string
  address: string
  city: string
  country: string
  coordinates: {
    lat: number
    lng: number
  }
  rating: number
  reviewCount: number
  images: string[]
  sports: string[]
  amenities: string[]
  openingHours: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  channels: string[]
  description: string
  priceRange: string
}

export type Coordinates = {
  lat: number
  lng: number
}

export type Fixture = {
  id: string
  sport: string
  competition: string
  homeTeam: {
    id: string
    name: string
    logo: string
  }
  awayTeam: {
    id: string
    name: string
    logo: string
  }
  date: string
  time: string
  venue: Venue
  status: "not_started" | "live" | "finished"
  score?: {
    home: number
    away: number
  }
  tvChannels: string[]
  gender: "male" | "female" | "mixed"
  location: string
  eventType: string
  isAllDay: boolean
  isFavorite: boolean
  hasReminder: boolean
  coordinates: Coordinates
  eventImage?: string
}

export type FilterState = {
  sport: string
  competition: string
  location: string
  date: string
  status: string
  team: string
  event: string
  gender: string
  search: string
}

export type TimePreference = "local" | "your"
