import { vehicles } from './data/vehicles'

export const prerenderRoutes: string[] = [
  '/',
  '/inventory',
  '/parts',
  '/about',
  '/contact',
  ...vehicles.map((v) => `/inventory/${v.slug}`),
]
