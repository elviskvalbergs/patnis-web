import type {PortableTextBlock} from 'next-sanity'

export type ResolvedLink = {_key?: string; label?: string; href?: string; internalPath?: string; fileUrl?: string}
export type Download = {_key: string; title: string; url?: string; fileUrl?: string; size?: number; ext?: string}
export type SanityImage = {asset?: {_ref: string}; alt?: string; hotspot?: unknown; crop?: unknown}
export type Person = {_id: string; name: string; role?: string; email?: string; phone?: string; address?: string; photo?: SanityImage}
export type Section = {_key: string; _type: string; heading?: string; [key: string]: unknown}
export type RichText = PortableTextBlock[]

export const linkHref = (l?: ResolvedLink) => l?.internalPath || l?.fileUrl || l?.href || '#'
export const isExternal = (href: string) => /^https?:\/\//.test(href) && !/^https?:\/\/(www\.)?patnis\.lv/.test(href)
