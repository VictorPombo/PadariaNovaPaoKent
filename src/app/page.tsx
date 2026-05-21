// Componentes da Landing Page da Padaria Nova Paokent
import LandingHeader from '../components/landing/LandingHeader'
import HeroSection from '../components/landing/HeroSection'
import SpecialSandwiches from '../components/landing/SpecialSandwiches'
import ServicesSection from '../components/landing/ServicesSection'
import MenuSection from '../components/landing/MenuSection'
import TraditionSection from '../components/landing/TraditionSection'
import ClientsSection from '../components/landing/ClientsSection'
import ReviewsSection from '../components/landing/ReviewsSection'
import DeliverySection from '../components/landing/DeliverySection'
import BlogSection from '../components/landing/BlogSection'
import ContactSection from '../components/landing/ContactSection'
import FloatingButtons from '../components/landing/FloatingButtons'

export default function HomePage() {
  return (
    <div
      className="landing-body paper-texture"
      style={{ background: '#1A0F08', color: '#FAF6EF', fontFamily: 'var(--font-inter)' }}
    >
      <LandingHeader />
      <main>
        <HeroSection />
        <SpecialSandwiches />
        <ServicesSection />
        <MenuSection />
        <TraditionSection />
        <ClientsSection />
        <ReviewsSection />
        <BlogSection />
        <DeliverySection />
        <ContactSection />
      </main>
      <FloatingButtons />
    </div>
  )
}
