import { getLeagueById } from "@/lib/api/sports-db"
import { getAllLeagueIds } from "@/lib/api/sports-db" // Import getAllLeagueIds
import { LeagueHeader } from "@/components/leagues/league-header"
import { LeagueFixtures } from "@/components/leagues/league-fixtures"
import { LeagueStandings } from "@/components/leagues/league-standings"
import { LeagueStats } from "@/components/leagues/league-stats"

export const revalidate = 3600 // Revalidate every hour

export async function generateStaticParams() {
  // Fetch all league IDs
  const leagueIds = await getAllLeagueIds()
  return leagueIds.map((id) => ({ id }))
}

export default async function LeaguePage({ params }: { params: { id: string } }) {
  const league = await getLeagueById(params.id)

  if (!league) {
    return <div>League not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <LeagueHeader league={league} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <LeagueFixtures leagueId={league.idLeague} />
        <LeagueStandings leagueId={league.idLeague} />
      </div>
      <LeagueStats leagueId={league.idLeague} className="mt-8" />
    </div>
  )
}
