import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

const POPULAR_SPORTS = [
  {
    id: "soccer",
    name: "Soccer",
    icon: "⚽",
    color: "bg-green-100 hover:bg-green-200",
    textColor: "text-green-800",
  },
  {
    id: "basketball",
    name: "Basketball",
    icon: "🏀",
    color: "bg-orange-100 hover:bg-orange-200",
    textColor: "text-orange-800",
  },
  {
    id: "american_football",
    name: "American Football",
    icon: "🏈",
    color: "bg-brown-100 hover:bg-brown-200",
    textColor: "text-brown-800",
  },
  {
    id: "baseball",
    name: "Baseball",
    icon: "⚾",
    color: "bg-blue-100 hover:bg-blue-200",
    textColor: "text-blue-800",
  },
  {
    id: "ice_hockey",
    name: "Ice Hockey",
    icon: "🏒",
    color: "bg-blue-100 hover:bg-blue-200",
    textColor: "text-blue-800",
  },
  {
    id: "tennis",
    name: "Tennis",
    icon: "🎾",
    color: "bg-yellow-100 hover:bg-yellow-200",
    textColor: "text-yellow-800",
  },
  {
    id: "cricket",
    name: "Cricket",
    icon: "🏏",
    color: "bg-blue-100 hover:bg-blue-200",
    textColor: "text-blue-800",
  },
  {
    id: "golf",
    name: "Golf",
    icon: "⛳",
    color: "bg-green-100 hover:bg-green-200",
    textColor: "text-green-800",
  },
]

export function PopularSports() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Popular Sports</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {POPULAR_SPORTS.map((sport) => (
          <Link key={sport.id} href={`/sports/${sport.id}`}>
            <Card className={`${sport.color} transition-colors duration-200 hover:shadow-md cursor-pointer`}>
              <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                <div className="text-4xl mb-2">{sport.icon}</div>
                <h3 className={`font-medium ${sport.textColor}`}>{sport.name}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
