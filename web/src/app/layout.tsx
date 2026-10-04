import type {Metadata} from 'next'
import {Figtree, Source_Serif_4} from 'next/font/google'
import './globals.css'

const figtree = Figtree({subsets: ['latin', 'latin-ext'], variable: '--font-figtree'})
const serif = Source_Serif_4({subsets: ['latin', 'latin-ext'], variable: '--font-source-serif'})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://patnis.lv'),
  title: {default: 'Patnis', template: '%s | Patnis'},
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="lv" className={`${figtree.variable} ${serif.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
