import { buildWhatsAppUrl } from '../../lib/tokens'

interface WhatsAppFABProps {
  message?: string
}

export default function WhatsAppFAB({ message }: WhatsAppFABProps) {
  return (
    <a
      href={buildWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed z-50 bg-secondary flex items-center justify-center shadow-fab hover:scale-110 active:scale-90 transition-transform duration-150
        bottom-24 right-6 w-16 h-16 rounded
        md:bottom-8 md:right-8 md:rounded-full"
    >
      <span className="font-material-filled text-3xl text-on-secondary">chat</span>
    </a>
  )
}
