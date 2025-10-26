"use client"

import { useState, useEffect } from "react"
import { BarOwnerPreferences } from "@/components/bar-owner-preferences"
import { BarFixtures } from "@/components/bar-fixtures"

export default function BarOwnerDashboard() {
  const [barOwnerId, setBarOwnerId] = useState<string | null>(null)

  useEffect(() => {
    // In a real application, you'd get this from an authentication system
    setBarOwnerId("mock-bar-owner-id")
  }, [])

  if (!barOwnerId) return <div>Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Bar Owner Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          <BarOwnerPreferences barOwnerId={barOwnerId} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Upcoming Fixtures</h2>
          <BarFixtures barOwnerId={barOwnerId} />
        </div>
      </div>
    </div>
  )
}
