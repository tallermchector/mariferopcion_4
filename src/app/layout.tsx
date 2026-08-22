// ./src/app/layout.tsx
import type { Metadata } from 'next';
import { Outfit, Manrope, Lobster_Two, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const lobsterTwo = Lobster_Two({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['700'],
  variable: '--font-brand',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MARIFER — Tu Ropa Diaria | Boutique Uruguaya',
  description: 'Tienda online uruguaya. Tu ropa diaria, sin vueltas. Prendas para todos los días con 6 pagos sin recargo y envíos a todo el país.',
  openGraph: {
    title: 'MARIFER — Tu Ropa Diaria',
    description: 'Tienda online de ropa uruguaya. Calidez, calidad y estilo diario sin vueltas.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`h-full ${outfit.variable} ${manrope.variable} ${lobsterTwo.variable} ${jetbrainsMono.variable}`}
    >
      <body
        className="flex min-h-full flex-col bg-[#fffcff] text-[#403945] antialiased selection:bg-[#452453]/15 selection:text-[#452453]"
        suppressHydrationWarning
      >
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}


