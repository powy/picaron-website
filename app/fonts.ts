import localFont from 'next/font/local'

export const oldStyleFont = localFont({
  src: [
    {
      path: '../public/hinted-OldStyle1HPLHS.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/hinted-OldStyle1HPLHS.woff',
      weight: '400', 
      style: 'normal',
    }
  ],
  variable: '--font-oldstyle',
  display: 'swap',
})