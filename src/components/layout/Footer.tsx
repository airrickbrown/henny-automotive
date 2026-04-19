import { Link } from 'react-router-dom'
import { WHATSAPP_BASE_URL, SNAPCHAT_URL, WHATSAPP_NUMBER } from '../../lib/tokens'

const NAV_LINKS = [
  { label: 'Home',      href: '/' },
  { label: 'Inventory', href: '/inventory' },
  { label: 'Car Parts', href: '/parts' },
  { label: 'About Us',  href: '/about' },
  { label: 'Contact',   href: '/contact' },
]

const SERVICE_LINKS = [
  { label: 'Browse Inventory',   href: '/inventory' },
  { label: 'Car Parts & Spares', href: '/parts' },
  { label: 'Import Process',     href: '/about' },
  { label: 'Get a Quote',        href: '/contact' },
  { label: 'US Sourcing',        href: '/about' },
]

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-headline text-white font-bold uppercase tracking-widest text-sm mb-6">
      {children}
    </h4>
  )
}

function FooterLink({ href, children, external = false, color }: {
  href: string
  children: React.ReactNode
  external?: boolean
  color?: string
}) {
  const cls = `font-body text-sm text-gray-400 hover:${color ?? 'text-white'} transition-all duration-150 hover:translate-x-1.5 inline-block`
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    )
  }
  return (
    <Link to={href} className={cls}>
      {children}
    </Link>
  )
}

export default function Footer() {
  return (
    <footer className="bg-footer-bg w-full pt-16 pb-32 md:pb-16 px-8">
      <div className="max-w-7xl mx-auto">

        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Column 1 — Brand (spans 2 on mobile, 1 on lg) */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="font-headline text-3xl font-black text-white mb-1 uppercase tracking-tighter">
              HENNY
            </div>
            <div className="font-headline text-xs font-bold text-primary-container uppercase tracking-[0.3em] mb-5">
              AUTOMOTIVE
            </div>
            <p className="font-body text-sm leading-relaxed text-gray-400 max-w-xs">
              The Kinetic Monolith. Elite automotive sourcing from the USA to Ghana —
              built on precision, driven by trust since 2014.
            </p>
            {/* Social */}
            <div className="flex gap-4 mt-6">
              <a
                href={WHATSAPP_BASE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-surface-container-low hover:bg-[#25D366] text-gray-400 hover:text-white transition-all duration-200"
                aria-label="WhatsApp"
              >
                <span className="font-material text-lg">chat</span>
              </a>
              <a
                href={SNAPCHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-surface-container-low hover:bg-[#FFFC00] text-gray-400 hover:text-black transition-all duration-200"
                aria-label="Snapchat"
              >
                <span className="font-material text-lg">swipe</span>
              </a>
            </div>
          </div>

          {/* Column 2 — Navigate */}
          <div>
            <FooterHeading>Navigate</FooterHeading>
            <ul className="space-y-3.5">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Services */}
          <div>
            <FooterHeading>Services</FooterHeading>
            <ul className="space-y-3.5">
              {SERVICE_LINKS.map(link => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Ghana Hub */}
          <div>
            <FooterHeading>Ghana Hub</FooterHeading>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-2">
                <span className="font-material text-sm text-primary-container flex-shrink-0 mt-0.5">location_on</span>
                <span className="font-body text-sm text-gray-400">
                  Tema Comm 25<br />Greater Accra, Ghana
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-material text-sm text-gray-500 flex-shrink-0 mt-0.5">local_shipping</span>
                <span className="font-body text-sm text-gray-400">
                  Delivery to Accra, Tema &amp; Kumasi
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-material text-sm text-gray-500 flex-shrink-0 mt-0.5">schedule</span>
                <span className="font-body text-sm text-gray-400">
                  Mon – Sat · 9am – 6pm GMT
                </span>
              </li>
              <li className="mt-1">
                <a
                  href={`tel:${WHATSAPP_NUMBER}`}
                  className="font-body text-sm text-gray-400 hover:text-white transition-all duration-150 hover:translate-x-1.5 inline-flex items-center gap-2"
                >
                  <span className="font-material text-sm">call</span>
                  {WHATSAPP_NUMBER}
                </a>
              </li>
              <li>
                <FooterLink href={WHATSAPP_BASE_URL} external color="text-[#25D366]">
                  WhatsApp Us
                </FooterLink>
              </li>
            </ul>
          </div>

          {/* Column 5 — Newsletter */}
          <div>
            <FooterHeading>Stay Updated</FooterHeading>
            <p className="font-body text-xs text-gray-400 mb-4 leading-relaxed">
              Be first to know when new containers arrive and exclusive deals drop.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="EMAIL"
                className="bg-surface-container-high text-white text-xs p-3 w-full focus:ring-1 focus:ring-primary-container outline-none font-label uppercase tracking-widest placeholder:text-gray-600 min-w-0"
              />
              <button
                aria-label="Subscribe"
                className="bg-primary-container text-white px-4 flex items-center justify-center hover:brightness-110 transition-all duration-150 flex-shrink-0"
              >
                <span className="font-material text-xl">chevron_right</span>
              </button>
            </div>
            <p className="font-label text-[10px] uppercase tracking-widest text-gray-600 mt-3">
              No spam. Unsubscribe any time.
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} Henny Automotive. The Kinetic Monolith. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/about"
              className="font-label text-[10px] uppercase font-bold text-gray-600 hover:text-white tracking-widest transition-colors duration-150"
            >
              Privacy Policy
            </Link>
            <Link
              to="/about"
              className="font-label text-[10px] uppercase font-bold text-gray-600 hover:text-white tracking-widest transition-colors duration-150"
            >
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
