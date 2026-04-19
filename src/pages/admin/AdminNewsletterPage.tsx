import { useState, useEffect, type FormEvent } from 'react'
import {
  getSubscribers,
  setSubscriberActive,
  deleteSubscriber,
  sendNewsletter,
  type Subscriber,
} from '../../lib/newsletter'
import { cn } from '../../lib/utils'

function StatCard({ label, value, icon }: { label: string; value: number | string; icon: string }) {
  return (
    <div className="bg-surface-container-low p-5 flex items-center gap-4">
      <span className="font-material text-2xl text-primary-container">{icon}</span>
      <div>
        <p className="font-headline font-black text-2xl text-white leading-none">{value}</p>
        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">{label}</p>
      </div>
    </div>
  )
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Compose state
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ ok: boolean; msg: string } | null>(null)

  // Per-row action state
  const [busyId, setBusyId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const { data, error: err } = await getSubscribers()
    if (err) setError(err)
    else setSubscribers(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleToggle(sub: Subscriber) {
    setBusyId(sub.id)
    await setSubscriberActive(sub.id, !sub.is_active)
    setSubscribers(prev =>
      prev.map(s => s.id === sub.id ? { ...s, is_active: !s.is_active } : s)
    )
    setBusyId(null)
  }

  async function handleDelete(id: string) {
    setBusyId(id)
    await deleteSubscriber(id)
    setSubscribers(prev => prev.filter(s => s.id !== id))
    setConfirmDeleteId(null)
    setBusyId(null)
  }

  async function handleSend(e: FormEvent) {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) return
    setSending(true)
    setSendResult(null)
    const { error: err } = await sendNewsletter(subject, message)
    if (err) {
      setSendResult({ ok: false, msg: 'Failed to send. Check your Resend configuration.' })
    } else {
      setSendResult({ ok: true, msg: 'Newsletter sent to all active subscribers.' })
      setSubject('')
      setMessage('')
    }
    setSending(false)
  }

  const active = subscribers.filter(s => s.is_active).length
  const inactive = subscribers.filter(s => !s.is_active).length

  return (
    <div className="max-w-4xl">

      <div className="mb-8">
        <h1 className="font-headline font-black italic uppercase tracking-tighter text-4xl text-white leading-none">
          Newsletter
        </h1>
        <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mt-2">
          Subscribers &amp; email campaigns
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <StatCard label="Total" value={subscribers.length} icon="group" />
        <StatCard label="Active" value={active} icon="mark_email_read" />
        <StatCard label="Unsubscribed" value={inactive} icon="unsubscribe" />
      </div>

      {/* Compose */}
      <div className="bg-surface-container-low p-7 mb-4">
        <h2 className="font-headline font-bold uppercase tracking-tight text-white mb-1">
          Compose &amp; Send
        </h2>
        <p className="font-body text-xs text-on-surface-variant mb-6">
          Send an email to all active subscribers ({active}).
        </p>
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. New arrivals from the USA 🚗"
              required
              disabled={sending}
              className="w-full bg-surface-container py-3 px-4 font-body text-sm text-white outline-none focus:ring-1 focus:ring-primary-container transition-all disabled:opacity-60"
            />
          </div>
          <div>
            <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Write your newsletter content here..."
              required
              rows={8}
              disabled={sending}
              className="w-full bg-surface-container py-3 px-4 font-body text-sm text-white outline-none focus:ring-1 focus:ring-primary-container transition-all resize-y disabled:opacity-60"
            />
          </div>
          {sendResult && (
            <div className={cn(
              'flex items-center gap-2 px-4 py-3 border',
              sendResult.ok
                ? 'bg-secondary/10 border-secondary/20'
                : 'bg-red-500/10 border-red-500/20'
            )}>
              <span className={cn(
                'font-material-filled text-base',
                sendResult.ok ? 'text-secondary' : 'text-red-400'
              )}>
                {sendResult.ok ? 'check_circle' : 'error'}
              </span>
              <p className={cn(
                'font-label text-xs uppercase tracking-wider',
                sendResult.ok ? 'text-secondary' : 'text-red-400'
              )}>
                {sendResult.msg}
              </p>
            </div>
          )}
          <div className="flex items-center gap-4 pt-1">
            <button
              type="submit"
              disabled={sending || active === 0}
              className="bg-ignition text-white font-headline font-bold uppercase tracking-widest text-xs px-8 py-4 ignition-glow hover:brightness-110 active:scale-[0.99] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? 'Sending…' : `Send to ${active} Subscriber${active === 1 ? '' : 's'}`}
            </button>
            {active === 0 && (
              <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">
                No active subscribers.
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Subscriber list */}
      <div className="bg-surface-container-low p-7">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline font-bold uppercase tracking-tight text-white">
            Subscribers
          </h2>
          <button
            onClick={load}
            className="flex items-center gap-1.5 font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors"
          >
            <span className="font-material text-sm">refresh</span>
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-on-surface-variant py-8 justify-center">
            <span className="font-material text-xl animate-spin">progress_activity</span>
            <span className="font-label text-xs uppercase tracking-wider">Loading…</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-red-400 py-8 justify-center">
            <span className="font-material text-xl">error</span>
            <span className="font-label text-xs uppercase tracking-wider">{error}</span>
          </div>
        ) : subscribers.length === 0 ? (
          <p className="font-body text-sm text-on-surface-variant text-center py-8">
            No subscribers yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant pb-3 pr-4">Email</th>
                  <th className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant pb-3 pr-4">Subscribed</th>
                  <th className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant pb-3 pr-4">Status</th>
                  <th className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {subscribers.map(sub => (
                  <tr key={sub.id} className={cn(!sub.is_active && 'opacity-50')}>
                    <td className="py-3 pr-4 font-body text-sm text-white">
                      {sub.email}
                    </td>
                    <td className="py-3 pr-4 font-label text-xs text-on-surface-variant whitespace-nowrap">
                      {new Date(sub.subscribed_at).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={cn(
                        'font-label text-[10px] uppercase tracking-wider px-2 py-1',
                        sub.is_active
                          ? 'bg-secondary/10 text-secondary'
                          : 'bg-white/5 text-on-surface-variant'
                      )}>
                        {sub.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3">
                      {confirmDeleteId === sub.id ? (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleDelete(sub.id)}
                            disabled={busyId === sub.id}
                            className="font-label text-xs uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                          >
                            {busyId === sub.id ? 'Deleting…' : 'Confirm delete'}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="font-label text-xs uppercase tracking-wider text-on-surface-variant hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleToggle(sub)}
                            disabled={busyId === sub.id}
                            className="font-label text-xs uppercase tracking-wider text-on-surface-variant hover:text-white transition-colors disabled:opacity-50"
                          >
                            {busyId === sub.id
                              ? '…'
                              : sub.is_active ? 'Unsubscribe' : 'Reactivate'}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(sub.id)}
                            className="font-label text-xs uppercase tracking-wider text-red-500/70 hover:text-red-400 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
