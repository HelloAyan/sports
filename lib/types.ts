export interface Event {
  idEvent: string
  strEvent: string
  strLeague: string
  strSport: string
  strHomeTeam: string
  strAwayTeam: string
  dateEvent: string
  strTime: string
  strStatus: string
  strVenue: string | null
  strTVStation: string | null
  intHomeScore: string | null
  intAwayScore: string | null
  strHomeTeamBadge?: string | null
  strAwayTeamBadge?: string | null
}

export interface League {
  idLeague: string
  strLeague: string
  strSport: string
  strLeagueAlternate: string | null
}

export interface Team {
  idTeam: string
  strTeam: string
  strSport: string
  strLeague: string
  strStadium: string | null
  strTeamBadge: string | null
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
}
