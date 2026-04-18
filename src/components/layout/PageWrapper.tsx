import { cn } from '../../lib/utils'

interface PageWrapperProps {
  children: React.ReactNode
  className?: string
}

export default function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div className={cn('pt-20 pb-20 md:pb-0', className)}>
      {children}
    </div>
  )
}
