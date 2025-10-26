"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeagueStats } from "./league-stats"
import { TeamStats } from "./team-stats"
import { PlayerStats } from "./player-stats"
import { HeadToHead } from "./head-to-head"

export function AnalyzeContent() {
  const [activeTab, setActiveTab] = useState("league-stats")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Sports Analysis</h1>

      <Tabs defaultValue="league-stats" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="league-stats">League Statistics</TabsTrigger>
          <TabsTrigger value="team-stats">Team Statistics</TabsTrigger>
          <TabsTrigger value="player-stats">Player Statistics</TabsTrigger>
          <TabsTrigger value="head-to-head">Head to Head</TabsTrigger>
        </TabsList>

        <TabsContent value="league-stats">
          <LeagueStats />
        </TabsContent>

        <TabsContent value="team-stats">
          <TeamStats />
        </TabsContent>

        <TabsContent value="player-stats">
          <PlayerStats />
        </TabsContent>

        <TabsContent value="head-to-head">
          <HeadToHead />
        </TabsContent>
      </Tabs>
    </div>
  )
}
