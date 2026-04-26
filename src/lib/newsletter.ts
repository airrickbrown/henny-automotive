import { supabase } from './supabase'

export interface Subscriber {
  id: string
  email: string
  subscribed_at: string
  is_active: boolean
}

export async function subscribeNewsletter(
  email: string,
  captchaToken = '',
): Promise<{ error: string | null }> {
  const { data, error } = await supabase.functions.invoke('subscribe', {
    body: { email, captchaToken },
  })
  if (error) return { error: 'Subscription failed. Please try again.' }
  if (data?.error) return { error: data.error }
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
