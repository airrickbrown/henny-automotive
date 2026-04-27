import { useState, useEffect, useCallback } from 'react'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { getAllVehicles } from '../../lib/vehicles'
import { getSettings, saveAllSettings, type SiteSettings } from '../../lib/settings'
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
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')

  const [manufacturers, setManufacturers]     = useState<string[]>([])
  const [filtersLoading, setFiltersLoading]   = useState(true)

  useEffect(() => {
    getSettings()
      .then(s => { setSettings(s); setLoading(false) })
      .catch(() => setLoading(false))

    getAllVehicles()
      .then(vehicles => {
        const makes = [...new Set(vehicles.map(v => v.make))].sort()
        setManufacturers(makes)
      })
      .catch(() => {})
      .finally(() => setFiltersLoading(false))
  }, [])

  const update = useCallback(<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setSettings(prev => prev ? { ...prev, [key]: value } : prev)
    setSaveStatus('idle')
  }, [])

  async function handleSave() {
    if (!settings) return
    setSaving(true)
    setSaveStatus('idle')
    try {
      await saveAllSettings(settings)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch {
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !settings) {
    return (
      <div className="flex items-center gap-3 text-on-surface-variant py-16">
        <Loader2 size={18} className="animate-spin" />
        <span className="font-label text-xs uppercase tracking-widest">Loading settings…</span>
      </div>
    )
  }

  return (
    <div className="max-w-[860px]">

      <div className="mb-8">
        <h1 className="font-headline font-black italic uppercase tracking-tighter text-4xl text-white leading-none">
          Settings
        </h1>
        <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mt-2">
          Site configuration — changes save to the database and reflect live
        </p>
      </div>

      <div className="space-y-4">

        {/* Brand */}
        <SettingsSection title="Brand">
          <FieldRow label="Site Name">
            <input
              type="text"
              value={settings.site_name}
              onChange={e => update('site_name', e.target.value)}
              className={inputClass}
            />
          </FieldRow>
          <FieldRow
            label="Tagline"
            description="Shown on the homepage hero and meta title. Keep it short and punchy."
          >
            <input
              type="text"
              value={settings.tagline}
              onChange={e => update('tagline', e.target.value)}
              className={inputClass}
              placeholder="The Kinetic Monolith"
            />
          </FieldRow>
        </SettingsSection>

        {/* Display */}
        <SettingsSection title="Display Options">
          <FieldRow label="Show Public Prices" description="Master toggle. When off, all prices show as 'Price on Request'.">
            <Toggle value={settings.show_prices} onChange={v => update('show_prices', v)} />
          </FieldRow>
          <FieldRow label="Maintenance Mode" description="Replaces the site with a coming-soon screen for visitors.">
            <Toggle value={settings.maintenance_mode} onChange={v => update('maintenance_mode', v)} />
          </FieldRow>
        </SettingsSection>

        {/* Inventory Filters */}
        <SettingsSection
          title="Inventory Filters"
          description="These update automatically as you add or edit vehicles."
        >
          <FieldRow
            label="Manufacturers"
            description="Auto-generated from your vehicle listings."
          >
            {filtersLoading ? (
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Loader2 size={14} className="animate-spin" />
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
                    <CheckCircle2 size={12} className="text-primary-container" />
                    {make}
                  </span>
                ))}
              </div>
            )}
          </FieldRow>

          <FieldRow label="Conditions" description="Fixed condition options for vehicle listings.">
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map(c => (
                <span
                  key={c}
                  className="px-3 py-1.5 bg-surface-container border border-outline-variant/20 font-label text-[10px] uppercase tracking-widest text-white flex items-center gap-1.5"
                >
                  <CheckCircle2 size={12} className="text-primary-container" />
                  {c}
                </span>
              ))}
            </div>
          </FieldRow>
        </SettingsSection>

        {/* Save */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-ignition text-white font-headline font-bold uppercase tracking-widest text-xs px-8 py-4 ignition-glow hover:brightness-110 active:scale-[0.99] transition-all duration-150 disabled:opacity-60 flex items-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? 'Saving…' : 'Save Settings'}
          </button>

          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1.5 font-label text-xs uppercase tracking-widest text-secondary">
              <CheckCircle2 size={16} />
              Saved — live on site
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="flex items-center gap-1.5 font-label text-xs uppercase tracking-widest text-red-400">
              <AlertCircle size={16} />
              Save failed — check Supabase connection
            </span>
          )}
        </div>

        {/* SQL migration hint */}
        <div className="bg-surface-container-low border-l-2 border-white/10 px-4 py-3">
          <p className="font-label text-[10px] uppercase tracking-widest text-white/30">
            <span className="text-white/50 font-bold">Setup:</span>{' '}
            Run this SQL in your Supabase dashboard if the settings table does not exist yet:
          </p>
          <pre className="font-mono text-[10px] text-white/30 mt-2 whitespace-pre-wrap leading-relaxed">
{`CREATE TABLE IF NOT EXISTS site_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
INSERT INTO site_settings (key, value) VALUES
  ('tagline',          'The Kinetic Monolith'),
  ('site_name',        'Henny Automotive'),
  ('show_prices',      'true'),
  ('maintenance_mode', 'false')
ON CONFLICT (key) DO NOTHING;`}
          </pre>
        </div>

      </div>
    </div>
  )
}
