import { useState, useEffect } from 'react'
import { WHATSAPP_NUMBER, SNAPCHAT_URL } from '../../lib/tokens'
import { getAllVehicles } from '../../lib/vehicles'
import { cn } from '../../lib/utils'

function SettingsSection({ title, description, children }: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-surface-container-low p-7">
      <div className="pb-4 mb-6 border-b border-outline-variant/10">
        <h2 className="font-headline font-bold uppercase tracking-tight text-white">{title}</h2>
        {description && (
          <p className="font-body text-xs text-on-surface-variant mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  )
}

function FieldRow({ label, description, children }: {
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

const CONDITIONS = ['NEW (LOW KM)', 'PRE-OWNED USA', 'LOCAL STOCK']

export default function AdminSettingsPage() {
  const [whatsapp, setWhatsapp]     = useState(WHATSAPP_NUMBER)
  const [snapchat, setSnapchat]     = useState(SNAPCHAT_URL)
  const [siteName, setSiteName]     = useState('Henny Automotive')
  const [tagline, setTagline]       = useState('The Kinetic Monolith')
  const [showPrices, setShowPrices] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [saved, setSaved]           = useState(false)

  // Inventory filter data — derived from live vehicles
  const [manufacturers, setManufacturers] = useState<string[]>([])
  const [filtersLoading, setFiltersLoading] = useState(true)

  useEffect(() => {
    getAllVehicles()
      .then((vehicles) => {
        const makes = [...new Set(vehicles.map(v => v.make))].sort()
        setManufacturers(makes)
      })
      .catch(() => {})
      .finally(() => setFiltersLoading(false))
  }, [])

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-[860px]">

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
            <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={inputClass} placeholder="+233000000000" />
          </FieldRow>
          <FieldRow label="Snapchat URL" description="Full Snapchat share link (e.g. snapchat.com/t/...).">
            <input type="text" value={snapchat} onChange={(e) => setSnapchat(e.target.value)} className={inputClass} placeholder="https://snapchat.com/t/..." />
          </FieldRow>
        </SettingsSection>

        {/* Brand */}
        <SettingsSection title="Brand">
          <FieldRow label="Site Name">
            <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} className={inputClass} />
          </FieldRow>
          <FieldRow label="Tagline">
            <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className={inputClass} />
          </FieldRow>
        </SettingsSection>

        {/* Display */}
        <SettingsSection title="Display Options">
          <FieldRow label="Show Public Prices" description="Master toggle. Overrides per-vehicle price display when off.">
            <Toggle value={showPrices} onChange={setShowPrices} />
          </FieldRow>
          <FieldRow label="Maintenance Mode" description="Replaces the site with a coming-soon screen for visitors.">
            <Toggle value={maintenanceMode} onChange={setMaintenanceMode} />
          </FieldRow>
        </SettingsSection>

        {/* Inventory Filters */}
        <SettingsSection
          title="Inventory Filters"
          description="These are the filter values visible to customers on the inventory page. They update automatically as you add or edit vehicles."
        >
          {/* Manufacturers */}
          <FieldRow
            label="Manufacturers"
            description="Auto-generated from your vehicle listings. Add a vehicle with a new make to add it here."
          >
            {filtersLoading ? (
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="font-material text-sm animate-spin">progress_activity</span>
                <span className="font-label text-xs uppercase tracking-wider">Loading…</span>
              </div>
            ) : manufacturers.length === 0 ? (
              <p className="font-body text-sm text-white/30 italic">No vehicles in database yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {manufacturers.map(make => (
                  <span
                    key={make}
                    className="px-3 py-1.5 bg-surface-container border border-outline-variant/20 font-label text-[10px] uppercase tracking-widest text-white flex items-center gap-1.5"
                  >
                    <span className="font-material text-xs text-primary-container">check_circle</span>
                    {make}
                  </span>
                ))}
              </div>
            )}
          </FieldRow>

          {/* Conditions */}
          <FieldRow
            label="Conditions"
            description="These are the fixed condition options available when adding or editing vehicles."
          >
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map(c => (
                <span
                  key={c}
                  className="px-3 py-1.5 bg-surface-container border border-outline-variant/20 font-label text-[10px] uppercase tracking-widest text-white flex items-center gap-1.5"
                >
                  <span className="font-material text-xs text-primary-container">check_circle</span>
                  {c}
                </span>
              ))}
            </div>
          </FieldRow>

          <div className="bg-surface-container border-l-2 border-primary-container/40 px-4 py-3">
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
              <span className="text-primary-container font-bold">Tip:</span>{' '}
              To add a new manufacturer, go to{' '}
              <span className="text-white">Inventory Management</span>{' '}
              and add a vehicle with that make. It will appear automatically in the filter.
            </p>
          </div>
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

        <p className="font-label text-[10px] text-white/20 uppercase tracking-widest">
          Note: settings are stored in session only — backend persistence requires API integration.
        </p>

      </div>
    </div>
  )
}
