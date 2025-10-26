import { createHash } from "crypto"
import { signIn } from "next-auth/react"

export function verifyApiKey(apiKey: string): boolean {
  if (!process.env.INTERNAL_API_KEY) {
    console.warn("INTERNAL_API_KEY is not set, authentication is disabled")
    return true
  }

  const hashedKey = createHash("sha256").update(apiKey).digest("hex")
  return hashedKey === process.env.INTERNAL_API_KEY
}

export function validateCronRequest(request: Request): boolean {
  if (!process.env.CRON_SECRET_TOKEN) {
    console.warn("CRON_SECRET_TOKEN is not set, cron authentication is disabled")
    return true
  }

  const authHeader = request.headers.get("authorization")
  const expectedToken = `Bearer ${process.env.CRON_SECRET_TOKEN}`

  if (!authHeader || authHeader !== expectedToken) {
    return false
  }

  return true
}

/**
 * Client-side helpers that wrap next-auth `signIn` for the supported providers.
 * They are intentionally simple so they can be called directly from React
 * components without repeating provider strings everywhere.
 *
 * NOTE: If you add a new auth provider, make sure to add a matching wrapper.
 */
export function signInWithGoogle(options?: Parameters<typeof signIn>[1]) {
  return signIn("google", options)
}

export function signInWithFacebook(options?: Parameters<typeof signIn>[1]) {
  return signIn("facebook", options)
}

export function signInWithLine(options?: Parameters<typeof signIn>[1]) {
  return signIn("line", options)
}

export function signInWithEmail(options?: Parameters<typeof signIn>[1]) {
  return signIn("email", options)
}
