import './globals.css'
import { garamondFont, granjonFont } from './fonts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={`${garamondFont.variable} ${granjonFont.variable}`}>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}