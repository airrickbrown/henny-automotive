import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function RequireAuth() {
  const { session, loading } = useAuth()

  if (loading) return null

  return session ? <Outlet /> : <Navigate to="/admin/login" replace />
}
