import type { Fixture } from "./types"

export type BarOwner = {
  id: string
  name: string
  email: string
  barName: string
  address: string
  openingHours: {
    [day: string]: {
      open: string
      close: string
    }
  }
  favoriteTeams: string[]
  favoriteSports: string[]
  favoriteEvents: string[]
  xiboDisplayId?: string
}

export type BarFixture = Fixture & {
  isDisplayed: boolean
}
