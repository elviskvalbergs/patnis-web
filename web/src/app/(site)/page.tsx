import type {Metadata} from 'next'
import {Sections} from '@/components/Sections'
import type {Section} from '@/components/types'
import {sanityFetch} from '@/sanity/client'
import {homeQuery} from '@/sanity/queries'

type Home = {title: string; intro?: string; seo?: {title?: string; description?: string}; sections?: Section[]}

export async function generateMetadata(): Promise<Metadata> {
  const home = await sanityFetch<Home>(homeQuery)
  return {description: home?.seo?.description || home?.intro}
}

export default async function HomePage() {
  const home = await sanityFetch<Home>(homeQuery)
  return <Sections sections={home?.sections} />
}
