import {Footer, Header, type Settings} from '@/components/SiteChrome'
import {sanityFetch} from '@/sanity/client'
import {isConfigured} from '@/sanity/env'
import {settingsQuery} from '@/sanity/queries'

export default async function SiteLayout({children}: {children: React.ReactNode}) {
  const settings = await sanityFetch<Settings>(settingsQuery)
  return (
    <>
      <Header settings={settings} />
      <main>
        {!isConfigured && (
          <div className="container-x py-10">
            <p className="rounded-xl bg-white p-6">Sanity nav pieslēgts: iestati NEXT_PUBLIC_SANITY_PROJECT_ID (sk. HANDOFF.md).</p>
          </div>
        )}
        {children}
      </main>
      <Footer settings={settings} />
    </>
  )
}
