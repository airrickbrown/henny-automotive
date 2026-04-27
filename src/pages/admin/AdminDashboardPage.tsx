import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Car, Flag, Store, Truck, Settings, Flame, EyeOff, Users, ArrowRight, type LucideIcon } from 'lucide-react'
import { getAllVehicles } from '../../lib/vehicles'
import { getLeads, type Lead } from '../../lib/leads'
import { getAllParts } from '../../lib/parts'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../lib/utils'
import type { Vehicle } from '../../types/vehicle'
import type { Part } from '../../types/part'

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  to,
  loading,
}: {
  label: string
  value: string | number
  icon: LucideIcon
  sub?: string
  to?: string
  loading?: boolean
}) {
  const inner = (
    <div className="bg-surface-container-low p-6 flex flex-col gap-4 hover:bg-surface-container-high transition-colors duration-150 h-full">
      <div className="flex items-start justify-between">
        <Icon size={24} className="text-primary-container" />
        {to && <ArrowRight size={16} className="text-white/20" />}
      </div>
      <div>
        {loading ? (
          <div className="h-9 w-12 bg-white/5 rounded animate-pulse mb-1" />
        ) : (
          <p className="font-headline font-black text-3xl text-white">{value}</p>
        )}
        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">{label}</p>
        {sub && <p className="font-label text-[10px] text-white/20 tracking-widest mt-0.5">{sub}</p>}
      </div>
    </div>
  )

  if (to) return <Link to={to} className="block">{inner}</Link>
  return inner
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [leads, setLeads]       = useState<Lead[]>([])
  const [parts, setParts]       = useState<Part[]>([])
  const [vLoading, setVLoading] = useState(true)
  const [lLoading, setLLoading] = useState(true)
  const [pLoading, setPLoading] = useState(true)

  function loadVehicles() {
    getAllVehicles()
      .then(data => { setVehicles(data); setVLoading(false) })
      .catch(() => setVLoading(false))
  }

  function loadLeads() {
    getLeads()
      .then(data => { setLeads(data); setLLoading(false) })
      .catch(() => setLLoading(false))
  }

  function loadParts() {
    getAllParts()
      .then(data => { setParts(data); setPLoading(false) })
      .catch(() => setPLoading(false))
  }

  useEffect(() => {
    loadVehicles()
    loadLeads()
    loadParts()

    const vChannel = supabase
      .channel('dashboard-vehicles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, loadVehicles)
      .subscribe()

    const lChannel = supabase
      .channel('dashboard-leads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, loadLeads)
      .subscribe()

    const pChannel = supabase
      .channel('dashboard-parts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'parts' }, loadParts)
      .subscribe()

    return () => {
      supabase.removeChannel(vChannel)
      supabase.removeChannel(lChannel)
      supabase.removeChannel(pChannel)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const featured       = vehicles.filter(v => v.isFeatured).length
  const inTransit      = vehicles.filter(v => v.location === 'IN TRANSIT').length
  const usa            = vehicles.filter(v => v.location === 'USA').length
  const ghana          = vehicles.filter(v => v.location === 'GHANA').length
  const hotParts       = parts.filter(p => p.status !== null).length
  const newLeads       = leads.filter(l => l.status === 'new').length
  const recentVehicles = [...vehicles].slice(0, 5)

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
        <StatCard label="Total Vehicles"    value={vehicles.length}                                   icon={Car}      to="/admin/inventory" sub={`${featured} featured`}               loading={vLoading} />
        <StatCard label="USA Stock"         value={usa}                                               icon={Flag}     to="/admin/inventory"                                            loading={vLoading} />
        <StatCard label="Ghana Showroom"    value={ghana}                                             icon={Store}    to="/admin/inventory"                                            loading={vLoading} />
        <StatCard label="In Transit"        value={inTransit}                                         icon={Truck}    to="/admin/inventory"                                            loading={vLoading} />
        <StatCard label="Parts Listed"      value={parts.length}                                      icon={Settings} to="/admin/parts"     sub={`${hotParts} active`}                loading={pLoading} />
        <StatCard label="Hot Deals"         value={vehicles.filter(v => v.isHotDeal).length}          icon={Flame}                                                                     loading={vLoading} />
        <StatCard label="Price on Request"  value={vehicles.filter(v => !v.showPublicPrice).length}   icon={EyeOff}                                                                    loading={vLoading} />
        <StatCard label="Leads"             value={leads.length}                                      icon={Users}    to="/admin/leads"     sub={newLeads > 0 ? `${newLeads} new` : 'all reviewed'} loading={lLoading} />
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

        {vLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-white/5 rounded animate-pulse" />
            ))}
          </div>
        ) : recentVehicles.length === 0 ? (
          <p className="font-body text-sm text-on-surface-variant text-center py-8">No vehicles yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[560px]">
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
        )}
      </div>

    </div>
  )
}
