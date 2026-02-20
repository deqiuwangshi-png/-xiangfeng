'use client'

import HeroSection from '@/components/marketing/HeroSection'
import FeaturesSection from '@/components/marketing/FeaturesSection'
import HowItWorksSection from '@/components/marketing/HowItWorksSection'
import CreatorsSection from '@/components/marketing/CreatorsSection'
import EconomySection from '@/components/marketing/EconomySection'
import CTASection from '@/components/marketing/CTASection'
import ScrollReveal from '@/components/marketing/ScrollReveal'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CreatorsSection />
      <EconomySection />
      <CTASection />
      <ScrollReveal />
    </>
  )
}
