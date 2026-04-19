export const colors = {
  surface:                   '#131313',
  surfaceDim:                '#131313',
  surfaceContainerLowest:    '#0E0E0E',
  surfaceContainerLow:       '#1C1B1B',
  surfaceContainer:          '#201F1F',
  surfaceContainerHigh:      '#2A2A2A',
  surfaceContainerHighest:   '#353534',
  surfaceBright:             '#3A3939',
  background:                '#131313',
  primaryContainer:          '#E11D2E',
  onPrimaryFixedVariant:     '#930015',
  onPrimaryContainer:        '#FFF8F7',
  secondary:                 '#41E575',
  onSecondary:               '#003915',
  onSurface:                 '#E5E2E1',
  onSurfaceVariant:          '#E6BDB9',
  onBackground:              '#E5E2E1',
  outlineVariant:            '#5D3F3D',
  snapchatYellow:            '#FFFC00',
  footerBg:                  '#0A0A0A',
} as const

export const gradients = {
  ignition:         'linear-gradient(135deg, #E11D2E 0%, #930015 100%)',
  heroOverlayLeft:  'linear-gradient(to right, #131313 0%, rgba(19,19,19,0.4) 50%, transparent 100%)',
  heroOverlayBottom:'linear-gradient(to top, #131313 0%, rgba(19,19,19,0.4) 60%, transparent 100%)',
} as const

export const shadows = {
  fab:          '0 8px 32px rgba(0, 0, 0, 0.5)',
  ignitionGlow: '0 0 20px rgba(225, 29, 46, 0.4)',
  mobileNavTop: '0 -8px 32px rgba(0, 0, 0, 0.5)',
} as const

export const WHATSAPP_NUMBER = '+233000000000'
export const GHANA_PHONE = '+233593204050'
export const GHANA_PHONE_DISPLAY = '059 320 4050'
export const SNAPCHAT_HANDLE = 'hennyauto'

export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`
export const SNAPCHAT_URL = `https://www.snapchat.com/add/${SNAPCHAT_HANDLE}`

export function buildWhatsAppUrl(message?: string): string {
  if (!message) return WHATSAPP_BASE_URL
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`
}
