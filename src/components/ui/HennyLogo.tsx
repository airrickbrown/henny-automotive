interface HennyLogoProps {
  width?: number
  className?: string
}

export default function HennyLogo({ width = 140, className = '' }: HennyLogoProps) {
  const height = Math.round(width * 351 / 442)

  return (
    <div
      className={`flex-shrink-0 inline-flex items-center justify-center bg-white/25 rounded-sm px-2 py-1.5 ${className}`}
    >
      <img
        src="/images/henny-logo.png"
        alt="Henny Automotive"
        width={width}
        height={height}
        draggable={false}
      />
    </div>
  )
}
