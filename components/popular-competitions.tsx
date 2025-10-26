"use client"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

const POPULAR_COMPETITIONS = [
  {
    id: "4328",
    name: "Premier League",
    country: "England",
    sport: "Soccer",
    logo: "/placeholder.svg?height=40&width=40",
    color: "bg-purple-100 hover:bg-purple-200",
    textColor: "text-purple-800",
  },
  {
    id: "4380",
    name: "La Liga",
    country: "Spain",
    sport: "Soccer",
    logo: "/placeholder.svg?height=40&width=40",
    color: "bg-red-100 hover:bg-red-200",
    textColor: "text-red-800",
  },
  {
    id: "4331",
    name: "Bundesliga",
    country: "Germany",
    sport: "Soccer",
    logo: "/placeholder.svg?height=40&width=40",
    color: "bg-yellow-100 hover:bg-yellow-200",
    textColor: "text-yellow-800",
  },
  {
    id: "4332",
    name: "Serie A",
    country: "Italy",
    sport: "Soccer",
    logo: "/placeholder.svg?height=40&width=40",
    color: "bg-blue-100 hover:bg-blue-200",
    textColor: "text-blue-800",
  },
  {
    id: "4334",
    name: "Ligue 1",
    country: "France",
    sport: "Soccer",
    logo: "/placeholder.svg?height=40&width=40",
    color: "bg-indigo-100 hover:bg-indigo-200",
    textColor: "text-indigo-800",
  },
  {
    id: "4387",
    name: "NBA",
    country: "USA",
    sport: "Basketball",
    logo: "/placeholder.svg?height=40&width=40",
    color: "bg-orange-100 hover:bg-orange-200",
    textColor: "text-orange-800",
  },
  {
    id: "4391",
    name: "NFL",
    country: "USA",
    sport: "American Football",
    logo: "/placeholder.svg?height=40&width=40",
    color: "bg-green-100 hover:bg-green-200",
    textColor: "text-green-800",
  },
  {
    id: "4424",
    name: "MLB",
    country: "USA",
    sport: "Baseball",
    logo: "/placeholder.svg?height=40&width=40",
    color: "bg-red-100 hover:bg-red-200",
    textColor: "text-red-800",
  },
]

export function PopularCompetitions() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Popular Competitions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {POPULAR_COMPETITIONS.map((competition) => (
          <Link key={competition.id} href={`/leagues/${competition.id}`}>
            <Card className={`${competition.color} transition-colors duration-200 hover:shadow-md cursor-pointer`}>
              <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                <div className="w-10 h-10 mb-2 flex items-center justify-center">
                  <img
                    src={competition.logo || "/placeholder.svg"}
                    alt={competition.name}
                    width={40}
                    height={40}
                    className="object-contain"
                    onError={(e) => {
                      ; (e.target as HTMLImageElement).src =
                        `/placeholder.svg?height=40&width=40&query=${encodeURIComponent(competition.name)}`
                    }}
                  />
                </div>
                <h3 className={`font-medium ${competition.textColor}`}>{competition.name}</h3>
                <p className="text-xs text-gray-600">{competition.country}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
