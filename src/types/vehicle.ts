export type VehicleStatus =
  | 'JUST ARRIVED'
  | 'HOT DEAL'
  | 'FEATURED'
  | 'NEW ARRIVAL'
  | 'USA SOURCED'
  | 'IN TRANSIT'
  | 'SHIPPING FROM USA'
  | 'LIMITED'

export type VehicleCondition = 'NEW (LOW KM)' | 'PRE-OWNED USA' | 'LOCAL STOCK'

export type VehicleLocation = 'USA' | 'GHANA' | 'IN TRANSIT'

export type VehicleCategory = 'SUV' | 'COUPE' | 'SEDAN' | 'TRUCK' | 'SPORTS'

export interface VehicleSpec {
  engine: string
  power?: string
  zeroToSixty?: string
  transmission: string
  mileage: string
  drivetrain?: string
}

export interface Vehicle {
  id: string
  slug: string
  make: string
  model: string
  year: number
  trim?: string
  price: number | null
  spec: VehicleSpec
  images: string[]
  status?: VehicleStatus
  condition: VehicleCondition
  location: VehicleLocation
  keyFeatures: string[]
  overview: string
  isFeatured: boolean
  isHotDeal: boolean
  showPublicPrice: boolean
  category: VehicleCategory
  sku: string
  createdAt: string
}
