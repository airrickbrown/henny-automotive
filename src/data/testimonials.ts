export interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
  location: string
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    quote:
      'Henny Automotive changed how I buy cars. The C300 I ordered from the USA arrived in Accra exactly as described, with no hidden issues. They are the standard for reliability.',
    name: 'Kojo Mensah',
    role: 'Verified Buyer',
    location: 'Accra, Ghana',
  },
]
