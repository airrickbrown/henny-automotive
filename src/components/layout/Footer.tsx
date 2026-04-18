import { Link } from 'react-router-dom'
import { NAV_LINKS } from '../../lib/constants'
import { WHATSAPP_BASE_URL, SNAPCHAT_URL } from '../../lib/tokens'

export default function Footer() {
  return (
    <footer className="bg-footer-bg w-full py-16 px-8 pb-32 md:pb-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Column 1 — Brand */}
        <div className="md:col-span-1">
          <div className="font-headline text-3xl font-black text-white mb-6 uppercase">
            HENNY
          </div>
          <p className="font-body text-sm leading-relaxed text-gray-400 max-w-xs">
            The Kinetic Monolith. Elite automotive sourcing from the USA to Ghana.
            Built on precision, driven by trust.
          </p>
        </div>

        {/* Column 2 — Navigation */}
        <div>
          <h4 className="font-headline text-white font-bold uppercase tracking-widest text-sm mb-6">
            Navigation
          </h4>
          <ul className="space-y-4">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="font-body text-sm text-gray-400 hover:text-white transition-all duration-150 hover:translate-x-2 inline-block"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 — Operations */}
        <div>
          <h4 className="font-headline text-white font-bold uppercase tracking-widest text-sm mb-6">
            Operations
          </h4>
          <ul className="space-y-4">
            <li className="font-body text-gray-400 text-sm">
              USA Logistics Hub: Houston, TX
            </li>
            <li className="font-body text-gray-400 text-sm">
              Ghana Showroom: Tema Comm 25
            </li>
            <li>
              <a
                href={SNAPCHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-gray-400 hover:text-[#FFFC00] transition-all duration-150 hover:translate-x-2 inline-block"
              >
                Snapchat
              </a>
            </li>
            <li>
              <a
                href={WHATSAPP_BASE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-gray-400 hover:text-[#25D366] transition-all duration-150 hover:translate-x-2 inline-block"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4 — Newsletter */}
        <div>
          <h4 className="font-headline text-white font-bold uppercase tracking-widest text-sm mb-6">
            Newsletter
          </h4>
          <p className="font-body text-xs text-gray-400 mb-4">
            Get first access to new container arrivals.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="EMAIL"
              className="bg-surface-container-high border-none text-white text-xs p-3 w-full focus:ring-1 focus:ring-primary-container outline-none font-label uppercase tracking-widest placeholder:text-gray-600"
            />
            <button
              aria-label="Subscribe"
              className="bg-primary-container text-white px-4 flex items-center justify-center hover:brightness-110 transition-all duration-150 flex-shrink-0"
            >
              <span className="font-material text-xl">chevron_right</span>
            </button>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-body text-xs text-gray-500">
          © 2024 Henny Automotive. The Kinetic Monolith.
        </p>
        <div className="flex gap-6">
          <a
            href="#"
            className="font-label text-[10px] uppercase font-bold text-gray-600 hover:text-white tracking-widest transition-colors duration-150"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="font-label text-[10px] uppercase font-bold text-gray-600 hover:text-white tracking-widest transition-colors duration-150"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  )
}
