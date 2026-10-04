import Link from 'next/link'
import {sanityFetch} from '@/sanity/client'
import {articleListQuery, branchesQuery} from '@/sanity/queries'
import {Documents} from './Documents'
import {HtmlBlock} from './HtmlBlock'
import {RichText} from './RichText'
import {SanityImg} from './SanityImg'
import {SmartLink} from './SmartLink'
import {linkHref, type Download, type Person, type ResolvedLink, type RichText as RT, type SanityImage, type Section} from './types'

const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString('lv-LV', {day: 'numeric', month: 'long', year: 'numeric'}) : '')

function Buttons({links}: {links?: ResolvedLink[]}) {
  if (!links?.length) return null
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {links.map((l, i) => (
        <SmartLink key={l._key || i} href={linkHref(l)} className={i === 0 ? 'btn-primary' : 'btn-outline'}>
          {l.label || 'Uzzināt vairāk'}
        </SmartLink>
      ))}
    </div>
  )
}

function Heading({children}: {children?: React.ReactNode}) {
  return children ? <h2 className="mb-6 font-serif text-3xl text-brand-dark">{children}</h2> : null
}

type Card = {_key: string; title: string; eyebrow?: string; text?: string; image?: SanityImage; link?: ResolvedLink}
type ArticleItem = {_id: string; title: string; publishedAt?: string; excerpt?: string; mainImage?: SanityImage; slug: string}
type Branch = {_id: string; name: string; summary?: string; address?: string; image?: SanityImage; slug: string}
type Gallery = {_id: string; title: string; date?: string; images?: (SanityImage & {_key: string})[]}

