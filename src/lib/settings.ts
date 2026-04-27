import { supabase } from './supabase'

export interface SiteSettings {
  tagline: string
  site_name: string
  show_prices: boolean
  maintenance_mode: boolean
}

export const SETTING_DEFAULTS: SiteSettings = {
  tagline:          'The Kinetic Monolith',
  site_name:        'Henny Automotive',
  show_prices:      true,
  maintenance_mode: false,
}

type DbRow = { key: string; value: string }

function rowsToSettings(rows: DbRow[]): SiteSettings {
  const map: Record<string, string> = {}
  rows.forEach(r => { map[r.key] = r.value })
  return {
    tagline:          map.tagline          ?? SETTING_DEFAULTS.tagline,
    site_name:        map.site_name        ?? SETTING_DEFAULTS.site_name,
    show_prices:      map.show_prices      !== 'false',
    maintenance_mode: map.maintenance_mode === 'true',
  }
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabase.from('site_settings').select('key, value')
    if (error || !data) return { ...SETTING_DEFAULTS }
    return rowsToSettings(data as DbRow[])
  } catch {
    return { ...SETTING_DEFAULTS }
  }
}

export async function saveAllSettings(s: SiteSettings): Promise<void> {
  const rows: DbRow[] = [
    { key: 'tagline',          value: s.tagline },
    { key: 'site_name',        value: s.site_name },
    { key: 'show_prices',      value: String(s.show_prices) },
    { key: 'maintenance_mode', value: String(s.maintenance_mode) },
  ]
  const { error } = await supabase
    .from('site_settings')
    .upsert(rows, { onConflict: 'key' })
  if (error) throw error
}
