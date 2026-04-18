import { Link } from 'react-router-dom'
import { useActiveRoute } from '../../hooks/useActiveRoute'
import { MOBILE_NAV_TABS } from '../../lib/constants'
import { cn } from '../../lib/utils'

export default function MobileBottomNav() {
  const isActive = useActiveRoute()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 glass-mobile-nav shadow-nav-top">
      <div className="flex justify-around items-center px-4 py-2">
        {MOBILE_NAV_TABS.map(tab => {
          const active = isActive(tab.href)
          return (
            <Link
              key={tab.label}
              to={tab.href}
              className={cn(
                'flex flex-col items-center justify-center p-2 rounded transition-all duration-150 active:scale-90',
                active
                  ? 'bg-primary-container text-white mx-1'
                  : 'text-gray-500 active:bg-primary-container/20'
              )}
            >
              <span className="font-material text-2xl">{tab.icon}</span>
              <span className="font-label text-[10px] uppercase font-bold tracking-tighter mt-1">
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
