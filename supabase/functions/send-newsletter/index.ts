import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const FROM = 'Henny Automotive <hello@hennyautomotive.com>'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() })
  }

  // Require authenticated admin user
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders() })
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authErr } = await supabaseAdmin.auth.getUser(token)
  if (authErr || !user) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders() })
  }

  try {
    const { subject, message } = await req.json()
    if (!subject || !message) {
      return new Response('Missing subject or message', { status: 400, headers: corsHeaders() })
    }

    // Fetch all active subscribers
    const { data: subscribers, error: dbErr } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('email')
      .eq('is_active', true)

    if (dbErr) throw new Error(dbErr.message)
    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders() },
      })
    }

    // Use Resend batch API (max 100 per request)
    const emails = subscribers.map((s: { email: string }) => ({
      from: FROM,
      to: [s.email],
      subject,
      html: newsletterHtml(subject, message),
    }))

    // Send in chunks of 100
    const CHUNK = 100
    let sent = 0
    for (let i = 0; i < emails.length; i += CHUNK) {
      const chunk = emails.slice(i, i + CHUNK)
      const res = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chunk),
      })
      if (!res.ok) {
        const err = await res.text()
        throw new Error(`Resend batch error: ${err}`)
      }
      sent += chunk.length
    }

    return new Response(JSON.stringify({ sent }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    })
  }
})

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, content-type',
  }
}

function newsletterHtml(subject: string, message: string): string {
  // Convert plain newlines to <br> for readability
  const body = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br />')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#131313;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#131313;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#1C1B1B;border:1px solid rgba(255,255,255,0.05);">

          <!-- Header -->
          <tr>
            <td style="background:#E11D2E;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;">
                HENNY AUTOMOTIVE
              </h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:11px;letter-spacing:0.25em;text-transform:uppercase;">
                The Kinetic Monolith
              </p>
            </td>
          </tr>

          <!-- Subject line -->
          <tr>
            <td style="padding:32px 40px 0;">
              <h2 style="margin:0;color:#ffffff;font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:0.05em;">
                ${subject}
              </h2>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:20px 40px 40px;">
              <p style="margin:0;color:#9ca3af;font-size:14px;line-height:1.8;">
                ${body}
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 40px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#E11D2E;">
                    <a href="https://hennyautomotive.com/inventory"
                       style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:0.15em;text-decoration:none;">
                      Browse Inventory →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid rgba(255,255,255,0.05);margin:0;" />
            </td>
          </tr>

          <!-- Contact -->
          <tr>
            <td style="padding:24px 40px;">
              <p style="margin:0;color:#6b7280;font-size:13px;">
                📞 059 320 4050 &nbsp;·&nbsp; 📍 Accra, Ghana &nbsp;·&nbsp; Nashville, TN USA
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0A0A0A;padding:20px 40px;text-align:center;">
              <p style="margin:0;color:#374151;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">
                © ${new Date().getFullYear()} Henny Automotive · All rights reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
