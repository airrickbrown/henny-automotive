import { testimonials } from '../../data/testimonials'

export default function TestimonialBlock() {
  const t = testimonials[0]
  if (!t) return null

  return (
    <section className="py-24 md:py-32 bg-surface">
      <div className="max-w-5xl mx-auto px-6 md:px-8 text-center">

        {/* Quote icon — filled */}
        <span
          className="font-material-filled text-5xl text-primary-container mb-8 block"
          aria-hidden="true"
        >
          format_quote
        </span>

        {/* Quote */}
        <blockquote>
          <p className="font-headline text-3xl md:text-5xl font-light text-white leading-tight italic">
            &ldquo;{t.quote}&rdquo;
          </p>

          {/* Attribution */}
          <footer className="mt-12">
            <p className="font-headline text-xl font-bold text-white uppercase tracking-widest">
              {t.name}
            </p>
            <p className="font-body text-sm text-primary-container font-medium mt-1">
              {t.role} &bull; {t.location}
            </p>
          </footer>
        </blockquote>

      </div>
    </section>
  )
}
