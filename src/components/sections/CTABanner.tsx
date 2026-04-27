import { buildWhatsAppUrl } from '../../lib/tokens'

export default function CTABanner() {
  return (
    <section id="contact-cta" className="py-16 md:py-20 px-6 md:px-8">
      <div className="max-w-7xl mx-auto bg-primary-container p-10 md:p-20 relative overflow-hidden">

        {/* Subtle background image — right edge, 10% opacity */}
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none select-none">
          <img
            src="/images/cta-car-blur.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">

          <div className="text-center md:text-left">
            <h2 className="font-headline text-4xl md:text-6xl font-black text-white uppercase italic mb-4 leading-none">
              Ready to Drive?
            </h2>
            <p className="font-body text-xl text-white/90 font-light">
              Message us now to find your next luxury vehicle.
            </p>
          </div>

          <a
            href={buildWhatsAppUrl("Hi, I'm ready to find my next vehicle. Can you help?")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-white text-primary-container font-headline font-black uppercase tracking-widest px-10 md:px-12 py-5 md:py-6 rounded inline-block hover:scale-105 active:scale-95 transition-all duration-150 shadow-xl text-sm md:text-base"
          >
            Message on WhatsApp
          </a>

        </div>
      </div>
    </section>
  )
}
