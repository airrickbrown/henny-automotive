import { supabase } from './supabase'

export interface Subscriber {
  id: string
  email: string
  subscribed_at: string
  is_active: boolean
}

export async function subscribeNewsletter(email: string): Promise<{ error: string | null }> {
  const { data: existing } = await supabase
    .from('newsletter_subscribers')
    .select('id, is_active')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle()

  if (existing) {
    if (existing.is_active) return { error: 'already_subscribed' }
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ is_active: true, subscribed_at: new Date().toISOString() })
      .eq('id', existing.id)
    if (error) return { error: 'Subscription failed. Please try again.' }
  } else {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.toLowerCase().trim(), is_active: true })
    if (error) return { error: 'Subscription failed. Please try again.' }
  }

  // Fire-and-forget welcome email via Edge Function
  supabase.functions.invoke('send-welcome-email', {
    body: { email: email.toLowerCase().trim() },
  }).catch(() => {})

  return { error: null }
}

export async function getSubscribers(): Promise<{ data: Subscriber[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false })
  return { data: data as Subscriber[] | null, error: error?.message ?? null }
}

export async function setSubscriberActive(id: string, is_active: boolean): Promise<string | null> {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .update({ is_active })
    .eq('id', id)
  return error?.message ?? null
}

export async function deleteSubscriber(id: string): Promise<string | null> {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .delete()
    .eq('id', id)
  return error?.message ?? null
}

export async function sendNewsletter(subject: string, message: string): Promise<{ error: string | null }> {
  const { error } = await supabase.functions.invoke('send-newsletter', {
    body: { subject, message },
  })
  return { error: error?.message ?? null }
}
