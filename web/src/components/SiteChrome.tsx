import Link from 'next/link'
import {SanityImg} from './SanityImg'
import {SmartLink} from './SmartLink'
import {linkHref, type ResolvedLink, type SanityImage} from './types'

// Header and footer reproduce the Drupal "bootstrap_patnis" theme (see docs/reference/).

export type Settings = {
  title?: string
  tagline?: string
  logo?: SanityImage
  copyright?: string
  social?: {_key: string; platform?: string; url?: string}[]
  mainNav?: ResolvedLink[]
  footerLinks?: ResolvedLink[]
}

const ICONS: Record<string, string> = {
  facebook: 'M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v9h4v-9h3l.5-4h-3.5V8.8c0-.5.3-.8.5-.8Z',
  instagram: 'M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm4 3.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm0 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM17 6.2a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6Z',
  x: 'M4 4h4.5l4 5.6L17.3 4H20l-6.2 7.2L20.5 20H16l-4.4-6.1L6.4 20H3.7l6.6-7.7L4 4Z',
  linkedin: 'M5 9h3v11H5V9Zm1.5-5a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4ZM10 9h2.9v1.5c.5-.9 1.7-1.8 3.4-1.8 3 0 3.7 2 3.7 4.6V20h-3v-5.9c0-1.4-.1-3-1.9-3s-2.1 1.4-2.1 2.9v6H10V9Z',
  teams: 'M14 7a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm-1 3h7v5a3 3 0 0 1-3 3h-1v-6a2 2 0 0 0-2-2h-1Zm-9 0h9v8H4v-8Zm3 2v1h1v4h1v-4h1v-1H7Zm1-6.5a2.5 2.5 0 1 1 0 4.5V5.5Z',
}

function SocialIcon({platform = ''}: {platform?: string}) {
  const key = Object.keys(ICONS).find((k) => platform.toLowerCase().includes(k === 'x' ? 'x' : k)) || ''
  const d = ICONS[platform.toLowerCase() === 'x' ? 'x' : key]
  return d ? (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current" aria-hidden="true"><path d={d} /></svg>
  ) : (
    <span className="text-xs">{platform.slice(0, 2)}</span>
  )
}

export function Header({settings}: {settings: Settings | null}) {
  const tagline = (settings?.tagline || '').split(/(?<=\.)\s+/)
  return (
    <header className="bg-cream">
      <div className="container-x">
        <div className="flex items-center gap-4 border-b border-brand-dark pb-1.5 pt-3 md:gap-8">
          <Link href="/" className="flex shrink-0 items-center gap-4">
            {settings?.logo?.asset?._ref ? (
              <SanityImg image={{...settings.logo, alt: settings.title || 'Patnis'}} width={160} className="h-20 w-auto md:h-[127px]" priority />
            ) : (
              <span className="flex h-20 w-20 items-center justify-center bg-brand-dark text-2xl font-bold text-white md:h-[127px] md:w-[127px] md:text-3xl">Patnis</span>
            )}
            <span className="hidden text-sm font-semibold leading-relaxed text-brand md:block">
              {tagline.map((t) => (
                <span key={t} className="block">{t}</span>
              ))}
            </span>
          </Link>
          <nav className="hidden flex-wrap gap-x-4 gap-y-2 md:flex" aria-label="Galvenā izvēlne">
            {settings?.mainNav?.map((l) => (
              <SmartLink key={l._key} href={linkHref(l)} className="border-b-[3px] border-brand-dark px-2 pb-0.5 text-lg font-medium uppercase tracking-wide text-black hover:text-brand">
                {l.label}
              </SmartLink>
            ))}
          </nav>
          <details className="relative ml-auto md:hidden">
            <summary className="cursor-pointer list-none rounded px-3 py-2 text-2xl text-brand-dark" aria-label="Izvēlne">☰</summary>
            <nav className="absolute right-0 z-30 mt-2 w-60 bg-white p-2 shadow-lg">
              {settings?.mainNav?.map((l) => (
                <SmartLink key={l._key} href={linkHref(l)} className="block px-3 py-2 font-medium uppercase text-black hover:bg-cream">{l.label}</SmartLink>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}

function FooterHeading({children}: {children: React.ReactNode}) {
  return <h2 className="mb-4 border-b-[3px] border-brand-dark pb-1 text-base font-bold uppercase text-black">{children}</h2>
}

export function Footer({settings}: {settings: Settings | null}) {
  return (
    <footer className="mt-10 bg-[#efefef] text-sm text-black">
      <div className="container-x grid gap-8 pb-16 pt-14 sm:grid-cols-[215px_215px]">
        <div>
          <FooterHeading>Uzzini vairāk</FooterHeading>
          <nav className="grid gap-0.5">
            {settings?.footerLinks?.map((l) => (
              <SmartLink key={l._key} href={linkHref(l)} className="hover:underline">{l.label}</SmartLink>
            ))}
          </nav>
        </div>
        <div>
          <FooterHeading>Rīki</FooterHeading>
          <div className="flex gap-2 pl-5">
            {settings?.social?.map((s) => (
              <a key={s._key} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.platform} className="flex h-9 w-9 items-center justify-center rounded bg-brand text-white hover:bg-brand-dark">
                <SocialIcon platform={s.platform} />
              </a>
            ))}
          </div>
        </div>
      </div>
      {settings?.copyright && <p className="container-x pb-16">{settings.copyright}</p>}
    </footer>
  )
}