async function ArticleList({s, page}: {s: Section; page: number}) {
  const limit = (s.limit as number) || 20
  const from = (page - 1) * limit
  const data = await sanityFetch<{items: ArticleItem[]; total: number}>(articleListQuery(from, from + limit), {categoryId: (s.categoryId as string) || null})
  if (!data?.items.length) return null
  const pages = Math.ceil(data.total / limit)
  return (
    <div>
      <Heading>{s.heading}</Heading>
      {s.layout === 'cards' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((a) => (
            <Link key={a._id} href={`/raksts/${a.slug}`} className="card group">
              {a.mainImage && <SanityImg image={a.mainImage} width={600} className="aspect-[3/2] w-full object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />}
              <div className="p-5">
                <p className="text-sm text-ink/60">{fmtDate(a.publishedAt)}</p>
                <h3 className="mt-1 font-semibold text-brand-dark group-hover:underline">{a.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <ul className="divide-y divide-brand/15">
          {data.items.map((a) => (
            <li key={a._id} className="flex gap-5 py-4">
              {a.mainImage && <SanityImg image={a.mainImage} width={240} className="hidden h-24 w-36 shrink-0 rounded-lg object-cover sm:block" />}
              <div>
                <p className="text-sm text-ink/60">{fmtDate(a.publishedAt)}</p>
                <Link href={`/raksts/${a.slug}`} className="font-semibold text-brand-dark hover:underline">{a.title}</Link>
                {a.excerpt && <p className="mt-1 line-clamp-2 text-ink/80">{a.excerpt}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
      {pages > 1 && (
        <nav className="mt-8 flex flex-wrap gap-2" aria-label="Lapas">
          {Array.from({length: pages}, (_, i) => i + 1).map((n) => (
            <Link key={n} href={`?lapa=${n}`} className={`rounded-full px-4 py-2 text-sm ${n === page ? 'bg-brand text-white' : 'bg-white text-brand-dark hover:bg-brand/10'}`}>
              {n}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}

async function BranchList({s}: {s: Section}) {
  const branches = await sanityFetch<Branch[]>(branchesQuery, {division: (s.division as string) || null})
  if (!branches?.length) return null
  return (
    <div>
      <Heading>{s.heading}</Heading>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {branches.map((b) => (
          <Link key={b._id} href={`/${b.slug}`} className="card group">
            {b.image && <SanityImg image={b.image} width={600} className="aspect-[3/2] w-full object-cover" />}
            <div className="p-5">
              <h3 className="font-semibold text-brand-dark group-hover:underline">{b.name}</h3>
              {b.address && <p className="mt-1 text-sm text-ink/70">{b.address}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function PeopleGrid({people}: {people?: Person[]}) {
  if (!people?.length) return null
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {people.map((p) => (
        <div key={p._id} className="rounded-xl bg-white p-5">
          <p className="font-semibold text-brand-dark">{p.name}</p>
          {p.role && <p className="text-sm text-ink/70">{p.role}</p>}
          <div className="mt-2 space-y-1 text-sm">
            {p.email && <a className="block text-brand hover:underline" href={`mailto:${p.email}`}>{p.email}</a>}
            {p.phone && <a className="block text-brand hover:underline" href={`tel:${p.phone.replace(/\s/g, '')}`}>{p.phone}</a>}
            {p.address && <p className="text-ink/70">{p.address}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

function Galleries({galleries}: {galleries?: Gallery[]}) {
  if (!galleries?.length) return null
  return (
    <div className="space-y-12">
      {galleries.map((g) => (
        <div key={g._id}>
          <h3 className="font-serif text-2xl text-brand-dark">{g.title}</h3>
          {g.date && <p className="text-sm text-ink/60">{fmtDate(g.date)}</p>}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {g.images?.map((img) => (
              <SanityImg key={img._key} image={img} width={500} className="aspect-square w-full rounded-lg object-cover" sizes="(min-width: 1024px) 25vw, 50vw" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function Sections({sections, page = 1}: {sections?: Section[]; page?: number}) {
  if (!sections?.length) return null
  return (
    <>
      {sections.map((s) => {
        let inner: React.ReactNode = null
        switch (s._type) {
          case 'htmlBlock':
            return (
              <section key={s._key} className="container-x py-6">
                <HtmlBlock html={s.html as string} css={s.css as string} js={s.js as string | undefined} scope={s.scope as string} assets={s.assets as {originalUrl?: string; url?: string}[]} />
              </section>
            )
          case 'hero':
            return (
              <section key={s._key} className="relative overflow-hidden bg-brand-dark text-white">
                {Boolean(s.image) && <SanityImg image={s.image as SanityImage} width={2000} priority className="absolute inset-0 h-full w-full object-cover opacity-40" sizes="100vw" />}
                <div className="container-x relative py-24">
                  {Boolean(s.title) && <h1 className="max-w-3xl font-serif text-4xl md:text-6xl">{s.title as string}</h1>}
                  {Boolean(s.subtitle) && <p className="mt-4 max-w-2xl text-lg text-white/90">{s.subtitle as string}</p>}
                  <Buttons links={s.buttons as ResolvedLink[]} />
                </div>
              </section>
            )
          case 'textSection':
            inner = (
              <div className="max-w-3xl">
                <Heading>{s.heading}</Heading>
                <RichText value={s.body as RT} />
              </div>
            )
            break
          case 'cardGrid':
            inner = (
              <div>
                <Heading>{s.heading}</Heading>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {(s.cards as Card[] | undefined)?.map((c) => (
                    <SmartLink key={c._key} href={linkHref(c.link)} className="card group">
                      {c.image && <SanityImg image={c.image} width={600} className="aspect-[3/2] w-full object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />}
                      <div className="p-5">
                        {c.eyebrow && <p className="text-xs font-semibold uppercase tracking-wide text-accent-dark">{c.eyebrow}</p>}
                        <h3 className="mt-1 text-lg font-semibold text-brand-dark group-hover:underline">{c.title}</h3>
                        {c.text && <p className="mt-2 text-ink/80">{c.text}</p>}
                      </div>
                    </SmartLink>
                  ))}
                </div>
              </div>
            )
            break
          case 'linkList':
            inner = (
              <div>
                <Heading>{s.heading}</Heading>
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {(s.links as ResolvedLink[] | undefined)?.map((l, i) => (
                    <li key={l._key || i}>
                      <SmartLink href={linkHref(l)} className="block rounded-lg bg-white px-4 py-3 font-medium text-brand-dark hover:bg-brand/10">{l.label}</SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
            )
            break
          case 'documentList':
            inner = <div className="max-w-3xl"><Documents items={s.documents as Download[]} heading={s.heading} /></div>
            break
          case 'articleList':
            inner = <ArticleList s={s} page={page} />
            break
          case 'branchList':
            inner = <BranchList s={s} />
            break
          case 'contacts':
            inner = (
              <div>
                <Heading>{s.heading}</Heading>
                <PeopleGrid people={s.people as Person[]} />
              </div>
            )
            break
          case 'pricing':
            inner = (
              <div className="max-w-3xl">
                <Heading>{s.heading}</Heading>
                <table className="w-full overflow-hidden rounded-xl bg-white text-left">
                  <tbody>
                    {(s.rows as {_key: string; name?: string; price?: string; note?: string}[] | undefined)?.map((r) => (
                      <tr key={r._key} className="border-b border-brand/10 last:border-0">
                        <td className="px-5 py-3 font-medium">{r.name}{r.note && <span className="block text-sm font-normal text-ink/60">{r.note}</span>}</td>
                        <td className="px-5 py-3 text-right font-semibold text-brand-dark">{r.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4"><RichText value={s.note as RT} /></div>
              </div>
            )
            break
          case 'faq':
            inner = (
              <div className="max-w-3xl">
                <Heading>{s.heading}</Heading>
                <div className="space-y-3">
                  {(s.items as {_key: string; question: string; answer?: RT}[] | undefined)?.map((q) => (
                    <details key={q._key} className="rounded-xl bg-white p-5">
                      <summary className="cursor-pointer font-semibold text-brand-dark">{q.question}</summary>
                      <div className="mt-3"><RichText value={q.answer} /></div>
                    </details>
                  ))}
                </div>
              </div>
            )
            break
          case 'cta':
            inner = (
              <div className="rounded-2xl bg-brand px-8 py-10 text-white">
                {s.heading && <h2 className="font-serif text-3xl">{s.heading}</h2>}
                {Boolean(s.text) && <p className="mt-2 max-w-2xl text-white/90">{s.text as string}</p>}
                <Buttons links={s.buttons as ResolvedLink[]} />
              </div>
            )
            break
          case 'gallerySection':
            inner = (
              <div>
                <Heading>{s.heading}</Heading>
                <Galleries galleries={s.galleries as Gallery[]} />
              </div>
            )
            break
        }
        return inner ? (
          <section key={s._key} className="container-x py-10">
            {inner}
          </section>
        ) : null
      })}
    </>
  )
}
