import { useEffect, useRef, useCallback } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render(el: HTMLElement, opts: TurnstileOpts): string
      reset(id: string): void
      remove(id: string): void
    }
    onTurnstileLoad?: () => void
  }
}

interface TurnstileOpts {
  sitekey: string
  callback: (token: string) => void
  'expired-callback'?: () => void
  'error-callback'?: () => void
  theme?: 'dark' | 'light' | 'auto'
}

interface Props {
  onToken: (token: string) => void
  onExpire?: () => void
}

const SITEKEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined
const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad'

export default function Turnstile({ onToken, onExpire }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)

  const mount = useCallback(() => {
    if (!containerRef.current || !SITEKEY || !window.turnstile) return
    widgetId.current = window.turnstile.render(containerRef.current, {
      sitekey: SITEKEY,
      callback: onToken,
      'expired-callback': onExpire,
      'error-callback': onExpire,
      theme: 'dark',
    })
  }, [onToken, onExpire])

  useEffect(() => {
    if (!SITEKEY) return
    if (window.turnstile) {
      mount()
    } else {
      window.onTurnstileLoad = mount
      if (!document.querySelector(`script[src="${SCRIPT_URL}"]`)) {
        const s = document.createElement('script')
        s.src = SCRIPT_URL
        s.async = true
        s.defer = true
        document.head.appendChild(s)
      }
    }
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current)
    }
  }, [mount])

  if (!SITEKEY) return null
  return <div ref={containerRef} />
}
