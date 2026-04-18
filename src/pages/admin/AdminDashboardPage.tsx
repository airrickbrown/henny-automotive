import { Link } from 'react-router-dom'
import { vehicles } from '../../data/vehicles'
import { parts } from '../../data/parts'
import { formatPrice } from '../../lib/utils'

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon,
  sub,
  to,
}: {
  label: string
  value: string | number
  icon: string
  sub?: string
  to?: string
}) {
  const inner = (
    <div className="bg-surface-container-low p-6 flex flex-col gap-4 hover:bg-surface-container-high transition-colors duration-150 h-full">
      <div className="flex items-start justify-between">
        <span className="font-material text-2xl text-primary-container">{icon}</span>
        {to && <span className="font-material text-base text-white/20">arrow_forward</span>}
      </div>
      <div>
        <p className="font-headline font-black text-3xl text-white">{value}</p>
        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">{label}</p>
        {sub && <p className="font-label text-[10px] text-white/20 tracking-widest mt-0.5">{sub}</p>}
      </div>
    </div>
  )

  if (to) {
    return <Link to={to} className="block">{inner}</Link>
  }
  return inner
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const featured   = vehicles.filter((v) => v.isFeatured).length
  const inTransit  = vehicles.filter((v) => v.location === 'IN TRANSIT').length
  const usa        = vehicles.filter((v) => v.location === 'USA').length
  const ghana      = vehicles.filter((v) => v.location === 'GHANA').length
  const hotParts   = parts.filter((p) => p.status !== null).length
  const recentVehicles = [...vehicles].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)

  return (
    <div className="max-w-[1400px]">

      {/* Title */}
      <div className="mb-8">
        <h1 className="font-headline font-black italic uppercase tracking-tighter text-4xl text-white leading-none">
          Dashboard
        </h1>
        <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mt-2">
          Henny Automotive — Admin Overview
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        <StatCard label="Total Vehicles"   value={vehicles.length}  icon="inventory_2"      to="/admin/inventory" sub={`${featured} featured`} />
        <StatCard label="USA Stock"        value={usa}              icon="flag"             to="/admin/inventory" />
        <StatCard label="Ghana Showroom"   value={ghana}            icon="storefront"       to="/admin/inventory" />
        <StatCard label="In Transit"       value={inTransit}        icon="local_shipping"   to="/admin/inventory" />
        <StatCard label="Parts Listed"     value={parts.length}     icon="settings"         to="/admin/parts"     sub={`${hotParts} active`} />
        <StatCard label="Hot Deals"        value={vehicles.filter((v) => v.isHotDeal).length} icon="local_fire_department" />
        <StatCard label="Price on Request" value={vehicles.filter((v) => !v.showPublicPrice).length} icon="visibility_off" />
        <StatCard label="Leads"            value="—"                icon="person"           to="/admin/leads"     sub="coming soon" />
      </div>

      {/* Recent vehicles */}
      <div className="bg-surface-container-low p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline font-bold uppercase tracking-tight text-white">Recent Additions</h2>
          <Link
            to="/admin/inventory"
            className="font-label text-[10px] uppercase tracking-widest text-primary-container border-b border-primary-container pb-0.5"
          >
            View All
          </Link>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/10">
              {['Vehicle', 'SKU', 'Status', 'Price', 'Location'].map((h) => (
                <th key={h} className="text-left font-label text-[10px] uppercase tracking-widest text-white/30 pb-3 pr-6">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentVehicles.map((v) => (
              <tr key={v.id} className="border-b border-outline-variant/5 hover:bg-surface-container-high/40 transition-colors duration-150">
                <td className="py-3 pr-6">
                  <p className="font-headline font-bold uppercase text-sm text-white leading-none">
                    {v.make} {v.model}
                  </p>
                  <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-0.5">
                    {v.year}
                  </p>
                </td>
                <td className="py-3 pr-6">
                  <span className="font-label text-[10px] uppercase tracking-widest text-white/40">{v.sku}</span>
                </td>
                <td className="py-3 pr-6">
                  {v.status
                    ? <span className="font-label text-[10px] uppercase tracking-widest text-primary-container">{v.status}</span>
                    : <span className="font-label text-[10px] text-white/20">—</span>
                  }
                </td>
                <td className="py-3 pr-6">
                  <span className="font-headline font-bold text-sm text-white">
                    {formatPrice(v.showPublicPrice ? v.price : null)}
                  </span>
                </td>
                <td className="py-3">
                  <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">{v.location}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
