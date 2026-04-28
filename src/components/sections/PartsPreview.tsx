import { useNavigate } from 'react-router-dom'
import { Settings2 } from 'lucide-react'
import { buildWhatsAppUrl } from '../../lib/tokens'

const IMAGE_PANELS = [
  {
    image: '/images/parts/v8-mustang-engine.jpg',
    alt: 'High-performance V8 engine block',
    title: 'Engines',
    subtitle: 'Complete Swaps Available',
  },
  {
    image: '/images/parts/forged-alloy-wheels.jpg',
    alt: 'Forged alloy wheels and performance tyres',
    title: 'Wheels & Tyres',
    subtitle: 'Premium Brands Only',
  },
] as const

export default function PartsPreview() {
  const navigate = useNavigate()

  return (
    <section id="parts-preview" className="py-24 md:py-32 px-6 md:px-8 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">

        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 md:mb-16 gap-6 md:gap-8">
          <h2 className="font-headline text-4xl md:text-5xl font-black text-white uppercase italic leading-none">
            Parts &amp;{' '}
            <span className="text-primary-container">Performance</span>
          </h2>
          <p className="font-body text-on-surface-variant max-w-md leading-relaxed">
            Beyond vehicles, we supply genuine high-performance components.
            Sourced from the US, delivered to your mechanic.
          </p>
        </div>

        {/* Mosaic grid — gap-1 gives seamless panel joins */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">

          {/* Image panels */}
          {IMAGE_PANELS.map((panel) => (
            <div
              key={panel.title}
              className="group relative overflow-hidden h-[400px] cursor-pointer"
              onClick={() => navigate('/parts')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/parts')}
              aria-label={`Browse ${panel.title}`}
            >
              <img
                src={panel.image}
                alt={panel.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              {/* Dark overlay — lightens on hover */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
              {/* Text */}
              <div className="absolute bottom-8 left-8">
                <h4 className="font-headline text-3xl font-black text-white uppercase">
                  {panel.title}
                </h4>
                <p className="font-label text-xs font-bold uppercase tracking-widest text-primary-container mt-1">
                  {panel.subtitle}
                </p>
              </div>
            </div>
          ))}

          {/* Request a Part CTA panel */}
          <div className="group relative overflow-hidden h-[400px] flex items-center justify-center bg-surface-bright">
            <div className="text-center p-8">
              <Settings2 size={60} className="text-primary-container mb-6 block" />
              <h4 className="font-headline text-2xl font-black text-white uppercase mb-6">
                Request a Part
              </h4>
              <a
                href={buildWhatsAppUrl("Hi, I'd like to request a specific car part.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border-2 border-white/20 text-white px-8 py-3 font-headline font-bold uppercase text-xs tracking-widest hover:border-primary-container transition-colors duration-150"
              >
                Inquire Now
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
