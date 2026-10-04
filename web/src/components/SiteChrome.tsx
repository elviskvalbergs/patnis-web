import Link from 'next/link'
import {SanityImg} from './SanityImg'
import {SmartLink} from './SmartLink'
import {linkHref, type ResolvedLink, type SanityImage} from './types'

export type Settings = {
  title?: string
  tagline?: string
  logo?: SanityImage
  copyright?: string
  social?: {_key: string; platform?: string; url?: string}[]
  mainNav?: ResolvedLink[]
  footerLinks?: ResolvedLink[]
}

export function Header({settings}: {settings: Settings | null}) {
  return (
    <header className="sticky top-0 z-30 border-b border-brand/10 bg-cream/95 backdrop-blur">
      <div className="container-x flex items-center gap-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          {settings?.logo ? <SanityImg image={{...settings.logo, alt: settings.title}} width={160} className="h-10 w-auto" priority /> : <span className="font-serif text-2xl text-brand-dark">{settings?.title || 'Patnis'}</span>}
        </Link>
        <details className="relative ml-auto md:hidden">
          <summary className="cursor-pointer list-none rounded-lg px-3 py-2 text-brand-dark" aria-label="Izvēlne">☰</summary>
          <nav className="absolute right-0 mt-2 w-56 rounded-xl bg-white p-2 shadow-lg">
            {settings?.mainNav?.map((l) => (
              <SmartLink key={l._key} href={linkHref(l)} className="block rounded-lg px-3 py-2 text-brand-dark hover:bg-cream">{l.label}</SmartLink>
            ))}
          </nav>
        </details>
        <nav className="ml-auto hidden gap-1 md:flex">
          {settings?.mainNav?.map((l) => (
            <SmartLink key={l._key} href={linkHref(l)} className="rounded-full px-4 py-2 font-medium text-brand-dark hover:bg-brand/10">{l.label}</SmartLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export function Footer({settings}: {settings: Settings | null}) {
  return (
    <footer className="mt-16 bg-brand-dark text-white">
      <div className="container-x grid gap-8 py-12 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl">{settings?.title || 'Patnis'}</p>
          {settings?.tagline && <p className="mt-1 text-white/80">{settings.tagline}</p>}
        </div>
        <nav className="grid gap-2">
          {settings?.footerLinks?.map((l) => (
            <SmartLink key={l._key} href={linkHref(l)} className="text-white/90 hover:text-white hover:underline">{l.label}</SmartLink>
          ))}
        </nav>
        <div className="flex flex-wrap content-start items-start gap-3 md:justify-end">
          {settings?.social?.map((s) => (
            <a key={s._key} href={s.url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/30 px-4 py-2 text-sm hover:bg-white/10">{s.platform}</a>
          ))}
        </div>
      </div>
      {settings?.copyright && <p className="container-x border-t border-white/15 py-4 text-sm text-white/70">{settings.copyright}</p>}
    </footer>
  )
}
