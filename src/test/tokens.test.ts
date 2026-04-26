import { describe, it, expect } from 'vitest'
import { buildWhatsAppUrl, WHATSAPP_BASE_URL, SNAPCHAT_URL, SNAPCHAT_HANDLE } from '../lib/tokens'

describe('buildWhatsAppUrl', () => {
  it('returns the base URL when no message is provided', () => {
    expect(buildWhatsAppUrl()).toBe(WHATSAPP_BASE_URL)
  })

  it('appends URL-encoded message as a query param', () => {
    const url = buildWhatsAppUrl('Hello World')
    expect(url).toBe(`${WHATSAPP_BASE_URL}?text=Hello%20World`)
  })

  it('encodes special characters in the message', () => {
    const url = buildWhatsAppUrl('Hi & Bye')
    expect(url).toContain(encodeURIComponent('Hi & Bye'))
  })
})

describe('SNAPCHAT_URL', () => {
  it('points to the correct Snapchat handle', () => {
    expect(SNAPCHAT_URL).toContain(SNAPCHAT_HANDLE)
    expect(SNAPCHAT_URL).toContain('snapchat.com')
  })
})
