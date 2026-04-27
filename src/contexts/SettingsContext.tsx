import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { getSettings, SETTING_DEFAULTS, type SiteSettings } from '../lib/settings'

const SettingsContext = createContext<SiteSettings>(SETTING_DEFAULTS)

export function useSettings() {
  return useContext(SettingsContext)
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(SETTING_DEFAULTS)

  useEffect(() => {
    getSettings().then(setSettings).catch(() => {})

    // Subscribe to real-time changes so any admin update reflects immediately
    const channel = supabase
      .channel('site_settings_rt')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings' },
        () => { getSettings().then(setSettings).catch(() => {}) }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  )
}
