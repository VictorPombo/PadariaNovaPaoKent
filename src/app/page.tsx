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
import { CartProvider } from '../context/CartContext'
import { CartSidebar } from '../components/cart/CartSidebar'
import DailyBreadBanner from '../components/landing/DailyBreadBanner'
import BirthdayGift from '../components/landing/BirthdayGift'

export default function HomePage() {
  return (
    <CartProvider>
      <div
        className="landing-body paper-texture"
        style={{ background: '#1A0F08', color: '#FAF6EF', fontFamily: 'var(--font-inter)' }}
      >
        <LandingHeader />
        <DailyBreadBanner />
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
          <BirthdayGift />
          <ContactSection />
        </main>
        <FloatingButtons />
        <CartSidebar />
      </div>
    </CartProvider>
  )
}
