import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar'
import HennyLogo from '../components/ui/HennyLogo'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="md:ml-[280px] min-h-screen flex flex-col">
        {/* Mobile topbar */}
        <header className="md:hidden sticky top-0 z-20 bg-surface-container-low border-b border-white/5 px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-white transition-colors"
            aria-label="Open navigation"
          >
            <span className="font-material text-2xl">menu</span>
          </button>
          <Link to="/admin">
            <HennyLogo width={100} />
          </Link>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
