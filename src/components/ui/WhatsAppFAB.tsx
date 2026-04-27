import { MessageCircle } from 'lucide-react'
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
      className={`hidden md:flex fixed z-50 bg-secondary items-center justify-center shadow-fab transition-all duration-200
        md:bottom-8 md:right-8 md:w-16 md:h-16 md:rounded-full
        ${hidden ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100 hover:scale-110 active:scale-90'}`}
    >
      <MessageCircle size={30} className="text-on-secondary" />
    </a>
  )
}
