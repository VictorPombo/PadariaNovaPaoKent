// Componentes da Landing Page da Padaria Nova Paokent
import LandingHeader from '../components/landing/LandingHeader'
import HeroSection from '../components/landing/HeroSection'
import SpecialSandwiches from '../components/landing/SpecialSandwiches'
import MenuSection from '../components/landing/MenuSection'
import TraditionSection from '../components/landing/TraditionSection'
import ReviewsSection from '../components/landing/ReviewsSection'
import DeliverySection from '../components/landing/DeliverySection'
import ContactSection from '../components/landing/ContactSection'
import FloatingButtons from '../components/landing/FloatingButtons'

export default function HomePage() {
  return (
    <div
      className="landing-body paper-texture"
      style={{ background: '#FAF6EF', color: '#2C1A0E', fontFamily: 'var(--font-inter)' }}
    >
      <LandingHeader />
      <main>
        <HeroSection />
        <SpecialSandwiches />
        <MenuSection />
        <TraditionSection />
        <ReviewsSection />
        <DeliverySection />
        <ContactSection />
      </main>
      <FloatingButtons />
    </div>
  )
}
