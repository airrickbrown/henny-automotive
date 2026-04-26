import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL              = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const TURNSTILE_SECRET_KEY      = Deno.env.get('TURNSTILE_SECRET_KEY') ?? ''

const ALLOWED_ORIGINS = ['https://hennyautomotive.com', 'http://localhost:5173', 'http://localhost:4173']
const RATE_LIMIT = 10  // max contact submissions
const RATE_WINDOW = 60 // per 60 minutes per IP

serve(async (req) => {
  const origin = req.headers.get('origin') ?? ''
  const headers = corsHeaders(origin)

  if (req.method === 'OPTIONS') return new Response('ok', { headers })

  try {
    const body = await req.json()
    const name         = typeof body?.name         === 'string' ? body.name.trim()         : ''
    const phone        = typeof body?.phone        === 'string' ? body.phone.trim()        : ''
    const interest     = typeof body?.interest     === 'string' ? body.interest.trim()     : ''
    const message      = typeof body?.message      === 'string' ? body.message.trim()      : ''
    const captchaToken = typeof body?.captchaToken === 'string' ? body.captchaToken        : ''

    // Validate required fields and lengths
    if (!name || name.length > 100) {
      return json({ error: 'Name is required (max 100 characters).' }, 400, headers)
    }
    if (phone.length > 30)    return json({ error: 'Phone number too long.'  }, 400, headers)
    if (interest.length > 100) return json({ error: 'Interest value too long.' }, 400, headers)
    if (message.length > 2000) return json({ error: 'Message too long (max 2000 characters).' }, 400, headers)

    // Verify Turnstile CAPTCHA (skipped if secret not configured)
    if (TURNSTILE_SECRET_KEY) {
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? ''
      const ok = await verifyTurnstile(captchaToken, ip)
      if (!ok) return json({ error: 'CAPTCHA verification failed. Please try again.' }, 400, headers)
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Rate limit by IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
    const allowed = await checkRateLimit(supabase, `contact:${ip}`, RATE_LIMIT, RATE_WINDOW)
    if (!allowed) {
      return json({ error: 'Too many requests. Please try again later.' }, 429, headers)
    }

    const { error: insertErr } = await supabase
      .from('leads')
      .insert({
        name,
        phone:    phone    || null,
        interest: interest || null,
        message:  message  || null,
        source:   'contact_form',
      })

    if (insertErr) throw new Error('DB error')

    return json({ ok: true }, 200, headers)
  } catch {
    return json({ error: 'Internal server error' }, 500, headers)
  }
})

// ── Helpers ──────────────────────────────────────────────────────────────────

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!token) return false
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
    })
    const data = await res.json()
    return data.success === true
  } catch {
    return false
  }
}

async function checkRateLimit(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  key: string,
  limit: number,
  windowMinutes: number,
): Promise<boolean> {
  try {
    const now = new Date()
    const { data } = await supabase
      .from('rate_limits')
      .select('count, reset_at')
      .eq('key', key)
      .maybeSingle()

    if (!data || new Date(data.reset_at) <= now) {
      const resetAt = new Date(now.getTime() + windowMinutes * 60 * 1000)
      await supabase.from('rate_limits').upsert({ key, count: 1, reset_at: resetAt.toISOString() })
      return true
    }
    if (data.count >= limit) return false
    await supabase.from('rate_limits').update({ count: data.count + 1 }).eq('key', key)
    return true
  } catch {
    return true // fail open
  }
}

function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  })
}

function corsHeaders(origin: string) {
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, content-type',
  }
}
