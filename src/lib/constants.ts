export const NAV_LINKS = [
  { label: 'Home',      href: '/' },
  { label: 'Inventory', href: '/inventory' },
  { label: 'Parts',     href: '/parts' },
  { label: 'About',     href: '/about' },
  { label: 'Contact',   href: '/contact' },
] as const

export const MOBILE_NAV_TABS = [
  { label: 'Inventory', href: '/inventory', icon: 'directions_car' },
  { label: 'Contact',   href: '/contact',   icon: 'chat' },
  { label: 'USA Office', href: '/about',    icon: 'flag' },
  { label: 'Ghana Hub', href: '/about',     icon: 'location_on' },
] as const

export const VEHICLE_CATEGORIES = [
  'ALL CARS',
  'SUV',
  'COUPE',
  'SEDAN',
  'TRUCK',
  'SPORTS',
] as const

export const PART_CATEGORIES = [
  'ALL',
  'ENGINES',
  'BRAKES',
  'WHEELS',
  'EXHAUST',
  'INTERIOR',
] as const

export const MANUFACTURERS = [
  'Mercedes-Benz',
  'BMW',
  'Land Rover',
  'Porsche',
  'Cadillac',
  'Lexus',
  'Audi',
  'Ford',
] as const
