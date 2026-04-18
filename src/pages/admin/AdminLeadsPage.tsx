export default function AdminLeadsPage() {
  return (
    <div className="max-w-[1200px]">

      {/* Title */}
      <div className="mb-8">
        <h1 className="font-headline font-black italic uppercase tracking-tighter text-4xl text-white leading-none">
          Leads
        </h1>
        <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mt-2">
          Customer enquiries &amp; contact requests
        </p>
      </div>

      {/* Coming soon state */}
      <div className="bg-surface-container-low border border-outline-variant/10 flex flex-col items-center justify-center py-32 text-center px-6">
        <span className="font-material text-5xl text-white/10 block mb-4">person</span>
        <p className="font-headline font-black italic uppercase text-white/30 text-2xl mb-2">
          Coming Soon
        </p>
        <p className="font-body text-sm text-on-surface-variant max-w-sm leading-relaxed">
          Lead capture from the Contact page and WhatsApp inquiries will appear
          here once the backend integration is live.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg">
          {[
            { icon: 'chat',    label: 'WhatsApp Leads',  value: '—' },
            { icon: 'mail',    label: 'Form Submissions', value: '—' },
            { icon: 'percent', label: 'Conversion Rate',  value: '—' },
          ].map((s) => (
            <div key={s.label} className="bg-surface-container p-5 text-center">
              <span className="font-material text-xl text-white/20 block mb-2">{s.icon}</span>
              <p className="font-headline font-black text-2xl text-white/20">{s.value}</p>
              <p className="font-label text-[10px] uppercase tracking-widest text-white/20 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
