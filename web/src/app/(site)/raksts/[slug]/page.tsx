import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {Documents} from '@/components/Documents'
import {RichText} from '@/components/RichText'
import {SanityImg} from '@/components/SanityImg'
import type {Download, RichText as RT, SanityImage} from '@/components/types'
import {sanityFetch} from '@/sanity/client'
import {urlFor} from '@/sanity/image'
import {articleQuery, pathsQuery} from '@/sanity/queries'

type Article = {
  title: string
  publishedAt?: string
  excerpt?: string
  mainImage?: SanityImage
  externalLink?: string
  videoUrl?: string
  categories?: {title: string}[]
  body?: RT
  documents?: Download[]
  seo?: {title?: string; description?: string}
}

type Props = {params: Promise<{slug: string}>}

const getArticle = async (slug: string) => sanityFetch<Article>(articleQuery, {slug: decodeURIComponent(slug)})

export async function generateStaticParams() {
  const paths = await sanityFetch<{articles: {slug: string}[]}>(pathsQuery)
  return (paths?.articles || []).map((a) => ({slug: a.slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const a = await getArticle((await params).slug)
  if (!a) return {}
  return {
    title: a.seo?.title || a.title,
    description: a.seo?.description || a.excerpt,
    openGraph: a.mainImage ? {images: [urlFor(a.mainImage).width(1200).height(630).url()]} : undefined,
  }
}

export default async function ArticlePage({params}: Props) {
  const a = await getArticle((await params).slug)
  if (!a) notFound()
  return (
    <article className="container-x max-w-3xl py-12">
      <p className="text-sm text-ink/60">
        {a.publishedAt && new Date(a.publishedAt).toLocaleDateString('lv-LV', {day: 'numeric', month: 'long', year: 'numeric'})}
        {a.categories?.length ? ` · ${a.categories.map((c) => c.title).join(', ')}` : ''}
      </p>
      <h1 className="mt-2 font-serif text-4xl text-brand-dark md:text-5xl">{a.title}</h1>
      {a.mainImage && <SanityImg image={a.mainImage} width={1200} className="mt-8 w-full rounded-2xl" priority sizes="(min-width: 768px) 768px, 100vw" />}
      <div className="mt-8"><RichText value={a.body} /></div>
      {a.videoUrl && <video src={a.videoUrl} controls preload="metadata" className="mt-8 w-full rounded-xl" />}
      {a.externalLink && <a href={a.externalLink} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8">Lasīt avotā ↗</a>}
      {Boolean(a.documents?.length) && <div className="mt-10"><Documents items={a.documents} heading="Pielikumi" /></div>}
    </article>
  )
}
