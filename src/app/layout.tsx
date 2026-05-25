import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Padaria Nova Paokent — 30 anos de tradição em Jardim Paulistano',
    template: '%s | Padaria Nova Paokent',
  },
  description:
    'Padaria e confeitaria artesanal no coração do Jardim Paulistano, São Paulo. Mais de 30 anos de tradição, sabor e qualidade premium. Delivery próprio e iFood.',
  keywords: [
    'padaria', 'padaria jardim paulistano', 'padaria são paulo',
    'nova paokent', 'padaria artesanal', 'cafeteria', 'delivery padaria',
    'café expresso', 'pão artesanal', 'lanche premium', 'brunch sp'
  ],
  authors: [{ name: 'Padaria Nova Paokent' }],
  creator: 'Padaria Nova Paokent',
  publisher: 'Padaria Nova Paokent',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://novapaokent.com.br',
    title: 'Padaria Nova Paokent — 30 anos de tradição em Jardim Paulistano',
    description:
      'Padaria artesanal, cafeteria e restaurante no coração do Jardim Paulistano, São Paulo.',
    siteName: 'Padaria Nova Paokent',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Padaria Nova Paokent — Jardim Paulistano, São Paulo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Padaria Nova Paokent',
    description: '30 anos de tradição em Jardim Paulistano, São Paulo.',
    images: ['/og-image.jpg'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
  },
  alternates: {
    canonical: 'https://novapaokent.com.br',
  },
}

export const viewport: Viewport = {
  themeColor: '#C9A84C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Schema.org — LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Bakery',
              name: 'Padaria Nova Paokent',
              description: 'Padaria e confeitaria artesanal com mais de 30 anos de tradição.',
              url: 'https://novapaokent.com.br',
              telephone: '+55-11-97653-5789',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Rua Prof. Artur Ramos, 223',
                addressLocality: 'Jardim Paulistano',
                addressRegion: 'SP',
                postalCode: '01454-000',
                addressCountry: 'BR',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: -23.571,
                longitude: -46.692,
              },
              openingHours: ['Mo-Su 06:00-22:00'],
              image: 'https://novapaokent.com.br/og-image.jpg',
              priceRange: '$$',
              servesCuisine: ['Brasileira', 'Padaria', 'Cafeteria'],
              hasMenu: 'https://novapaokent.com.br/cardapio',
              sameAs: ['https://www.instagram.com/novapaokent'],
              foundingDate: '1993',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '5',
                reviewCount: '200',
              },
            }),
          }}
        />
        {/* PWA service worker register */}
        <Script id="register-sw">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').catch(function(err) {
                  console.warn('SW registration failed:', err);
                });
              });
            }
          `}
        </Script>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
