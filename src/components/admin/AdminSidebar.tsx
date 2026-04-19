import { Link, useNavigate } from 'react-router-dom'
import { useActiveRoute } from '../../hooks/useActiveRoute'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../lib/utils'
import HennyLogo from '../ui/HennyLogo'

const NAV_ITEMS = [
  { label: 'Dashboard',            href: '/admin',               icon: 'dashboard' },
  { label: 'Inventory Management', href: '/admin/inventory',     icon: 'directions_car' },
  { label: 'Car Parts',            href: '/admin/parts',         icon: 'settings' },
  { label: 'Leads',                href: '/admin/leads',         icon: 'person' },
  { label: 'Newsletter',           href: '/admin/newsletter',    icon: 'mail' },
  { label: 'Settings',             href: '/admin/settings',      icon: 'tune' },
] as const

export default function AdminSidebar() {
  const isActive = useActiveRoute()
  const { logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <aside className="w-[280px] fixed top-0 left-0 h-screen bg-surface-container-low flex flex-col z-40">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/5">
        <Link to="/admin" aria-label="Henny Automotive — Admin">
          <HennyLogo width={120} />
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {NAV_ITEMS.map(item => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded font-label text-sm font-bold uppercase tracking-wider transition-all duration-150',
                active
                  ? 'bg-primary-container/10 text-primary-container border-l-4 border-primary-container pl-3'
                  : 'text-on-surface-variant hover:text-white hover:bg-white/5'
              )}
            >
              <span className="font-material text-xl">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom — admin user + logout */}
      <div className="px-6 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
            <span className="font-headline text-xs font-black text-white">HA</span>
          </div>
          <div>
            <p className="font-label text-xs font-bold text-white uppercase tracking-wider">Admin</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">Henny Automotive</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded text-on-surface-variant hover:text-white hover:bg-white/5 transition-all duration-150 font-label text-xs uppercase tracking-wider"
        >
          <span className="font-material text-base">logout</span>
          Sign Out
        </button>
      </div>

    </aside>
  )
}
