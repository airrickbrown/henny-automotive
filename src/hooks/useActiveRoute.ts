import { useLocation } from 'react-router-dom'

export function useActiveRoute(): (href: string) => boolean {
  const { pathname } = useLocation()

  return (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }
}
