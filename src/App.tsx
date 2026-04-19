import { Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import RequireAuth from './components/admin/RequireAuth'
import HomePage from './pages/HomePage'
import InventoryPage from './pages/InventoryPage'
import VehicleDetailPage from './pages/VehicleDetailPage'
import PartsPage from './pages/PartsPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminForgotPasswordPage from './pages/admin/AdminForgotPasswordPage'
import AdminResetPasswordPage from './pages/admin/AdminResetPasswordPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminInventoryPage from './pages/admin/AdminInventoryPage'
import AdminPartsPage from './pages/admin/AdminPartsPage'
import AdminLeadsPage from './pages/admin/AdminLeadsPage'
import AdminSettingsPage from './pages/admin/AdminSettingsPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/inventory/:slug" element={<VehicleDetailPage />} />
        <Route path="/parts" element={<PartsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Admin auth pages — no auth required */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/forgot-password" element={<AdminForgotPasswordPage />} />
      <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />

      {/* Admin portal — requires authentication */}
      <Route element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/inventory" element={<AdminInventoryPage />} />
          <Route path="/admin/parts" element={<AdminPartsPage />} />
          <Route path="/admin/leads" element={<AdminLeadsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
