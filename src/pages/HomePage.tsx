import PageMeta from '../components/seo/PageMeta'
import HeroSection from '../components/sections/HeroSection'
import MarketSourcingGrid from '../components/sections/MarketSourcingGrid'
import FeaturedPerformance from '../components/sections/FeaturedPerformance'
import EngineeredForTrust from '../components/sections/EngineeredForTrust'
import GlobalLogistics from '../components/sections/GlobalLogistics'
import { HubUSA, HubGhana } from '../components/sections/LocationHubs'
import PartsPreview from '../components/sections/PartsPreview'
import TestimonialBlock from '../components/sections/TestimonialBlock'
import CTABanner from '../components/sections/CTABanner'
import { useSettings } from '../contexts/SettingsContext'

export default function HomePage() {
  const { tagline, site_name } = useSettings()
  return (
    <>
      <PageMeta
        title={tagline}
        description={`${site_name} — elite vehicle sourcing from the USA to Ghana. Premium cars, performance parts, and seamless international logistics since 2014.`}
        path="/"
      />
      <HeroSection />
      <MarketSourcingGrid />
      <FeaturedPerformance />
      <EngineeredForTrust />
      <GlobalLogistics />
      <HubUSA />
      <HubGhana />
      <PartsPreview />
      <TestimonialBlock />
      <CTABanner />
    </>
  )
}
