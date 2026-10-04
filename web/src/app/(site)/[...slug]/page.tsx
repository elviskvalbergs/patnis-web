import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {Documents} from '@/components/Documents'
import {RichText} from '@/components/RichText'
import {SanityImg} from '@/components/SanityImg'
import {PeopleGrid, Sections} from '@/components/Sections'
import type {Download, Person, RichText as RT, SanityImage, Section} from '@/components/types'
import {sanityFetch} from '@/sanity/client'
import {pageQuery, pathsQuery} from '@/sanity/queries'

type PageDoc = {
  _type: 'page' | 'branch'
  title?: string
  name?: string
  intro?: string
  summary?: string
  address?: string
  image?: SanityImage
  facebookUrl?: string
  body?: RT
  contacts?: Person[]
  documents?: Download[]
  sections?: Section[]
  seo?: {title?: string; description?: string; noIndex?: boolean}
}

type Props = {params: Promise<{slug: string[]}>; searchParams: Promise<{lapa?: string}>}

const getPage = async (slug: string[]) => sanityFetch<PageDoc>(pageQuery, {path: slug.map(decodeURIComponent).join('/')})

export async function generateStaticParams() {
  const paths = await sanityFetch<{pages: {path: string}[]}>(pathsQuery)
  return (paths?.pages || []).map((p) => ({slug: p.path.split('/')}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const page = await getPage((await params).slug)
  if (!page) return {}
  return {
    title: page.seo?.title || page.title || page.name,
    description: page.seo?.description || page.intro || page.summary,
    robots: page.seo?.noIndex ? {index: false} : undefined,
  }
}

export default async function CatchAllPage({params, searchParams}: Props) {
  const page = await getPage((await params).slug)
  if (!page) notFound()
  const pageNo = Math.max(1, Number((await searchParams).lapa) || 1)
  // Hero and carried-over Drupal pages bring their own page heading.
  const firstIsHero = ['hero', 'htmlBlock'].includes(page.sections?.[0]?._type || '')

  if (page._type === 'branch') {
    return (
      <>
        <section className="container-x grid gap-10 py-12 md:grid-cols-2">
          <div>
            <h1 className="font-serif text-4xl text-brand-dark md:text-5xl">{page.name}</h1>
            {page.address && <p className="mt-3 text-lg text-ink/70">{page.address}</p>}
            <div className="mt-6"><RichText value={page.body} /></div>
            {page.facebookUrl && <a href={page.facebookUrl} target="_blank" rel="noopener noreferrer" className="btn-outline mt-6 text-brand">Facebook ↗</a>}
          </div>
          <div className="space-y-6">
            {page.image && <SanityImg image={page.image} width={900} className="w-full rounded-2xl" priority />}
            <PeopleGrid people={page.contacts} />
          </div>
        </section>
        {Boolean(page.documents?.length) && <section className="container-x py-6"><div className="max-w-3xl"><Documents items={page.documents} heading="Dokumenti" /></div></section>}
        <Sections sections={page.sections} page={pageNo} />
      </>
    )
  }

  return (
    <>
      {!firstIsHero && (
        <section className="container-x pt-12">
          <h1 className="font-serif text-4xl text-brand-dark md:text-5xl">{page.title}</h1>
        </section>
      )}
      <Sections sections={page.sections} page={pageNo} />
    </>
  )
}
