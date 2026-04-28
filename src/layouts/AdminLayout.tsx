import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Menu, LogOut } from 'lucide-react'
import AdminSidebar from '../components/admin/AdminSidebar'
import HennyLogo from '../components/ui/HennyLogo'
import { useAuth } from '../contexts/AuthContext'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/admin/login', { replace: true })
  }

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
        <header className="md:hidden sticky top-0 z-20 bg-surface-container-low border-b border-white/5 px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-white transition-colors"
              aria-label="Open navigation"
            >
              <Menu size={24} />
            </button>
            <Link to="/admin">
              <HennyLogo width={90} />
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 text-on-surface-variant hover:text-white hover:bg-white/5 rounded transition-all duration-150"
            aria-label="Sign out"
          >
            <LogOut size={16} />
            <span className="font-label text-[10px] uppercase tracking-widest">Sign Out</span>
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
