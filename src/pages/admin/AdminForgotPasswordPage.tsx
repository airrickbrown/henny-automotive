import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { cn } from '../../lib/utils'
import HennyLogo from '../../components/ui/HennyLogo'

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    })

    if (err) {
      setError('Something went wrong. Please try again.')
    } else {
      setSent(true)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <div className="mb-10 text-center">
        <HennyLogo width={160} className="mx-auto" />
        <p className="font-label text-xs uppercase tracking-[0.25em] text-on-surface-variant mt-4">
          Admin Portal
        </p>
      </div>

      <div className="w-full max-w-sm bg-surface-container-low border border-white/5 rounded-lg p-8">
        {sent ? (
          <div className="text-center">
            <MailCheck size={36} className="text-primary-container block mb-4" />
            <h1 className="font-headline text-xl font-black text-white mb-3">Check your email</h1>
            <p className="font-body text-sm text-on-surface-variant mb-6">
              We sent a password reset link to <span className="text-white">{email}</span>.
            </p>
            <Link
              to="/admin/login"
              className="font-label text-xs uppercase tracking-widest text-primary-container hover:text-white transition-colors"
            >
              ← Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-headline text-xl font-black text-white mb-2">Forgot password?</h1>
            <p className="font-body text-sm text-on-surface-variant mb-6">
              Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-5">
                <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  autoComplete="email"
                  placeholder="admin@example.com"
                  required
                  className={cn(
                    'w-full bg-surface-container border rounded px-4 py-3',
                    'font-body text-sm text-white placeholder:text-on-surface-variant/40',
                    'outline-none transition-colors',
                    error
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-white/10 focus:border-primary-container/60'
                  )}
                />
                {error && (
                  <p className="mt-2 font-label text-xs text-red-400">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-container hover:bg-primary-container/90 disabled:opacity-50 text-white font-label text-sm font-bold uppercase tracking-wider py-3 rounded transition-colors"
              >
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/admin/login"
                className="font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors"
              >
                ← Back to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
