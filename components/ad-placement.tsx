"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface AdPlacementProps {
  id: string
  width?: string
  height?: string
}

export function AdPlacement({ id, width = "100%", height = "auto" }: AdPlacementProps) {
  const [loading, setLoading] = useState(true)
  const [adContent, setAdContent] = useState<string | null>(null)

  useEffect(() => {
    // Simulate ad loading
    const timer = setTimeout(() => {
      setAdContent(`Ad ${id}`)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [id])

  if (loading) {
    return (
      <div className="w-full my-4" style={{ width, height }}>
        <Skeleton className="w-full h-full min-h-[100px]" />
      </div>
    )
  }

  return (
    <Card className="w-full my-4 overflow-hidden" style={{ width, height }}>
      <CardContent className="p-0">
        <div className="bg-gray-100 w-full h-full min-h-[100px] flex items-center justify-center text-gray-500 text-sm">
          <span>Advertisement</span>
        </div>
      </CardContent>
    </Card>
  )
}
