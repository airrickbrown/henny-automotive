import { supabase } from './supabase'

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
