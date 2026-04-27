import { Link, useLocation } from 'react-router-dom'
import { Car, Search, MapPin, type LucideIcon } from 'lucide-react'
import { buildWhatsAppUrl } from '../../lib/tokens'
import { cn } from '../../lib/utils'

function TabItem({
  icon: Icon,
  label,
  active = false,
  className,
}: {
  icon: LucideIcon
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
      <Icon size={24} />
      <span className="font-label text-[10px] uppercase font-bold tracking-tighter mt-1 leading-none">
        {label}
      </span>
    </span>
  )
}

function WhatsAppTab() {
  return (
    <span className="flex flex-col items-center justify-center p-2 rounded transition-all duration-150 active:scale-90 min-w-0 text-[#25D366]">
      {/* Real WhatsApp icon */}
      <svg viewBox="0 0 24 24" width={24} height={24} fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      <span className="font-label text-[10px] uppercase font-bold tracking-tighter mt-1 leading-none">
        WhatsApp
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
          <TabItem icon={Car} label="Inventory" active={inventoryActive} />
        </Link>

        {/* WhatsApp — real icon, always WhatsApp green */}
        <a
          href={buildWhatsAppUrl('Hi, I\'d like to source a car from the USA. Can you help me find the right one?')}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
        >
          <WhatsAppTab />
        </a>

        {/* Source a Car — links to USA Vehicle Sourcing section */}
        <Link to={{ pathname: '/', hash: '#usa-sourcing' }} aria-label="Source a Car">
          <TabItem icon={Search} label="Source" />
        </Link>

        {/* Ghana Hub — homepage anchor */}
        <Link to={{ pathname: '/', hash: '#ghana-hub' }} aria-label="Ghana Hub">
          <TabItem icon={MapPin} label="Ghana Hub" />
        </Link>

      </div>
    </nav>
  )
}
