import { createCipheriv, createDecipheriv, randomBytes } from "crypto"

const ALGORITHM = "aes-256-gcm"
const IV_LENGTH = 16
const SALT_LENGTH = 64
const TAG_LENGTH = 16

// Fallback key for development environments
const FALLBACK_KEY = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"

export function encrypt(text: string): string {
  const key = process.env.ENCRYPTION_KEY
    ? Buffer.from(process.env.ENCRYPTION_KEY, "hex")
    : Buffer.from(FALLBACK_KEY, "hex")

  const iv = randomBytes(IV_LENGTH)
  const salt = randomBytes(SALT_LENGTH)

  const cipher = createCipheriv(ALGORITHM, key, iv)

  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")

  const tag = cipher.getAuthTag()

  const result = {
    i: iv.toString("hex"),
    s: salt.toString("hex"),
    t: tag.toString("hex"),
    d: encrypted,
  }

  return Buffer.from(JSON.stringify(result)).toString("base64")
}

export function decrypt(encryptedData: string): string {
  const key = process.env.ENCRYPTION_KEY
    ? Buffer.from(process.env.ENCRYPTION_KEY, "hex")
    : Buffer.from(FALLBACK_KEY, "hex")

  const { i, t, d } = JSON.parse(Buffer.from(encryptedData, "base64").toString())

  const iv = Buffer.from(i, "hex")
  const tag = Buffer.from(t, "hex")

  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(tag)

  let decrypted = decipher.update(d, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}
