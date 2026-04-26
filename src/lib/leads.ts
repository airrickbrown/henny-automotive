import { supabase } from './supabase'

export type LeadStatus = 'new' | 'contacted' | 'closed'
export type LeadSource = 'contact_form'

export interface Lead {
  id: string
  name: string
  phone: string
  interest: string
  message: string
  source: LeadSource
  status: LeadStatus
  createdAt: string // ISO 8601 — mapped from DB created_at
}

// ── DB row shape (snake_case from Supabase) ───────────────────────────────────

interface DbRow {
  id: string
  name: string
  phone: string | null
  interest: string | null
  message: string | null
  source: string
  status: string
  created_at: string
}

function rowToLead(row: DbRow): Lead {
  return {
    id:        row.id,
    name:      row.name,
    phone:     row.phone    ?? '',
    interest:  row.interest ?? '',
    message:   row.message  ?? '',
    source:    row.source   as LeadSource,
    status:    row.status   as LeadStatus,
    createdAt: row.created_at,
  }
}

// ── Read ──────────────────────────────────────────────────────────────────────

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as DbRow[]).map(rowToLead)
}

// ── Write ─────────────────────────────────────────────────────────────────────

export async function saveLead(
  data: Omit<Lead, 'id' | 'status' | 'createdAt'>,
  captchaToken = '',
): Promise<void> {
  const { error } = await supabase.functions.invoke('submit-contact', {
    body: {
      name:         data.name,
      phone:        data.phone    || '',
      interest:     data.interest || '',
      message:      data.message  || '',
      captchaToken,
    },
  })
  if (error) throw error
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  const { error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', id)

  if (error) throw error
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function formatLeadDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  })
}
