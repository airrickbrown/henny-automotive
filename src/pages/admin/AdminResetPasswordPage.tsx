import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { cn } from '../../lib/utils'

export default function AdminResetPasswordPage() {
  const navigate = useNavigate()

  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Supabase fires PASSWORD_RECOVERY when the user arrives via the email link.
  // Until that event fires we show a loading state so the form doesn't flash.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    setError('')

    const { error: err } = await supabase.auth.updateUser({ password })

    if (err) {
      setError('Could not update password. Please request a new reset link.')
      setLoading(false)
    } else {
      await supabase.auth.signOut()
      navigate('/admin/login', { state: { passwordReset: true }, replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">

      {/* Wordmark */}
      <div className="mb-10 text-center">
        <span className="font-headline text-3xl font-black italic text-primary-container tracking-tighter">
          HENNY
        </span>
        <span className="font-headline text-3xl font-black italic text-white tracking-tighter ml-2">
          AUTOMOTIVE
        </span>
        <p className="font-label text-xs uppercase tracking-[0.25em] text-on-surface-variant mt-2">
          Admin Portal
        </p>
      </div>

      <div className="w-full max-w-sm bg-surface-container-low border border-white/5 rounded-lg p-8">
        {!ready ? (
          <div className="text-center py-4">
            <p className="font-body text-sm text-on-surface-variant">Verifying reset link…</p>
          </div>
        ) : (
          <>
            <h1 className="font-headline text-xl font-black text-white mb-2">Set new password</h1>
            <p className="font-body text-sm text-on-surface-variant mb-6">
              Choose a strong password for your admin account.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              {/* New password */}
              <div className="mb-4">
                <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    required
                    className={cn(
                      'w-full bg-surface-container border rounded px-4 py-3 pr-12',
                      'font-body text-sm text-white placeholder:text-on-surface-variant/40',
                      'outline-none transition-colors',
                      error
                        ? 'border-red-500 focus:border-red-400'
                        : 'border-white/10 focus:border-primary-container/60'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <span className="font-material text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div className="mb-5">
                <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={e => { setConfirm(e.target.value); setError('') }}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    required
                    className={cn(
                      'w-full bg-surface-container border rounded px-4 py-3 pr-12',
                      'font-body text-sm text-white placeholder:text-on-surface-variant/40',
                      'outline-none transition-colors',
                      error
                        ? 'border-red-500 focus:border-red-400'
                        : 'border-white/10 focus:border-primary-container/60'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white transition-colors"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    <span className="font-material text-lg">{showConfirm ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
                {error && (
                  <p className="mt-2 font-label text-xs text-red-400">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-container hover:bg-primary-container/90 disabled:opacity-50 text-white font-label text-sm font-bold uppercase tracking-wider py-3 rounded transition-colors"
              >
                {loading ? 'Saving…' : 'Set New Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
