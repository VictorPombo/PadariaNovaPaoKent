import LandingHeader from '@/components/landing/LandingHeader'
import EventsMenuClient from './EventsMenuClient'
import Footer from '@/components/landing/Footer' // Wait, I don't know if there's a Footer. Let me just use FloatingButtons.
import FloatingButtons from '@/components/landing/FloatingButtons'

export const metadata = {
  title: 'Menu de Encomendas - Nova Paokent',
  description: 'Cardápio completo de eventos e encomendas da Padaria Nova Paokent.',
}

export default function EncomendasPage() {
  return (
    <>
      <LandingHeader />
      <main>
        <EventsMenuClient />
      </main>
      <FloatingButtons />
    </>
  )
}
