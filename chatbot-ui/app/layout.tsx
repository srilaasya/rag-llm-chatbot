import '../styles/globals.css'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'Modern Chat Interface',
  description: 'A sleek and modern chat interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${montserrat.variable} font-sans`}>
      <body className="bg-black min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-black to-black"></div>
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}