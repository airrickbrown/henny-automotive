import { Link, useNavigate } from 'react-router-dom'
import { Car, Settings, X, LogOut, LayoutDashboard, User, Mail, SlidersHorizontal, ImageIcon } from 'lucide-react'
import { useActiveRoute } from '../../hooks/useActiveRoute'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../lib/utils'
import HennyLogo from '../ui/HennyLogo'

const NAV_ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  dashboard:      LayoutDashboard,
  directions_car: Car,
  settings:       Settings,
  person:         User,
  mail:           Mail,
  tune:           SlidersHorizontal,
  image:          ImageIcon,
}

const NAV_ITEMS = [
  { label: 'Dashboard',            href: '/admin',               icon: 'dashboard' },
  { label: 'Inventory Management', href: '/admin/inventory',     icon: 'directions_car' },
  { label: 'Car Parts',            href: '/admin/parts',         icon: 'settings' },
  { label: 'Leads',                href: '/admin/leads',         icon: 'person' },
  { label: 'Site Images',           href: '/admin/images',        icon: 'image' },
  { label: 'Newsletter',           href: '/admin/newsletter',    icon: 'mail' },
  { label: 'Settings',             href: '/admin/settings',      icon: 'tune' },
] as const

interface Props {
  open: boolean
  onClose: () => void
}

export default function AdminSidebar({ open, onClose }: Props) {
  const isActive = useActiveRoute()
  const { logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <aside
      className={cn(
        'w-[280px] fixed top-0 left-0 h-screen bg-surface-container-low flex flex-col z-40',
        'transition-transform duration-300 ease-in-out',
        open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      )}
    >
      {/* Logo + mobile close */}
      <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
        <Link to="/admin" onClick={onClose} aria-label="Henny Automotive — Admin">
          <HennyLogo width={120} />
        </Link>
        <button
          onClick={onClose}
          className="md:hidden w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-white transition-colors"
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {NAV_ITEMS.map(item => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded font-label text-sm font-bold uppercase tracking-wider transition-all duration-150',
                active
                  ? 'bg-primary-container/10 text-primary-container border-l-4 border-primary-container pl-3'
                  : 'text-on-surface-variant hover:text-white hover:bg-white/5'
              )}
            >
              {(() => { const Icon = NAV_ICON_MAP[item.icon]; return Icon ? <Icon size={20} /> : null })()}
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
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
