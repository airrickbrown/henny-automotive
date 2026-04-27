import { buildWhatsAppUrl } from '../../lib/tokens'

interface WhatsAppFABProps {
  message?: string
  hidden?: boolean
}

export default function WhatsAppFAB({ message, hidden }: WhatsAppFABProps) {
  return (
    <a
      href={buildWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={`fixed z-50 bg-secondary flex items-center justify-center shadow-fab transition-all duration-200
        bottom-24 right-6 w-16 h-16 rounded
        md:bottom-8 md:right-8 md:rounded-full
        ${hidden ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100 hover:scale-110 active:scale-90'}`}
    >
      <span className="font-material-filled text-3xl text-on-secondary">chat</span>
    </a>
  )
}
