import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<
    | { status: 'idle' }
    | { status: 'ok' }
    | { status: 'warn'; message: string }
    | { status: 'error'; message: string }
  >({ status: 'idle' })
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) {
      setResult({ status: 'warn', message: 'Email is required' })
      return
    }

    setResult({ status: 'idle' })
    setIsPending(true)
    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? `Verify failed: ${response.status}`)
      }

      const data = (await response.json()) as {
        deliverable: boolean
        disposable: boolean
        reason: string
      }

      if (!data.deliverable || data.disposable) {
        setResult({
          status: 'warn',
          message: data.reason || 'undeliverable or disposable',
        })
        return
      }
      setResult({ status: 'ok' })
    } catch (error) {
      setResult({
        status: 'error',
        message:
          (error as Error)?.message ?? 'verification failed. Check server logs.',
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-[2rem] p-6 sm:p-8">
        <p className="island-kicker mb-2">About</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          Welcome to Book Nest.
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          This page will share product notes once real data and accounts are
          wired up. For now, jump back to the dashboard to create your own
          calendars and invites.
        </p>
      </section>

      <section className="mt-8 island-shell rounded-[2rem] p-6 sm:p-8">
        <p className="island-kicker mb-2">Email verification</p>
        <h2 className="text-2xl font-semibold text-[var(--sea-ink)]">
          Try your Sniffmail key
        </h2>
        <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full flex-1 rounded-2xl border border-[var(--sea-foam-border)] bg-white px-4 py-3 text-[var(--sea-ink)] shadow-sm outline-none focus:border-[var(--sea-ink)] focus:ring"
          />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-2xl bg-[var(--sea-ink)] px-5 py-3 text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {isPending ? 'Checking…' : 'Verify email'}
          </button>
        </form>
        {result.status === 'ok' && (
          <p className="mt-3 text-sm text-green-700">Deliverable and not disposable.</p>
        )}
        {result.status === 'warn' && (
          <p className="mt-3 text-sm text-amber-700">
            Flagged: {result.message || 'undeliverable/disposable'}
          </p>
        )}
        {result.status === 'error' && (
          <p className="mt-3 text-sm text-red-700">
            Error: {result.message || 'verification failed'}
          </p>
        )}
        {result.status === 'idle' && isPending && (
          <p className="mt-3 text-sm text-[var(--sea-ink-soft)]">
            Sending to Sniffmail…
          </p>
        )}
      </section>
    </main>
  )
}
