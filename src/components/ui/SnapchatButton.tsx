import { cn } from '../../lib/utils'
import { SNAPCHAT_URL } from '../../lib/tokens'

interface SnapchatButtonProps {
  label?: string
  fullWidth?: boolean
  size?: 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-5 text-base',
}

export default function SnapchatButton({
  label = 'SNAPCHAT',
  fullWidth = false,
  size = 'md',
  className,
}: SnapchatButtonProps) {
  return (
    <a
      href={SNAPCHAT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'bg-[#FFFC00] text-black font-headline font-bold uppercase tracking-widest rounded inline-flex items-center justify-center gap-2 transition-all duration-150 hover:brightness-95 active:scale-95',
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {/* Snapchat ghost icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5 flex-shrink-0"
        aria-hidden="true"
      >
        <path d="M12.01 2C7.01 2 4 5.4 4 9.5c0 1.3.1 2.1.3 2.8-.3.2-.7.3-1.1.4-.5.1-.8.5-.8.9 0 .5.4.9.9 1 .3.1.6.1.9.2.1.1.2.3.2.5 0 .1 0 .2-.1.3-.4.7-1.3 1.8-1.3 2.8 0 1.1.9 2 2 2 .3 0 .5 0 .8-.1.5-.1 1-.2 1.6-.2.4 0 .8 0 1.1.1.6.3 1.2.9 2.5 1.4.4.1.8.2 1.2.2s.8-.1 1.2-.2c1.3-.5 1.9-1.1 2.5-1.4.3-.1.7-.1 1.1-.1.6 0 1.1.1 1.6.2.3.1.5.1.8.1 1.1 0 2-.9 2-2 0-1-.9-2.1-1.3-2.8-.1-.1-.1-.2-.1-.3 0-.2.1-.4.2-.5.3-.1.6-.1.9-.2.5-.1.9-.5.9-1 0-.4-.3-.8-.8-.9-.4-.1-.8-.2-1.1-.4.2-.7.3-1.5.3-2.8C20 5.4 17 2 12.01 2z" />
      </svg>
      {label}
    </a>
  )
}
