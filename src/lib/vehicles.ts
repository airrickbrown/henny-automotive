import { supabase } from './supabase'
import { slugify } from './utils'
import type {
  Vehicle,
  VehicleSpec,
  VehicleStatus,
  VehicleCondition,
  VehicleLocation,
  VehicleCategory,
} from '../types/vehicle'

// ── DB row shape (snake_case from Supabase) ───────────────────────────────────

interface DbRow {
  id: string
  slug: string
  make: string
  model: string
  year: number
  trim: string | null
  price: number | null
  spec: VehicleSpec
  images: string[]
  status: string | null
  condition: string
  location: string
  key_features: string[]
  overview: string
  is_featured: boolean
  is_hot_deal: boolean
  show_public_price: boolean
  category: string
  sku: string
  is_available: boolean
  created_at: string
}

function rowToVehicle(row: DbRow): Vehicle {
  return {
    id:              row.id,
    slug:            row.slug,
    make:            row.make,
    model:           row.model,
    year:            row.year,
    trim:            row.trim ?? undefined,
    price:           row.price,
    spec:            row.spec,
    images:          row.images ?? [],
    status:          (row.status as VehicleStatus) ?? undefined,
    condition:       row.condition as VehicleCondition,
    location:        row.location as VehicleLocation,
    keyFeatures:     row.key_features ?? [],
    overview:        row.overview ?? '',
    isFeatured:      row.is_featured,
    isHotDeal:       row.is_hot_deal,
    showPublicPrice: row.show_public_price,
    category:        row.category as VehicleCategory,
    sku:             row.sku,
    createdAt:       row.created_at,
  }
}

// ── Public read ───────────────────────────────────────────────────────────────

export async function getVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('is_available', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as DbRow[]).map(rowToVehicle)
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  if (error || !data) return null
  return rowToVehicle(data as DbRow)
}

export async function getFeaturedVehicles(limit = 4): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('is_featured', true)
    .eq('is_available', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) return []
  return (data as DbRow[]).map(rowToVehicle)
}

export async function getRelatedVehicles(
  category: string,
  excludeId: string,
  limit = 3
): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('category', category)
    .eq('is_available', true)
    .neq('id', excludeId)
    .limit(limit)
  if (error) return []
  return (data as DbRow[]).map(rowToVehicle)
}

// ── Admin read (includes unavailable) ────────────────────────────────────────

export async function getAllVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as DbRow[]).map(rowToVehicle)
}

// ── Admin write ───────────────────────────────────────────────────────────────

export interface VehicleInput {
  slug: string
  make: string
  model: string
  year: number
  trim?: string
  price: number | null
  spec: VehicleSpec
  images: string[]
  status?: VehicleStatus
  condition: VehicleCondition
  location: VehicleLocation
  keyFeatures: string[]
  overview: string
  isFeatured: boolean
  isHotDeal: boolean
  showPublicPrice: boolean
  category: VehicleCategory
  sku: string
}

function inputToDb(v: VehicleInput) {
  return {
    slug:              v.slug,
    make:              v.make,
    model:             v.model,
    year:              v.year,
    trim:              v.trim || null,
    price:             v.price,
    spec:              v.spec,
    images:            v.images,
    status:            v.status || null,
    condition:         v.condition,
    location:          v.location,
    key_features:      v.keyFeatures,
    overview:          v.overview,
    is_featured:       v.isFeatured,
    is_hot_deal:       v.isHotDeal,
    show_public_price: v.showPublicPrice,
    category:          v.category,
    sku:               v.sku,
    is_available:      true,
  }
}

export async function createVehicle(v: VehicleInput): Promise<Vehicle> {
  const { data, error } = await supabase
    .from('vehicles')
    .insert(inputToDb(v))
    .select()
    .single()
  if (error) throw error
  return rowToVehicle(data as DbRow)
}

export async function updateVehicle(id: string, v: Partial<VehicleInput>): Promise<void> {
  const p: Record<string, unknown> = {}
  if (v.slug             !== undefined) p.slug              = v.slug
  if (v.make             !== undefined) p.make              = v.make
  if (v.model            !== undefined) p.model             = v.model
  if (v.year             !== undefined) p.year              = v.year
  if (v.trim             !== undefined) p.trim              = v.trim || null
  if (v.price            !== undefined) p.price             = v.price
  if (v.spec             !== undefined) p.spec              = v.spec
  if (v.images           !== undefined) p.images            = v.images
  if (v.status           !== undefined) p.status            = v.status || null
  if (v.condition        !== undefined) p.condition         = v.condition
  if (v.location         !== undefined) p.location          = v.location
  if (v.keyFeatures      !== undefined) p.key_features      = v.keyFeatures
  if (v.overview         !== undefined) p.overview          = v.overview
  if (v.isFeatured       !== undefined) p.is_featured       = v.isFeatured
  if (v.isHotDeal        !== undefined) p.is_hot_deal       = v.isHotDeal
  if (v.showPublicPrice  !== undefined) p.show_public_price = v.showPublicPrice
  if (v.category         !== undefined) p.category          = v.category
  if (v.sku              !== undefined) p.sku               = v.sku

  const { error } = await supabase.from('vehicles').update(p).eq('id', id)
  if (error) throw error
}

export async function deleteVehicle(id: string): Promise<void> {
  const { error } = await supabase.from('vehicles').delete().eq('id', id)
  if (error) throw error
}

// ── Storage ───────────────────────────────────────────────────────────────────

export async function uploadVehicleImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage
    .from('vehicle-images')
    .upload(path, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from('vehicle-images').getPublicUrl(path)
  return data.publicUrl
}

export async function deleteVehicleImage(url: string): Promise<void> {
  const marker = '/vehicle-images/'
  const idx = url.indexOf(marker)
  if (idx === -1) return
  const path = url.slice(idx + marker.length)
  await supabase.storage.from('vehicle-images').remove([path])
}

// ── Slug helpers ──────────────────────────────────────────────────────────────

export function buildSlug(make: string, model: string, year: string | number): string {
  return slugify(`${make} ${model} ${year}`)
}
