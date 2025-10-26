"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const SPORTS_ICONS = [
  { id: "soccer", name: "Soccer", icon: "⚽", color: "bg-green-500" },
  { id: "basketball", name: "Basketball", icon: "🏀", color: "bg-orange-500" },
  { id: "american_football", name: "American Football", icon: "🏈", color: "bg-brown-500" },
  { id: "baseball", name: "Baseball", icon: "⚾", color: "bg-blue-500" },
  { id: "ice_hockey", name: "Ice Hockey", icon: "🏒", color: "bg-blue-400" },
  { id: "tennis", name: "Tennis", icon: "🎾", color: "bg-yellow-500" },
  { id: "cricket", name: "Cricket", icon: "🏏", color: "bg-blue-600" },
  { id: "golf", name: "Golf", icon: "⛳", color: "bg-green-600" },
  { id: "rugby", name: "Rugby", icon: "🏉", color: "bg-red-600" },
  { id: "formula_1", name: "Formula 1", icon: "🏎️", color: "bg-red-500" },
  { id: "boxing", name: "Boxing", icon: "🥊", color: "bg-purple-500" },
  { id: "mma", name: "MMA", icon: "🥋", color: "bg-gray-700" },
]

export function SportsIconsGrid() {
  const [animatedIcons, setAnimatedIcons] = useState<string[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * SPORTS_ICONS.length)
      setAnimatedIcons((prev) => [...prev, SPORTS_ICONS[randomIndex].id])

      setTimeout(() => {
        setAnimatedIcons((prev) => prev.filter((id) => id !== SPORTS_ICONS[randomIndex].id))
      }, 2000)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-6 md:grid-cols-12 gap-4 justify-items-center">
        {SPORTS_ICONS.map((sport) => (
          <Link
            key={sport.id}
            href={`/sports/${sport.id}`}
            className="flex flex-col items-center justify-center text-center group relative"
          >
            <div
              className={`
                w-12 h-12 rounded-full ${sport.color} flex items-center justify-center text-white text-2xl mb-2 transform transition-transform group-hover:scale-110
                ${animatedIcons.includes(sport.id) ? "animate-bounce scale-110" : ""}
              `}
            >
              {sport.icon}
            </div>
            <span className="text-xs font-medium text-white group-hover:text-emerald-400 transition-colors duration-300">
              {sport.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
