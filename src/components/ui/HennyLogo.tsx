import logo from '../../assets/henny-logo.png'

interface HennyLogoProps {
  width?: number
  maxHeight?: number
  className?: string
}

export default function HennyLogo({ width = 140, maxHeight, className = '' }: HennyLogoProps) {
  return (
    <img
      src={logo}
      alt="Henny Automotive"
      draggable={false}
      className={className}
      style={{
        width: `${width}px`,
        height: 'auto',
        maxHeight: maxHeight ? `${maxHeight}px` : undefined,
        mixBlendMode: 'multiply' as const,
      }}
    />
  )
}
