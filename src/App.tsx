import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import RequireAuth from './components/admin/RequireAuth'
import ErrorBoundary from './components/ErrorBoundary'

const HomePage               = lazy(() => import('./pages/HomePage'))
const InventoryPage          = lazy(() => import('./pages/InventoryPage'))
const VehicleDetailPage      = lazy(() => import('./pages/VehicleDetailPage'))
const PartsPage              = lazy(() => import('./pages/PartsPage'))
const AboutPage              = lazy(() => import('./pages/AboutPage'))
const ContactPage            = lazy(() => import('./pages/ContactPage'))
const PrivacyPolicyPage      = lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsOfServicePage     = lazy(() => import('./pages/TermsOfServicePage'))
const NotFoundPage           = lazy(() => import('./pages/NotFoundPage'))
const AdminLoginPage         = lazy(() => import('./pages/admin/AdminLoginPage'))
const AdminForgotPasswordPage= lazy(() => import('./pages/admin/AdminForgotPasswordPage'))
const AdminResetPasswordPage = lazy(() => import('./pages/admin/AdminResetPasswordPage'))
const AdminDashboardPage     = lazy(() => import('./pages/admin/AdminDashboardPage'))
const AdminInventoryPage     = lazy(() => import('./pages/admin/AdminInventoryPage'))
const AdminPartsPage         = lazy(() => import('./pages/admin/AdminPartsPage'))
const AdminLeadsPage         = lazy(() => import('./pages/admin/AdminLeadsPage'))
const AdminSettingsPage      = lazy(() => import('./pages/admin/AdminSettingsPage'))
const AdminNewsletterPage    = lazy(() => import('./pages/admin/AdminNewsletterPage'))

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        {/* Public site */}
        <Route element={<ErrorBoundary><PublicLayout /></ErrorBoundary>}>
          <Route path="/" element={<HomePage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/inventory/:slug" element={<VehicleDetailPage />} />
          <Route path="/parts" element={<PartsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        </Route>

        {/* Admin auth pages — no auth required */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPasswordPage />} />
        <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />

        {/* Admin portal — requires authentication */}
        <Route element={<RequireAuth />}>
          <Route element={<ErrorBoundary><AdminLayout /></ErrorBoundary>}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/inventory" element={<AdminInventoryPage />} />
            <Route path="/admin/parts" element={<AdminPartsPage />} />
            <Route path="/admin/leads" element={<AdminLeadsPage />} />
            <Route path="/admin/newsletter" element={<AdminNewsletterPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
