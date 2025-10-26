"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeaguesBrowser } from "./leagues-browser"
import { TeamsBrowser } from "./teams-browser"
import { PlayersBrowser } from "./players-browser"
import { EventsBrowser } from "./events-browser"

export function BrowseContent() {
  const [activeTab, setActiveTab] = useState("leagues")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Browse Sports Data</h1>

      <Tabs defaultValue="leagues" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="leagues">Leagues</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="players">Players</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="leagues">
          <LeaguesBrowser />
        </TabsContent>

        <TabsContent value="teams">
          <TeamsBrowser />
        </TabsContent>

        <TabsContent value="players">
          <PlayersBrowser />
        </TabsContent>

        <TabsContent value="events">
          <EventsBrowser />
        </TabsContent>
      </Tabs>
    </div>
  )
}
