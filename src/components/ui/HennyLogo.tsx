import logo from '../../assets/henny-logo.png'

interface HennyLogoProps {
  width?: number
  className?: string
}

export default function HennyLogo({ width = 140, className = '' }: HennyLogoProps) {
  return (
    <img
      src={logo}
      alt="Henny Automotive"
      width={width}
      height="auto"
      className={className}
      style={{ width: `${width}px`, height: 'auto' }}
      draggable={false}
    />
  )
}
