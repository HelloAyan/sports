import type { Metadata } from "next"
import { BrowseContent } from "@/components/browse/browse-content"

export const metadata: Metadata = {
  title: "Browse Sports Data | Sports Fixtures",
  description: "Browse comprehensive sports data including leagues, teams, players, and events.",
}

export default function BrowsePage() {
  return <BrowseContent />
}
