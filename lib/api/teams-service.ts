import { getTeamById as getSportsDBTeam } from "./sports-db-v2"

export async function getTeamById(teamId: string) {
  try {
    console.log(`[Teams Service] Fetching team data for ID: ${teamId}`)

    // Try to get team from SportsDB first
    const team = await getSportsDBTeam(teamId)

    if (team) {
      console.log(`[Teams Service] Found team: ${team.strTeam}`)
      return team
    }

    // If not found by ID, return mock data for demo
    console.log(`[Teams Service] Team not found, returning mock data for: ${teamId}`)

    return {
      idTeam: teamId,
      strTeam: teamId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      strAlternate: "",
      strLeague: "Premier League",
      strSport: "Soccer",
      strCountry: "England",
      strStadium: "Home Stadium",
      strStadiumThumb: "/placeholder.svg?height=300&width=600",
      strStadiumDescription: "A modern football stadium with excellent facilities.",
      strStadiumLocation: "London, England",
      strWebsite: "https://example.com",
      strFacebook: "https://facebook.com/team",
      strTwitter: "https://twitter.com/team",
      strInstagram: "https://instagram.com/team",
      strDescriptionEN: "A professional football club with a rich history and passionate fanbase.",
      strTeamBadge: "/placeholder.svg?height=100&width=100",
      strTeamJersey: "/placeholder.svg?height=200&width=150",
      strTeamLogo: "/placeholder.svg?height=100&width=100",
      intFormedYear: "1900",
      strKeywords: "football, soccer, premier league",
    }
  } catch (error) {
    console.error(`[Teams Service] Error fetching team ${teamId}:`, error)
    return null
  }
}
