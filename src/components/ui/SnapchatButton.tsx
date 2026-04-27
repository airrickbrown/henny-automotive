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
  label = 'Add on Snapchat',
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
        'bg-[#FFFC00] text-black font-headline font-bold uppercase tracking-widest inline-flex items-center justify-center gap-2.5 transition-all duration-150 hover:brightness-95 active:scale-95',
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {/* Official Snapchat ghost icon */}
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0" aria-hidden="true">
        <path d="M12.166.006c.82-.014 3.543.225 4.851 3.111.398.878.303 2.351.243 3.368l-.009.147c-.008.146-.015.285-.02.42.01.007.03.018.063.03a2.8 2.8 0 00.924.148c.375 0 .702-.1.888-.169l.048-.018a1.27 1.27 0 01.42-.073c.23 0 .51.06.72.199.33.215.504.544.489.895-.016.4-.314.74-.897 1.02-.1.048-.228.098-.366.151-.455.173-1.077.41-1.246.9a1.45 1.45 0 00-.024.82c.026.097.636 2.372-.777 3.969-.714.808-1.72 1.314-2.99 1.508.08.073.18.162.295.257.39.32.979.8 1.52 1.524.457.612.99 1.612.677 2.728-.318 1.129-1.412 1.804-2.555 1.573l-.102-.024c-.374-.097-.88-.229-1.607-.31a10.84 10.84 0 00-1.198-.072c-.43 0-.843.027-1.224.073-.74.08-1.257.211-1.633.308l-.1.025c-.224.051-.451.077-.672.077-1.126 0-2.167-.7-2.483-1.776-.336-1.13.176-2.147.638-2.765.539-.727 1.136-1.205 1.527-1.524.119-.097.222-.188.303-.263-1.27-.194-2.275-.7-2.99-1.508-1.413-1.597-.803-3.872-.777-3.969a1.45 1.45 0 00-.024-.82c-.17-.49-.791-.727-1.246-.9-.138-.053-.266-.103-.366-.151-.583-.28-.881-.62-.897-1.02-.015-.35.158-.68.49-.895.21-.138.49-.199.72-.199.141 0 .278.024.418.073l.048.018c.187.068.514.169.89.169.346 0 .657-.071.9-.143.034-.01.057-.022.067-.03l-.023-.42-.008-.147C3.086 3.58 2.99 2.107 3.39 1.23 4.698.225 7.42-.013 8.24.005c.073 0 .145.003.214.007 1.02.059 2.845.394 3.712 2.23z"/>
      </svg>
      {label}
    </a>
  )
}
