import axios from "axios"

const strapiUrl = process.env.STRAPI_URL || "http://localhost:1337"

export async function fetchFixtures() {
  try {
    const response = await axios.get(`${strapiUrl}/api/fixtures`)
    return response.data.data
  } catch (error) {
    console.error("Error fetching fixtures from Strapi:", error)
    return []
  }
}

export async function fetchFixtureById(id: string) {
  try {
    const response = await axios.get(`${strapiUrl}/api/fixtures/${id}`)
    return response.data.data
  } catch (error) {
    console.error(`Error fetching fixture ${id} from Strapi:`, error)
    return null
  }
}
