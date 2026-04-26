import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY            = Deno.env.get('RESEND_API_KEY') ?? ''
const SUPABASE_URL              = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const TURNSTILE_SECRET_KEY      = Deno.env.get('TURNSTILE_SECRET_KEY') ?? ''
const FROM = 'Henny Automotive <hello@hennyautomotive.com>'

const ALLOWED_ORIGINS = ['https://hennyautomotive.com', 'http://localhost:5173', 'http://localhost:4173']
const RATE_LIMIT = 5   // max subscriptions
const RATE_WINDOW = 60 // per 60 minutes per IP

serve(async (req) => {
  const origin = req.headers.get('origin') ?? ''
  const headers = corsHeaders(origin)

  if (req.method === 'OPTIONS') return new Response('ok', { headers })

  try {
    const body = await req.json()
    const email        = typeof body?.email        === 'string' ? body.email.toLowerCase().trim() : ''
    const captchaToken = typeof body?.captchaToken === 'string' ? body.captchaToken : ''

    // Validate email
    if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'Invalid email address.' }, 400, headers)
    }

    // Verify Turnstile CAPTCHA (skipped if secret not configured)
    if (TURNSTILE_SECRET_KEY) {
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? ''
      const ok = await verifyTurnstile(captchaToken, ip)
      if (!ok) return json({ error: 'CAPTCHA verification failed. Please try again.' }, 400, headers)
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Rate limit by IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
    const allowed = await checkRateLimit(supabase, `subscribe:${ip}`, RATE_LIMIT, RATE_WINDOW)
    if (!allowed) {
      return json({ error: 'Too many requests. Please try again later.' }, 429, headers)
    }

    // Upsert subscriber
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      if (existing.is_active) return json({ error: 'already_subscribed' }, 200, headers)
      await supabase
        .from('newsletter_subscribers')
        .update({ is_active: true, subscribed_at: new Date().toISOString() })
        .eq('id', existing.id)
    } else {
      const { error: insertErr } = await supabase
        .from('newsletter_subscribers')
        .insert({ email, is_active: true })
      if (insertErr) throw new Error('DB error')
    }

    // Send welcome email (fire-and-forget — don't fail subscription if email fails)
    if (RESEND_API_KEY) {
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: FROM, to: [email], subject: 'Welcome to Henny Automotive', html: welcomeHtml(email) }),
      }).catch(() => {})
    }

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
    return true // fail open — don't block legitimate users on rate-limit errors
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

function welcomeHtml(email: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0" /><title>Welcome to Henny Automotive</title></head>
<body style="margin:0;padding:0;background:#131313;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#131313;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#1C1B1B;border:1px solid rgba(255,255,255,0.05);">
        <tr><td style="background:#E11D2E;padding:32px 40px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:28px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;">HENNY AUTOMOTIVE</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:11px;letter-spacing:0.25em;text-transform:uppercase;">The Kinetic Monolith</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <h2 style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:0.05em;">You're in.</h2>
          <p style="margin:0 0 16px;color:#9ca3af;font-size:14px;line-height:1.7;">Welcome to the Henny Automotive insider list. You're now first in line for:</p>
          <p style="color:#9ca3af;font-size:14px;line-height:2;">🚗 &nbsp;New container arrivals from the USA<br />🔥 &nbsp;Exclusive hot deals before they go public<br />🛠️ &nbsp;Parts restocks and service updates<br />📦 &nbsp;Import tips and Ghana delivery news</p>
          <table cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr><td style="background:#E11D2E;">
            <a href="https://hennyautomotive.com/inventory" style="display:inline-block;padding:14px 32px;color:#fff;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:0.15em;text-decoration:none;">Browse Inventory →</a>
          </td></tr></table>
        </td></tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid rgba(255,255,255,0.05);margin:0;" /></td></tr>
        <tr><td style="padding:24px 40px;">
          <p style="margin:0;color:#6b7280;font-size:13px;">📞 059 320 4050 &nbsp;·&nbsp; 📍 Accra, Ghana &nbsp;·&nbsp; Nashville, TN USA</p>
        </td></tr>
        <tr><td style="background:#0A0A0A;padding:20px 40px;text-align:center;">
          <p style="margin:0 0 6px;color:#374151;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">© ${new Date().getFullYear()} Henny Automotive. All rights reserved.</p>
          <p style="margin:0;color:#374151;font-size:11px;">You're receiving this because ${email} subscribed on hennyautomotive.com.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}
