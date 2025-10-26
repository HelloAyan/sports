import { createClient } from "@vercel/edge-config"

const client = createClient(process.env.EDGE_CONFIG)

export async function getAdConfig(placementId: string) {
  try {
    const adConfig = await client.get(`adPlacements.${placementId}`)
    return adConfig || { isActive: false, type: "none" }
  } catch (error) {
    console.error("Error fetching ad config from CMS:", error)
    return { isActive: false, type: "none" }
  }
}
