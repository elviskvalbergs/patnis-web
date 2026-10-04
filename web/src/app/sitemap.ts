import type {MetadataRoute} from 'next'
import {sanityFetch} from '@/sanity/client'
import {pathsQuery} from '@/sanity/queries'

const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://patnis.lv'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = await sanityFetch<{pages: {path: string; _updatedAt: string}[]; articles: {slug: string; _updatedAt: string}[]}>(pathsQuery)
  return [
    {url: base},
    ...(paths?.pages || []).filter((p) => p.path !== 'sakums').map((p) => ({url: `${base}/${p.path}`, lastModified: p._updatedAt})),
    ...(paths?.articles || []).map((a) => ({url: `${base}/raksts/${a.slug}`, lastModified: a._updatedAt})),
  ]
}
