import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const FROM = 'Henny Automotive <hello@hennyautomotive.com>'

serve(async (req) => {
  // Allow CORS from Supabase functions invocations
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() })
  }

  try {
    const { email } = await req.json()
    if (!email) return new Response('Missing email', { status: 400 })

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [email],
        subject: 'Welcome to Henny Automotive',
        html: welcomeHtml(email),
      }),
    })

    const body = await res.json()
    return new Response(JSON.stringify(body), {
      status: res.ok ? 200 : 400,
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

function welcomeHtml(email: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Welcome to Henny Automotive</title>
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

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#ffffff;font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:0.05em;">
                You're in.
              </h2>
              <p style="margin:0 0 16px;color:#9ca3af;font-size:14px;line-height:1.7;">
                Welcome to the Henny Automotive insider list. You're now first in line for:
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td style="padding:6px 0;color:#9ca3af;font-size:14px;">
                    🚗 &nbsp; New container arrivals from the USA
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#9ca3af;font-size:14px;">
                    🔥 &nbsp; Exclusive hot deals before they go public
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#9ca3af;font-size:14px;">
                    🛠️ &nbsp; Parts restocks and service updates
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#9ca3af;font-size:14px;">
                    📦 &nbsp; Import tips and Ghana delivery news
                  </td>
                </tr>
              </table>
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

          <!-- Contact strip -->
          <tr>
            <td style="padding:24px 40px;">
              <p style="margin:0 0 8px;color:#4b5563;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;">
                Questions? Reach us:
              </p>
              <p style="margin:0;color:#6b7280;font-size:13px;">
                📞 059 320 4050 &nbsp;·&nbsp; 📍 Accra, Ghana &nbsp;·&nbsp; Nashville, TN USA
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0A0A0A;padding:20px 40px;text-align:center;">
              <p style="margin:0 0 6px;color:#374151;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">
                © ${new Date().getFullYear()} Henny Automotive. All rights reserved.
              </p>
              <p style="margin:0;color:#374151;font-size:11px;">
                You're receiving this because ${email} subscribed on hennyautomotive.com.
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
