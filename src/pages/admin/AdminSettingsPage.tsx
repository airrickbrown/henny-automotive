import { useState } from 'react'
import { WHATSAPP_NUMBER, SNAPCHAT_HANDLE } from '../../lib/tokens'
import { cn } from '../../lib/utils'

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-low p-7">
      <h2 className="font-headline font-bold uppercase tracking-tight text-white mb-6 pb-4 border-b border-outline-variant/10">
        {title}
      </h2>
      <div className="space-y-5">{children}</div>
    </div>
  )
}

function FieldRow({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
      <div className="sm:w-56 flex-shrink-0">
        <p className="font-label text-xs uppercase tracking-widest text-white font-bold">{label}</p>
        {description && (
          <p className="font-body text-xs text-on-surface-variant mt-1 leading-relaxed">{description}</p>
        )}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

const inputClass =
  'w-full bg-surface-container py-3 px-4 font-body text-sm text-white outline-none focus:ring-1 focus:ring-primary-container transition-all'

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn(
        'relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none',
        value ? 'bg-primary-container' : 'bg-surface-bright'
      )}
      role="switch"
      aria-checked={value}
    >
      <span
        className={cn(
          'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
          value ? 'translate-x-7' : 'translate-x-1'
        )}
      />
    </button>
  )
}

export default function AdminSettingsPage() {
  const [whatsapp, setWhatsapp]     = useState(WHATSAPP_NUMBER)
  const [snapchat, setSnapchat]     = useState(SNAPCHAT_HANDLE)
  const [siteName, setSiteName]     = useState('Henny Automotive')
  const [tagline, setTagline]       = useState('The Kinetic Monolith')
  const [showPrices, setShowPrices] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [saved, setSaved]           = useState(false)

  function handleSave() {
    // In a real app this would persist to a backend/CMS
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-[860px]">

      {/* Title */}
      <div className="mb-8">
        <h1 className="font-headline font-black italic uppercase tracking-tighter text-4xl text-white leading-none">
          Settings
        </h1>
        <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mt-2">
          Site configuration &amp; contact details
        </p>
      </div>

      <div className="space-y-4">

        {/* Contact */}
        <SettingsSection title="Contact Channels">
          <FieldRow label="WhatsApp Number" description="International format. Used for all inquiry CTAs.">
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className={inputClass}
              placeholder="+233000000000"
            />
          </FieldRow>
          <FieldRow label="Snapchat Handle" description="Username only, without @.">
            <input
              type="text"
              value={snapchat}
              onChange={(e) => setSnapchat(e.target.value)}
              className={inputClass}
              placeholder="hennyauto"
            />
          </FieldRow>
        </SettingsSection>

        {/* Brand */}
        <SettingsSection title="Brand">
          <FieldRow label="Site Name">
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className={inputClass}
            />
          </FieldRow>
          <FieldRow label="Tagline">
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className={inputClass}
            />
          </FieldRow>
        </SettingsSection>

        {/* Display */}
        <SettingsSection title="Display Options">
          <FieldRow label="Show Public Prices" description="Master toggle. Overrides per-vehicle showPublicPrice when off.">
            <Toggle value={showPrices} onChange={setShowPrices} />
          </FieldRow>
          <FieldRow label="Maintenance Mode" description="Replaces the site with a coming-soon screen for visitors.">
            <Toggle value={maintenanceMode} onChange={setMaintenanceMode} />
          </FieldRow>
        </SettingsSection>

        {/* Save */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="bg-ignition text-white font-headline font-bold uppercase tracking-widest text-xs px-8 py-4 ignition-glow hover:brightness-110 active:scale-[0.99] transition-all duration-150"
          >
            Save Settings
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 font-label text-xs uppercase tracking-widest text-secondary">
              <span className="font-material-filled text-base">check_circle</span>
              Saved
            </span>
          )}
        </div>

        {/* Note */}
        <p className="font-label text-[10px] text-white/20 uppercase tracking-widest">
          Note: settings are stored in session only — backend persistence requires API integration.
        </p>

      </div>
    </div>
  )
}
