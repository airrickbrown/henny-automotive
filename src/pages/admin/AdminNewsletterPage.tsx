const LOOPS_DASHBOARD = 'https://app.loops.so'

interface SetupStep {
  label: string
  detail: string
}

const SETUP_STEPS: SetupStep[] = [
  {
    label: 'Add LOOPS_API_KEY to Edge Function Secrets',
    detail: 'Supabase Dashboard → Edge Functions → Secrets → Add LOOPS_API_KEY',
  },
  {
    label: 'Create a "Welcome" transactional email in Loops',
    detail: 'Loops → Emails → New email → Transactional. Copy the transactional ID.',
  },
  {
    label: 'Set up a Contact Created automation',
    detail: 'Loops → Automations → New → Trigger: Contact Added → Action: Send welcome email.',
  },
  {
    label: 'Deploy the subscribe Edge Function',
    detail: 'Run: supabase functions deploy subscribe',
  },
  {
    label: 'Delete deprecated Edge Functions from Supabase',
    detail: 'Remove send-newsletter and send-welcome-email in Supabase Dashboard → Edge Functions.',
  },
]

export default function AdminNewsletterPage() {
  return (
    <div className="max-w-2xl">

      <div className="mb-8">
        <h1 className="font-headline font-black italic uppercase tracking-tighter text-4xl text-white leading-none">
          Newsletter
        </h1>
        <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mt-2">
          Powered by Loops
        </p>
      </div>

      {/* Primary CTA */}
      <a
        href={LOOPS_DASHBOARD}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between bg-surface-container-low p-6 hover:bg-surface-container-high transition-colors duration-150 mb-3"
      >
        <div className="flex items-center gap-4">
          <span className="font-material text-2xl text-primary-container">open_in_new</span>
          <div>
            <p className="font-headline font-bold uppercase text-white tracking-tight">
              Open Loops Dashboard
            </p>
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-0.5">
              Manage subscribers · Send campaigns · View analytics
            </p>
          </div>
        </div>
        <span className="font-material text-xl text-white/20 group-hover:text-white/60 transition-colors">
          arrow_forward
        </span>
      </a>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {[
          { label: 'Contacts',    path: '/contacts',    icon: 'group' },
          { label: 'Campaigns',   path: '/campaigns',   icon: 'campaign' },
          { label: 'Automations', path: '/automations', icon: 'bolt' },
        ].map(({ label, path, icon }) => (
          <a
            key={label}
            href={`${LOOPS_DASHBOARD}${path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 bg-surface-container-low p-4 hover:bg-surface-container-high transition-colors duration-150 text-center"
          >
            <span className="font-material text-xl text-primary-container">{icon}</span>
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">{label}</p>
          </a>
        ))}
      </div>

      {/* One-time setup checklist */}
      <div className="bg-surface-container-low p-6 mb-3">
        <h2 className="font-headline font-bold uppercase tracking-tight text-white mb-1">
          One-Time Setup
        </h2>
        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-6">
          Complete these steps to go live
        </p>
        <ol className="space-y-5">
          {SETUP_STEPS.map((step, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="font-label text-[10px] font-black text-primary-container mt-0.5 w-5 flex-shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="font-label text-xs font-bold uppercase tracking-widest text-white">
                  {step.label}
                </p>
                <p className="font-body text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* How it works */}
      <div className="bg-surface-container-low p-6">
        <h2 className="font-headline font-bold uppercase tracking-tight text-white mb-4">
          How It Works
        </h2>
        <div className="space-y-3">
          {[
            { icon: 'person_add',      text: 'Visitor enters email in the footer form on the site' },
            { icon: 'verified',        text: 'Cloudflare Turnstile verifies human; rate limiter blocks floods' },
            { icon: 'sync',            text: 'subscribe Edge Function adds them to Loops as a contact' },
            { icon: 'mark_email_read', text: 'Loops automation fires the welcome email automatically' },
            { icon: 'campaign',        text: 'You compose and send campaigns directly in Loops' },
          ].map(({ icon, text }, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="font-material text-base text-primary-container flex-shrink-0 mt-0.5">{icon}</span>
              <p className="font-body text-sm text-on-surface-variant">{text}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
