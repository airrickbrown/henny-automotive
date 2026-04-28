interface HennyLogoProps {
  width?: number
  className?: string
}

export default function HennyLogo({ width = 140, className = '' }: HennyLogoProps) {
  const height = Math.round(width * 351 / 442)

  return (
    <img
      src="/images/henny-logo.png"
      alt="Henny Automotive"
      width={width}
      height={height}
      className={`flex-shrink-0 ${className}`}
      draggable={false}
    />
  )
}
