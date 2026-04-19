import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../lib/utils'
import HennyLogo from '../../components/ui/HennyLogo'

export default function AdminLoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const passwordReset = (location.state as { passwordReset?: boolean } | null)?.passwordReset

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const err = await login(email, password)

    if (!err) {
      navigate('/admin', { replace: true })
    } else {
      setError('Invalid email or password.')
      setShake(true)
      setTimeout(() => setShake(false), 500)
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

      {/* Card */}
      <div
        className={cn(
          'w-full max-w-sm bg-surface-container-low border border-white/5 rounded-lg p-8 transition-transform',
          shake && 'animate-[shake_0.4s_ease]'
        )}
      >
        {passwordReset && (
          <div className="mb-6 flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded px-4 py-3">
            <span className="font-material text-base text-green-400">check_circle</span>
            <p className="font-label text-xs text-green-400 uppercase tracking-wider">Password updated — please sign in.</p>
          </div>
        )}
        <h1 className="font-headline text-xl font-black text-white mb-6">Sign In</h1>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="mb-4">
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
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                autoComplete="current-password"
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
                onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white transition-colors"
                aria-label={show ? 'Hide password' : 'Show password'}
              >
                <span className="font-material text-lg">{show ? 'visibility_off' : 'visibility'}</span>
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
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 text-center">
          <Link
            to="/admin/forgot-password"
            className="font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      {/* Back to site */}
      <a
        href="/"
        className="mt-8 font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors"
      >
        ← Back to site
      </a>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
      `}</style>
    </div>
  )
}
