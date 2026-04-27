import { Link, useLocation } from 'react-router-dom'
import { buildWhatsAppUrl } from '../../lib/tokens'
import { cn } from '../../lib/utils'

function TabItem({
  icon,
  label,
  active = false,
  className,
}: {
  icon: string
  label: string
  active?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'flex flex-col items-center justify-center p-2 rounded transition-all duration-150 active:scale-90 min-w-0',
        active ? 'bg-primary-container text-white mx-1' : 'text-gray-500',
        className,
      )}
    >
      <span className="font-material text-2xl">{icon}</span>
      <span className="font-label text-[10px] uppercase font-bold tracking-tighter mt-1 leading-none">
        {label}
      </span>
    </span>
  )
}

export default function MobileBottomNav() {
  const { pathname } = useLocation()
  const inventoryActive = pathname.startsWith('/inventory')

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 glass-mobile-nav shadow-nav-top">
      <div className="flex justify-around items-center px-4 py-2">

        {/* Inventory — internal route */}
        <Link to="/inventory" aria-label="Inventory">
          <TabItem icon="directions_car" label="Inventory" active={inventoryActive} />
        </Link>

        {/* WhatsApp — external */}
        <a
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
        >
          <TabItem icon="chat" label="WhatsApp" className="active:bg-secondary/20" />
        </a>

        {/* USA Hub — homepage anchor */}
        <a href="/#usa-hub" aria-label="USA Hub">
          <TabItem icon="flag" label="USA Hub" />
        </a>

        {/* Ghana Hub — homepage anchor */}
        <a href="/#ghana-hub" aria-label="Ghana Hub">
          <TabItem icon="location_on" label="Ghana Hub" />
        </a>

      </div>
    </nav>
  )
}
