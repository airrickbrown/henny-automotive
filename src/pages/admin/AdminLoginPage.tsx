import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../lib/utils'

export default function AdminLoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const ok = login(password)
    if (ok) {
      navigate('/admin', { replace: true })
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
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

      {/* Card */}
      <div
        className={cn(
          'w-full max-w-sm bg-surface-container-low border border-white/5 rounded-lg p-8 transition-transform',
          shake && 'animate-[shake_0.4s_ease]'
        )}
      >
        <h1 className="font-headline text-xl font-black text-white mb-6">Sign In</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-5">
            <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                  setError(false)
                }}
                autoComplete="current-password"
                placeholder="Enter admin password"
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
              <p className="mt-2 font-label text-xs text-red-400">
                Incorrect password. Try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary-container hover:bg-primary-container/90 text-white font-label text-sm font-bold uppercase tracking-wider py-3 rounded transition-colors"
          >
            Sign In
          </button>
        </form>
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
