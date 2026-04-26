import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const LOOPS_API_KEY             = Deno.env.get('LOOPS_API_KEY') ?? ''
const SUPABASE_URL              = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const TURNSTILE_SECRET_KEY      = Deno.env.get('TURNSTILE_SECRET_KEY') ?? ''

const ALLOWED_ORIGINS = ['https://hennyautomotive.com', 'http://localhost:5173', 'http://localhost:4173']
const RATE_LIMIT = 5   // requests
const RATE_WINDOW = 60 // per 60 minutes per IP

serve(async (req) => {
  const origin = req.headers.get('origin') ?? ''
  const headers = corsHeaders(origin)

  if (req.method === 'OPTIONS') return new Response('ok', { headers })

  try {
    const body = await req.json()
    const email        = typeof body?.email        === 'string' ? body.email.toLowerCase().trim() : ''
    const captchaToken = typeof body?.captchaToken === 'string' ? body.captchaToken : ''

    if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'Invalid email address.' }, 400, headers)
    }

    // Verify Turnstile CAPTCHA
    if (TURNSTILE_SECRET_KEY) {
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? ''
      if (!await verifyTurnstile(captchaToken, ip)) {
        return json({ error: 'CAPTCHA verification failed. Please try again.' }, 400, headers)
      }
    }

    // Rate limit by IP
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
    if (!await checkRateLimit(supabase, `subscribe:${ip}`, RATE_LIMIT, RATE_WINDOW)) {
      return json({ error: 'Too many requests. Please try again later.' }, 429, headers)
    }

    // Try to create contact in Loops
    const createRes = await loopsRequest('POST', '/api/v1/contacts/create', { email, subscribed: true, source: 'website' })

    if (createRes.success) {
      // Fresh subscriber — Loops automation handles welcome email
      return json({ ok: true }, 200, headers)
    }

    // Contact already exists — check if they're subscribed or unsubscribed
    const contactRes = await loopsRequest('GET', `/api/v1/contacts?email=${encodeURIComponent(email)}`)
    const existing = Array.isArray(contactRes) ? contactRes[0] : null

    if (existing?.subscribed) {
      return json({ error: 'already_subscribed' }, 200, headers)
    }

    // Was unsubscribed — re-subscribe and return success
    await loopsRequest('PUT', '/api/v1/contacts/update', { email, subscribed: true })
    return json({ ok: true }, 200, headers)

  } catch {
    return json({ error: 'Internal server error' }, 500, headers)
  }
})

// ── Loops helper ─────────────────────────────────────────────────────────────

async function loopsRequest(method: string, path: string, body?: unknown) {
  const res = await fetch(`https://app.loops.so${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${LOOPS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  return res.json()
}

// ── Turnstile ────────────────────────────────────────────────────────────────

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!token) return false
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
    })
    return (await res.json()).success === true
  } catch {
    return false
  }
}

// ── Rate limit ───────────────────────────────────────────────────────────────

// deno-lint-ignore no-explicit-any
async function checkRateLimit(supabase: any, key: string, limit: number, windowMinutes: number): Promise<boolean> {
  try {
    const now = new Date()
    const { data } = await supabase.from('rate_limits').select('count, reset_at').eq('key', key).maybeSingle()
    if (!data || new Date(data.reset_at) <= now) {
      await supabase.from('rate_limits').upsert({ key, count: 1, reset_at: new Date(now.getTime() + windowMinutes * 60000).toISOString() })
      return true
    }
    if (data.count >= limit) return false
    await supabase.from('rate_limits').update({ count: data.count + 1 }).eq('key', key)
    return true
  } catch {
    return true // fail open
  }
}

// ── Shared ───────────────────────────────────────────────────────────────────

function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } })
}

function corsHeaders(origin: string) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return { 'Access-Control-Allow-Origin': allowed, 'Access-Control-Allow-Headers': 'authorization, content-type' }
}
