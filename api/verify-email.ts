import type { VercelRequest, VercelResponse } from '@vercel/node'

type EmailVerificationResult = {
  deliverable: boolean
  disposable: boolean
  reason: string
}

const API_URL =
  process.env.EMAIL_VERIFY_API_URL ?? 'https://api.validemail.io/v1/verify'
const API_KEY = process.env.EMAIL_VERIFY_API_KEY

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const email = (req.body as { email?: string })?.email?.trim()
  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }
  if (!API_KEY) {
    return res.status(500).json({ error: 'Missing EMAIL_VERIFY_API_KEY' })
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const text = await response.text()
      return res
        .status(response.status)
        .json({ error: `Verifier responded ${response.status}: ${text}` })
    }

    const data = (await response.json()) as Record<string, unknown>
    const result: EmailVerificationResult = {
      deliverable:
        (data.deliverable as boolean | undefined) ??
        (data.is_valid as boolean | undefined) ??
        false,
      disposable:
        (data.disposable as boolean | undefined) ??
        (data.is_disposable as boolean | undefined) ??
        false,
      reason:
        (data.reason as string | undefined) ??
        (data.status as string | undefined) ??
        'unknown',
    }

    return res.status(200).json(result)
  } catch (error) {
    return res
      .status(500)
      .json({ error: (error as Error)?.message ?? 'Verification failed' })
  }
}
