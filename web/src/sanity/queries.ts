import {defineQuery} from 'next-sanity'

const linkFields = `label, href, "internalPath": select(
  internal->_type == "article" => "/raksts/" + internal->slug.current,
  internal->_id == *[_id == "siteSettings"][0].homePage._ref => "/",
  defined(internal->slug.current) => "/" + internal->slug.current
), "fileUrl": file.asset->url`

const richText = `[]{
  ...,
  _type == "image" => {..., "dimensions": asset->metadata.dimensions},
  _type == "videoFile" => {..., "url": asset->url},
  markDefs[]{
    ...,
    _type == "fileLink" => {"href": file.asset->url},
    _type == "internalLink" => {"href": select(reference->_type == "article" => "/raksts/" + reference->slug.current, "/" + reference->slug.current)}
  }
}`

const download = `{_key, title, url, "fileUrl": file.asset->url, "size": file.asset->size, "ext": file.asset->extension}`

const sections = `sections[]{
  ...,
  _type == "htmlBlock" => {assets[]{originalUrl, "url": file.asset->url}},
  _type == "textSection" => {body${richText}},
  _type == "hero" => {buttons[]{_key, ${linkFields}}},
  _type == "cta" => {buttons[]{_key, ${linkFields}}},
  _type == "cardGrid" => {cards[]{..., link{${linkFields}}}},
  _type == "linkList" => {links[]{_key, ${linkFields}}},
  _type == "documentList" => {documents[]${download}},
  _type == "articleList" => {"categoryId": category._ref},
  _type == "contacts" => {people[]->},
  _type == "pricing" => {note${richText}},
  _type == "faq" => {items[]{..., answer${richText}}},
  _type == "gallerySection" => {"galleries": select(
    count(galleries) > 0 => galleries[]->{_id, title, date, images},
    *[_type == "gallery"] | order(date desc){_id, title, date, images}
  )}
}`

export const settingsQuery = defineQuery(`*[_id == "siteSettings"][0]{
  title, tagline, logo, copyright, social, portalUrl, seo,
  mainNav[]{_key, ${linkFields}},
  footerLinks[]{_key, ${linkFields}}
}`)

export const homeQuery = defineQuery(`*[_id == "siteSettings"][0].homePage->{_id, title, intro, seo, ${sections}}`)

export const pageQuery = defineQuery(`*[_type in ["page", "branch"] && slug.current == $path][0]{
  _type, _id, title, name, intro, summary, seo, address, image, facebookUrl, division,
  body${richText},
  contacts[]->,
  documents[]${download},
  ${sections}
}`)

export const articleQuery = defineQuery(`*[_type == "article" && slug.current == $slug][0]{
  _id, title, publishedAt, excerpt, mainImage, externalLink, seo,
  "videoUrl": video.asset->url,
  categories[]->{title, slug},
  body${richText},
  documents[]${download}
}`)

// Slice bounds are inlined: they are server-computed integers, and not every GROQ engine accepts params there.
export const articleListQuery = (from: number, to: number) => `{
  "items": *[_type == "article" && (!defined($categoryId) || $categoryId in categories[]._ref)] | order(publishedAt desc) [${Math.trunc(from)}...${Math.trunc(to)}]{
    _id, title, publishedAt, excerpt, mainImage, "slug": slug.current
  },
  "total": count(*[_type == "article" && (!defined($categoryId) || $categoryId in categories[]._ref)])
}`

export const branchesQuery = defineQuery(`*[_type == "branch" && (!defined($division) || division == $division)] | order(order asc, name asc){
  _id, name, summary, address, image, "slug": slug.current
}`)

export const pathsQuery = defineQuery(`{
  "pages": *[_type in ["page", "branch"] && defined(slug.current)]{"path": slug.current, _updatedAt},
  "articles": *[_type == "article" && defined(slug.current)]{"slug": slug.current, _updatedAt}
}`)

export const redirectsQuery = defineQuery(`*[_type == "redirect"]{source, destination, permanent}`)
