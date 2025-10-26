export function validateCronRequest(request: Request): boolean {
  const authHeader = request.headers.get("authorization")
  const expectedToken = `Bearer ${process.env.CRON_SECRET_TOKEN}`

  if (!authHeader || authHeader !== expectedToken) {
    return false
  }

  return true
}
