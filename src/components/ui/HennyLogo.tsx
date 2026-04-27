interface HennyLogoProps {
  width?: number
  maxHeight?: number
  className?: string
}

export default function HennyLogo({ width = 140, maxHeight, className = '' }: HennyLogoProps) {
  const naturalHeight = Math.round(width * 82 / 200)
  const height = maxHeight ? Math.min(naturalHeight, maxHeight) : naturalHeight

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 82"
      width={width}
      height={height}
      aria-label="Henny Automotive"
      className={`flex-shrink-0 ${className}`}
      fill="none"
    >
      {/* ── MARK ─────────────────────────────── */}

      {/* Red top arch */}
      <path d="M3 32 Q29 7 55 32" stroke="#e11d2e" strokeWidth="4.5" strokeLinecap="round" />

      {/* Shield outline */}
      <path
        d="M3 32 L3 50 L29 65 L55 50 L55 32"
        stroke="white" strokeWidth="1.5" strokeOpacity="0.22" strokeLinejoin="round"
      />

      {/* Shield bottom point */}
      <path
        d="M18 55 L29 63 L40 55"
        stroke="white" strokeWidth="1" strokeOpacity="0.12" strokeLinejoin="round"
      />

      {/* Horizontal accent lines */}
      <line x1="1" y1="37" x2="57" y2="37" stroke="white" strokeWidth="0.75" strokeOpacity="0.14" />
      <line x1="1" y1="44" x2="57" y2="44" stroke="white" strokeWidth="0.5"  strokeOpacity="0.08" />

      {/* Car outline — line-art style */}
      <path
        d="M10 48 L10 42 L15 35 L22 30 L28 28 L36 28 L42 30 L48 36 L50 42 L50 48 Z"
        stroke="white" strokeWidth="1.4" strokeOpacity="0.75" strokeLinejoin="round"
        fill="white" fillOpacity="0.06"
      />
      {/* Windshield */}
      <path d="M20 34 L22 30 L28 28 L31 28 L30 34 Z"
        stroke="white" strokeWidth="1" strokeOpacity="0.4" fill="none" />
      {/* Rear window */}
      <path d="M33 28 L36 28 L42 30 L41 34 L34 34 Z"
        stroke="white" strokeWidth="1" strokeOpacity="0.3" fill="none" />
      {/* Roofline */}
      <line x1="30" y1="34" x2="34" y2="34" stroke="white" strokeWidth="1" strokeOpacity="0.3" />

      {/* Front wheel */}
      <circle cx="18" cy="49" r="6.5" stroke="white" strokeWidth="1.4" strokeOpacity="0.6" fill="#0e0e0e" />
      <circle cx="18" cy="49" r="2.2" stroke="white" strokeWidth="0.8" strokeOpacity="0.25" fill="none" />

      {/* Rear wheel */}
      <circle cx="41" cy="49" r="6.5" stroke="white" strokeWidth="1.4" strokeOpacity="0.6" fill="#0e0e0e" />
      <circle cx="41" cy="49" r="2.2" stroke="white" strokeWidth="0.8" strokeOpacity="0.25" fill="none" />

      {/* ── DIVIDER ──────────────────────────── */}
      <line x1="66" y1="10" x2="66" y2="72" stroke="white" strokeWidth="0.75" strokeOpacity="0.12" />

      {/* ── WORDMARK ─────────────────────────── */}

      {/* HENNY */}
      <text
        x="76" y="34"
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
        x="76" y="52"
        fontFamily="'Space Grotesk', Inter, system-ui, sans-serif"
        fontWeight="700"
        fontSize="10"
        letterSpacing="4"
        fill="rgba(255,255,255,0.45)"
        dominantBaseline="middle"
      >
        <tspan fill="#e11d2e" fillOpacity="0.8">A</tspan>UTOMOTIVE
      </text>

      {/* you ask, we deliver. */}
      <text
        x="77" y="67"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontStyle="italic"
        fontWeight="400"
        fontSize="7.5"
        letterSpacing="0.8"
        fill="rgba(255,255,255,0.28)"
        dominantBaseline="middle"
      >
        you ask, we deliver.
      </text>
    </svg>
  )
}
