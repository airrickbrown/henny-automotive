import { supabase } from './supabase'
import { slugify } from './utils'
import type { Part, PartCategory, PartStatus } from '../types/part'

// ── DB row shape (snake_case from Supabase) ───────────────────────────────────

interface DbRow {
  id: string
  slug: string
  name: string
  category: string
  description: string
  image: string
  status: string | null
  compatible_makes: string[]
  whatsapp_message: string
  is_available: boolean
  created_at: string
}

function rowToPart(row: DbRow): Part {
  return {
    id:              row.id,
    slug:            row.slug,
    name:            row.name,
    category:        row.category as PartCategory,
    description:     row.description,
    image:           row.image,
    status:          (row.status as PartStatus) ?? null,
    compatibleMakes: row.compatible_makes ?? [],
    whatsappMessage: row.whatsapp_message,
  }
}

// ── Input type (used for create/update) ──────────────────────────────────────

export interface PartInput {
  name: string
  category: PartCategory
  description: string
  image: string
  status: PartStatus
  compatibleMakes: string[]
  whatsappMessage: string
}

function inputToDb(input: PartInput) {
  return {
    slug:             slugify(input.name),
    name:             input.name,
    category:         input.category,
    description:      input.description,
    image:            input.image,
    status:           input.status,
    compatible_makes: input.compatibleMakes,
    whatsapp_message: input.whatsappMessage,
  }
}

// ── Public read (available only) ─────────────────────────────────────────────

export async function getParts(): Promise<Part[]> {
  const { data, error } = await supabase
    .from('parts')
    .select('*')
    .eq('is_available', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as DbRow[]).map(rowToPart)
}

// ── Admin read (all, including unavailable) ───────────────────────────────────

export async function getAllParts(): Promise<Part[]> {
  const { data, error } = await supabase
    .from('parts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as DbRow[]).map(rowToPart)
}

// ── Admin write ───────────────────────────────────────────────────────────────

export async function createPart(input: PartInput): Promise<Part> {
  const { data, error } = await supabase
    .from('parts')
    .insert(inputToDb(input))
    .select()
    .single()
  if (error) throw error
  return rowToPart(data as DbRow)
}

export async function updatePart(id: string, input: Partial<PartInput>): Promise<void> {
  const patch: Record<string, unknown> = {}
  if (input.name            !== undefined) { patch.name = input.name; patch.slug = slugify(input.name) }
  if (input.category        !== undefined) patch.category         = input.category
  if (input.description     !== undefined) patch.description      = input.description
  if (input.image           !== undefined) patch.image            = input.image
  if (input.status          !== undefined) patch.status           = input.status
  if (input.compatibleMakes !== undefined) patch.compatible_makes = input.compatibleMakes
  if (input.whatsappMessage !== undefined) patch.whatsapp_message = input.whatsappMessage

  const { error } = await supabase.from('parts').update(patch).eq('id', id)
  if (error) throw error
}

export async function deletePart(id: string): Promise<void> {
  const { error } = await supabase.from('parts').delete().eq('id', id)
  if (error) throw error
}
