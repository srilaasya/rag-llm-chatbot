import '../styles/globals.css'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import Footer from '../components/Footer';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'Personalized RAG chatbot',
  description: 'Customize a personalized RAG chatbot for your website',
  icons: {
    icon: '/favicon.ico', // This line sets the favicon
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${montserrat.variable} font-sans`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="bg-black min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-black to-black"></div>
        <div className="relative z-10 min-h-screen pb-16"> {/* Added pb-16 for footer space */}
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}