import './globals.css'
import { oldStyleFont } from './fonts'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={oldStyleFont.variable}>
      <body>{children}</body>
    </html>
  )
}