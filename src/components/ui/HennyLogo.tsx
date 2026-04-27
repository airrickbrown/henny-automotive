interface HennyLogoProps {
  width?: number
  maxHeight?: number
  className?: string
}

export default function HennyLogo({ width = 140, maxHeight, className = '' }: HennyLogoProps) {
  const naturalHeight = Math.round(width * 72 / 200)
  const height = maxHeight ? Math.min(naturalHeight, maxHeight) : naturalHeight

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 72"
      width={width}
      height={height}
      aria-label="Henny Automotive"
      className={`flex-shrink-0 ${className}`}
      fill="none"
    >
      {/* ── MARK ─────────────────────────────── */}

      {/* Red top arch */}
      <path d="M3 32 Q29 7 55 32" stroke="#e11d2e" strokeWidth="4.5" strokeLinecap="round" />

      {/* Ghost shield outline */}
      <path
        d="M3 32 L3 50 L29 65 L55 50 L55 32"
        stroke="white" strokeWidth="1.5" strokeOpacity="0.18" strokeLinejoin="round"
      />

      {/* Accent hairline */}
      <line x1="1" y1="37" x2="57" y2="37" stroke="white" strokeWidth="1" strokeOpacity="0.1" />

      {/* Car body */}
      <path
        d="M9 50 L9 43 L14 36 L21 31 L26 29 L37 29 L42 31 L48 37 L50 43 L50 50 Z"
        fill="white" fillOpacity="0.88"
      />

      {/* Windshield dark area */}
      <path d="M20 35 L21 31 L26 29 L30 29 L31 31 L27 35 Z" fill="black" fillOpacity="0.22" />

      {/* Rear window dark area */}
      <path d="M32 29 L37 29 L42 31 L41 35 L35 35 Z" fill="black" fillOpacity="0.16" />

      {/* Front wheel */}
      <circle cx="18" cy="51" r="7" fill="#0e0e0e" stroke="white" strokeWidth="1.5" strokeOpacity="0.55" />
      <circle cx="18" cy="51" r="2.5" fill="white" fillOpacity="0.25" />

      {/* Rear wheel */}
      <circle cx="41" cy="51" r="7" fill="#0e0e0e" stroke="white" strokeWidth="1.5" strokeOpacity="0.55" />
      <circle cx="41" cy="51" r="2.5" fill="white" fillOpacity="0.25" />

      {/* ── DIVIDER ──────────────────────────── */}
      <line x1="66" y1="14" x2="66" y2="58" stroke="white" strokeWidth="0.75" strokeOpacity="0.15" />

      {/* ── WORDMARK ─────────────────────────── */}

      {/* HENNY */}
      <text
        x="76" y="36"
        fontFamily="'Space Grotesk', Inter, system-ui, sans-serif"
        fontWeight="900"
        fontSize="22"
        letterSpacing="3"
        fill="white"
        dominantBaseline="middle"
      >
        <tspan fill="#e11d2e">H</tspan>ENNY
      </text>

      {/* AUTOMOTIVE */}
      <text
        x="76" y="54"
        fontFamily="'Space Grotesk', Inter, system-ui, sans-serif"
        fontWeight="700"
        fontSize="10"
        letterSpacing="4"
        fill="rgba(255,255,255,0.45)"
        dominantBaseline="middle"
      >
        <tspan fill="#e11d2e" fillOpacity="0.8">A</tspan>UTOMOTIVE
      </text>
    </svg>
  )
}
