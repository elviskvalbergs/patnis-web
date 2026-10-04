import {createClient, type QueryParams} from 'next-sanity'
import {apiVersion, dataset, isConfigured, projectId} from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  // Only for local previews against scripts/mock-sanity.ts; unset in production.
  ...(process.env.SANITY_API_HOST ? {apiHost: process.env.SANITY_API_HOST, useProjectHostname: false} : {}),
})

/**
 * Every query is cached by Next.js and tagged "sanity". The /api/revalidate webhook clears
 * that tag on publish, so visitors never hit the Sanity API directly (keeps us on the free plan).
 */
export async function sanityFetch<T>(query: string, params: QueryParams = {}): Promise<T | null> {
  if (!isConfigured) return null
  return client.fetch<T>(query, params, {cache: 'force-cache', next: {tags: ['sanity']}})
}
