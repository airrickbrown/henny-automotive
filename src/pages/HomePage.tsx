import PageMeta from '../components/seo/PageMeta'
import HeroSection from '../components/sections/HeroSection'
import MarketSourcingGrid from '../components/sections/MarketSourcingGrid'
import FeaturedPerformance from '../components/sections/FeaturedPerformance'
import EngineeredForTrust from '../components/sections/EngineeredForTrust'
import GlobalLogistics from '../components/sections/GlobalLogistics'
import PartsPreview from '../components/sections/PartsPreview'
import TestimonialBlock from '../components/sections/TestimonialBlock'
import CTABanner from '../components/sections/CTABanner'

export default function HomePage() {
  return (
    <>
      <PageMeta
        title="The Kinetic Monolith"
        description="Henny Automotive — elite vehicle sourcing from the USA to Ghana. Premium cars, performance parts, and seamless international logistics since 2014."
        path="/"
      />
      <HeroSection />
      <MarketSourcingGrid />
      <FeaturedPerformance />
      <EngineeredForTrust />
      <GlobalLogistics />
      <PartsPreview />
      <TestimonialBlock />
      <CTABanner />
    </>
  )
}
