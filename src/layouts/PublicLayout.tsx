import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import MobileBottomNav from '../components/layout/MobileBottomNav'
import WhatsAppFAB from '../components/ui/WhatsAppFAB'

export default function PublicLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <Navbar drawerOpen={drawerOpen} onDrawerChange={setDrawerOpen} />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFAB hidden={drawerOpen} />
      <MobileBottomNav />
    </>
  )
}
