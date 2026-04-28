import { supabase } from './supabase'

export interface ImageSlot {
  key: string
  label: string
  defaultPath: string
  description?: string
}

export const IMAGE_SLOTS: ImageSlot[] = [
  { key: 'hero-desktop',    label: 'Hero — Desktop',          defaultPath: '/images/hero-car.jpg',             description: 'Full-screen background on homepage (desktop)' },
  { key: 'hero-mobile',     label: 'Hero — Mobile',           defaultPath: '/images/hero-car-mobile.jpg',      description: 'Full-screen background on homepage (mobile)' },
  { key: 'about-hero',      label: 'About — Hero',            defaultPath: '/images/about-hero.jpg',           description: 'Right-side image on the About page header' },
  { key: 'about-vision',    label: 'About — Vision Photo',    defaultPath: '/images/about-vision.jpg',         description: 'Portrait photo in the origin story section' },
  { key: 'about-usa',       label: 'About — USA Sourcing',    defaultPath: '/images/houston.jpg',              description: 'USA sourcing bento card background' },
  { key: 'about-accra',     label: 'About — Accra Showroom',  defaultPath: '/images/accra.jpg',                description: 'Accra showroom bento card background' },
  { key: 'port',            label: 'Port / Logistics Banner', defaultPath: '/images/port.jpg',                 description: 'Full-bleed banner on About and logistics sections' },
  { key: 'logistics-usa',   label: 'Logistics — USA Port',    defaultPath: '/images/logistics-port-usa.jpg',   description: 'USA logistics section image' },
  { key: 'logistics-ghana', label: 'Logistics — Ghana',       defaultPath: '/images/logistics-workshop-gh.jpg',description: 'Ghana operations section image' },
  { key: 'cta-background',  label: 'CTA Banner Background',   defaultPath: '/images/cta-car-blur.jpg',         description: 'Background behind the homepage CTA strip' },
]

export const DEFAULT_IMAGES: Record<string, string> = Object.fromEntries(
  IMAGE_SLOTS.map(s => [s.key, s.defaultPath])
)

export async function getSiteImages(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('site_images')
    .select('key, url')
  if (error) throw error
  const result: Record<string, string> = {}
  data?.forEach(row => { result[row.key] = row.url })
  return result
}

export async function uploadSiteImage(key: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${key}-${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('site-images')
    .upload(path, file, { cacheControl: '3600', upsert: true })
  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('site-images').getPublicUrl(path)

  const { error: dbError } = await supabase
    .from('site_images')
    .upsert({ key, url: data.publicUrl, updated_at: new Date().toISOString() })
  if (dbError) throw dbError

  return data.publicUrl
}

export async function resetSiteImage(key: string): Promise<void> {
  await supabase.from('site_images').delete().eq('key', key)
}
