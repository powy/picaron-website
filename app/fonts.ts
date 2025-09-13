import { Cormorant_Garamond, Cormorant } from 'next/font/google'

export const garamondFont = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-garamond',
  display: 'swap',
})

export const granjonFont = Cormorant({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-granjon',
  display: 'swap',
})