export type PartStatus = 'HOT PICK' | 'LIMITED' | null

export type PartCategory =
  | 'ENGINES'
  | 'BRAKES'
  | 'WHEELS'
  | 'EXHAUST'
  | 'INTERIOR'
  | 'SUSPENSION'

export interface Part {
  id: string
  slug: string
  name: string
  category: PartCategory
  description: string
  image: string
  status: PartStatus
  compatibleMakes?: string[]
  whatsappMessage: string
}
