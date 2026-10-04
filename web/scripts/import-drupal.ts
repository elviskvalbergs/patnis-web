/**
 * Converts the crawled patnis.lv Drupal site (../crawl) into a Sanity NDJSON import file.
 *
 *   npx tsx scripts/import-drupal.ts
 *
 * Output (../import):
 *   patnis.ndjson   - documents for `sanity dataset import`
 *   redirects.json  - old Drupal path -> new path
 *   review.md       - pages that need a human look after import
 *
 * Assets are referenced as `_sanityAsset: "image@https://patnis.lv/..."`, so the import
 * downloads them from the live Drupal site. Run the import before the old site goes down.
 */
import fs from 'node:fs'
import path from 'node:path'
import {JSDOM} from 'jsdom'
import {Schema} from '@sanity/schema'
import {htmlToBlocks} from '@portabletext/block-tools'
import postcss from 'postcss'
import prefixer from 'postcss-prefix-selector'

const ROOT = path.resolve(__dirname, '../..')
const CRAWL = path.join(ROOT, 'crawl')
const OUT = path.join(ROOT, 'import')
const ORIGIN = 'https://patnis.lv'
const HOSTS = new Set(['patnis.lv', 'www.patnis.lv'])
const FILE_RE = /\.(pdf|docx?|xlsx?|pptx?|odt|zip)$/i

type Doc = Record<string, any> & {_id: string; _type: string}
type CrawlPage = {path: string; status: number; file?: string}

const index: {pages: CrawlPage[]} = JSON.parse(fs.readFileSync(path.join(CRAWL, 'index.json'), 'utf8'))
const htmlByPath = new Map(index.pages.filter((p) => p.file).map((p) => [p.path, fs.readFileSync(path.join(CRAWL, 'raw', p.file!), 'utf8')]))

const docs: Doc[] = []
const redirects: {source: string; destination: string; permanent: true}[] = []
const review: string[] = []
let keySeq = 0
const key = () => `k${(keySeq++).toString(36)}`

// ---------- Portable Text schema (mirrors src/sanity/schemaTypes/objects/richText.ts) ----------
const blockSchema = Schema.compile({
  name: 'import',
  types: [
    {
      name: 'doc',
      type: 'object',
      fields: [
        {
          name: 'body',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: ['normal', 'h2', 'h3', 'h4', 'blockquote'].map((value) => ({title: value, value})),
              lists: [{title: 'Bullet', value: 'bullet'}, {title: 'Number', value: 'number'}],
              marks: {
                decorators: ['strong', 'em', 'underline'].map((value) => ({title: value, value})),
                annotations: [{name: 'link', type: 'object', fields: [{name: 'href', type: 'string'}, {name: 'blank', type: 'boolean'}]}],
              },
            },
            // Plain objects here; @sanity/schema has no built-in image/file types without the studio.
            {name: 'pteImage', type: 'object', fields: [{name: 'alt', type: 'string'}]},
            {name: 'pteVideo', type: 'object', fields: [{name: 'src', type: 'string'}]},
            {name: 'embed', type: 'object', fields: [{name: 'url', type: 'string'}]},
          ],
        },
      ],
    },
  ],
})
const bodyType = blockSchema.get('doc').fields.find((f: any) => f.name === 'body').type

// ---------- URL helpers ----------
const abs = (href: string) => new URL(href, ORIGIN + '/')

function isLocal(u: URL) {
  return HOSTS.has(u.hostname)
}

/** Drupal image-style URL -> original upload, percent-encoded once. */
function originalFile(href: string) {
  const u = abs(href)
  const p = decodeURIComponent(u.pathname).replace(/\/styles\/[^/]+\/public\//, '/')
  return ORIGIN + encodeURI(p)
}

const asset = (kind: 'image' | 'file', href: string) => ({_type: kind, _sanityAsset: `${kind}@${originalFile(href)}`})

const LV: Record<string, string> = {ā: 'a', č: 'c', ē: 'e', ģ: 'g', ī: 'i', ķ: 'k', ļ: 'l', ņ: 'n', š: 's', ū: 'u', ž: 'z'}
const slugify = (s: string) =>
  s.toLowerCase().replace(/[āčēģīķļņšūž]/g, (c) => LV[c]).replace(/[^a-z0-9/]+/g, '-').replace(/-+/g, '-').replace(/(^-|-$)|(-(?=\/))|((?<=\/)-)/g, '')
const idFor = (type: string, slug: string) => `${type}-${slug.replace(/\//g, '--') || 'home'}`

function decodeCfEmail(hex: string) {
  const k = parseInt(hex.slice(0, 2), 16)
  let out = ''
  for (let i = 2; i < hex.length; i += 2) out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ k)
  return out
}

// ---------- DOM helpers ----------
const dom = (html: string) => new JSDOM(html).window.document
const text = (el: Element | null | undefined) => (el?.textContent || '').replace(/\s+/g, ' ').trim()

function nodeOf(doc: Document) {
  const main = doc.querySelector('#block-bootstrap-patnis-content')
  // Only the full-view node is the page itself; listing pages contain teaser nodes of other content.
  const node = main?.querySelector('[class*="node--type-"].node--view-mode-full') || null
  const type = node ? [...node.classList].find((c) => c.startsWith('node--type-'))?.slice(11) : undefined
  return {main, node, type}
}

// Listing pages have no <h1> and share the view's <title>, so fall back to how other pages link to them.
const linkLabels = new Map<string, Map<string, number>>()
for (const html of htmlByPath.values()) {
  for (const a of dom(html).querySelectorAll('a[href]')) {
    let u: URL
    try {
      u = new URL(a.getAttribute('href')!, ORIGIN + '/')
    } catch {
      continue
    }
    if (!HOSTS.has(u.hostname)) continue
    const label = (a.textContent || '').replace(/\s+/g, ' ').trim()
    if (label.length < 2 || label.length > 60 || /lasīt vairāk|read more|page|›|‹|^https?:/i.test(label)) continue
    const p = decodeURIComponent(u.pathname).replace(/\/$/, '') || '/'
    const m = linkLabels.get(p) || new Map<string, number>()
    m.set(label, (m.get(label) || 0) + 1)
    linkLabels.set(p, m)
  }
}
const bestLabel = (p: string) => [...(linkLabels.get(p)?.entries() || [])].sort((a, b) => b[1] - a[1])[0]?.[0]

// <title> holds the Drupal node title; views (article listings) all reuse one view title instead.
const TITLE_OVERRIDES: Record<string, string> = {'/': 'Sākums', '/prese': 'Publikācijas medijos'}

function pageTitle(doc: Document, p?: string, isListing = false) {
  return rawTitle(doc, p, isListing).replace(/\s+v\.?\s*\d+\.?$/i, '')
}

function rawTitle(doc: Document, p?: string, isListing = false) {
  if (p && TITLE_OVERRIDES[p]) return TITLE_OVERRIDES[p]
  const titleTag = (doc.title || '').replace(/\s*\|\s*Patnis\s*$/, '').trim()
  if (isListing && p) return bestLabel(p) || titleTag
  return titleTag || text(doc.querySelector('h1')) || (p && bestLabel(p)) || ''
}

/** Fix Cloudflare-obfuscated emails, drop decoration, normalise image/file URLs in place. */
function clean(root: Element) {
  root.querySelectorAll('script, style, noscript, svg, button, form, [aria-hidden="true"]').forEach((e) => e.remove())
  const walker = root.ownerDocument.createTreeWalker(root, 128 /* comments */)
  const comments: Node[] = []
  while (walker.nextNode()) comments.push(walker.currentNode)
  comments.forEach((c) => c.parentNode?.removeChild(c))
  root.querySelectorAll('img[src*="emoji.php"]').forEach((img) => img.replaceWith(root.ownerDocument.createTextNode(img.getAttribute('alt') || '')))
  root.querySelectorAll('[data-cfemail]').forEach((e) => (e.textContent = decodeCfEmail(e.getAttribute('data-cfemail')!)))
  root.querySelectorAll('a[href*="/cdn-cgi/l/email-protection#"]').forEach((a) => {
    const email = decodeCfEmail(a.getAttribute('href')!.split('#')[1])
    a.setAttribute('href', 'mailto:' + email)
    if (!text(a) || text(a).includes('protected')) a.textContent = email
  })
}

/** Move every <img>/<video>/<iframe> out of its paragraph so it becomes a block of its own. */
function hoistMedia(root: Element) {
  root.querySelectorAll('img, video, iframe').forEach((m) => {
    let top: Element = m
    while (top.parentElement && top.parentElement !== root && !['DIV', 'SECTION', 'ARTICLE', 'FIGURE'].includes(top.parentElement.tagName)) top = top.parentElement
    if (top !== m) top.after(m)
  })
}

// ---------- HTML -> Portable Text ----------
function toBlocks(html: string, warnings: string[]) {
  const blocks: any[] = htmlToBlocks(html, bodyType, {
    parseHtml: (h) => dom(h),
    keyGenerator: key,
    rules: [
      {
        deserialize(el: any, _next: any, block: any) {
          const tag = el.tagName?.toLowerCase()
          if (tag === 'img') {
            const src = el.getAttribute('data-src') || el.getAttribute('src')
            if (!src || src.startsWith('data:')) return undefined
            const u = abs(src)
            if (!isLocal(u)) {
              warnings.push(`external image ${src}`)
              return undefined
            }
            return block({_type: 'pteImage', alt: el.getAttribute('alt') || undefined, src})
          }
          if (tag === 'video') {
            const src = el.getAttribute('src') || el.querySelector('source')?.getAttribute('src')
            return src ? block({_type: 'pteVideo', src}) : undefined
          }
          if (tag === 'iframe') {
            const src = el.getAttribute('src')
            return src ? block({_type: 'embed', url: abs(src).toString()}) : undefined
          }
          return undefined
        },
      },
    ],
  })
  // Rewrite link annotations: Drupal files -> fileLink with an uploaded asset, own pages -> relative paths.
  for (const b of blocks) {
    if (b._type === 'pteImage') Object.assign(b, asset('image', b.src), {src: undefined})
    if (b._type === 'pteVideo') Object.assign(b, asset('file', b.src), {_type: 'videoFile', src: undefined})
    for (const m of b.markDefs || []) {
      if (m._type !== 'link' || !m.href) continue
      let u: URL
      try {
        u = abs(m.href)
      } catch {
        continue
      }
      if (!isLocal(u) || u.protocol === 'mailto:' || u.protocol === 'tel:') continue
      const p = decodeURIComponent(u.pathname)
      if (p.startsWith('/sites/default/files/')) {
        m._type = 'fileLink'
        m.file = asset('file', u.toString())
        delete m.href
      } else {
        m.href = p + (u.search || '')
      }
    }
  }
  // <br> runs from the WYSIWYG editor become newline-only text; trim them at block edges.
  for (const b of blocks) {
    if (b._type !== 'block') continue
    for (const c of b.children || []) if (typeof c.text === 'string') c.text = c.text.replace(/\n{3,}/g, '\n\n')
    const first = b.children?.[0]
    const last = b.children?.[b.children.length - 1]
    if (first?.text) first.text = first.text.replace(/^\s+/, '')
    if (last?.text) last.text = last.text.replace(/\s+$/, '')
  }
  return blocks.filter((b) => !(b._type === 'block' && !b.children?.some((c: any) => c.text?.trim())))
}

// ---------- Section extraction for bespoke landing pages ----------
function extractDocuments(root: Element) {
  const items: any[] = []
  root.querySelectorAll('a[href]').forEach((a) => {
    let u: URL
    try {
      u = abs(a.getAttribute('href')!)
    } catch {
      return
    }
    if (!isLocal(u) || !FILE_RE.test(u.pathname)) return
    const container = a.closest('li, p') || a
    // Only lift links that stand alone; links inside running text stay as fileLink annotations.
    if (container !== a && text(container).length > text(a).length + 3) return
    const title = text(a) || decodeURIComponent(u.pathname.split('/').pop()!).replace(/\.[^.]+$/, '').replace(/[_%20]+/g, ' ')
    items.push({_key: key(), _type: 'downloadItem', title, file: asset('file', u.toString())})
    container.remove()
  })
  return items
}

function extractCards(root: Element) {
  const sections: any[] = []
  // Outermost card-like element that has a heading (inner "card-body" divs also match the selector).
  const candidates = [...root.querySelectorAll('article, [class*="card"]')].filter((el) => el.querySelector('h2, h3, h4'))
  const cards = candidates.filter((el) => !candidates.some((o) => o !== el && o.contains(el)))
  // Group cards by the nearest ancestor that holds at least two of them (cards often sit in their own wrapper).
  const groups = new Map<Element, Element[]>()
  for (const c of cards) {
    let parent = c.parentElement!
    while (parent !== root && cards.filter((x) => parent.contains(x)).length < 2) parent = parent.parentElement!
    groups.set(parent, [...(groups.get(parent) || []), c])
  }
  for (const [parent, group] of groups) {
    if (group.length < 2) continue
    const section = parent.closest('section') || parent.parentElement
    const heading = text(section?.querySelector('h2'))
    sections.push({
      _key: key(),
      _type: 'cardGrid',
      heading: heading || undefined,
      cards: group.map((c) => {
        const img = c.querySelector('img')
        const a = c.querySelector('a[href]')
        const h = c.querySelector('h2, h3, h4')
        const p = [...c.querySelectorAll('p')].map(text).filter(Boolean)
        const eyebrow = text(c.querySelector('[class*="tag"], [class*="badge"], [class*="eyebrow"], [class*="label"]')) || undefined
        const href = a?.getAttribute('href') || ''
        const u = href ? abs(href) : null
        return {
          _key: key(),
          _type: 'card',
          title: text(h),
          eyebrow,
          text: p.join('\n') || undefined,
          image: img && isLocal(abs(img.getAttribute('src')!)) ? asset('image', img.getAttribute('src')!) : undefined,
          link: u ? {_type: 'link', label: text(a) || 'Lasīt vairāk', href: isLocal(u) ? decodeURIComponent(u.pathname) : u.toString()} : undefined,
        }
      }),
    })
    group.forEach((c) => c.remove())
    if (heading) section?.querySelector('h2')?.remove()
  }
  return sections
}

/** The node's own body field (layout builder pages also contain bodies of embedded teasers). */
function ownBody(node: Element | null) {
  if (!node) return null
  const own = [...node.querySelectorAll('.field--name-body')].filter((b) => b.closest('[class*="node--type-"]') === node)
  return own.sort((a, b) => text(b).length - text(a).length)[0] || null
}

function fieldDocuments(node: Element) {
  return [...node.querySelectorAll('.field--name-field-media-document a[href], .field--name-field-asset-file a[href]')].map((a) => ({
    _key: key(),
    _type: 'downloadItem',
    title: text(a).replace(/\.[a-z]{3,4}$/i, ''),
    file: asset('file', a.getAttribute('href')!),
  }))
}

function fieldVideos(node: Element) {
  return [...node.querySelectorAll('.field--name-field-media-video-file video, .field--name-field-media-video-file source, .field--name-field-media-video-file a[href]')]
    .map((e) => e.getAttribute('src') || e.getAttribute('href'))
    .filter((s): s is string => Boolean(s))
}

// ---------- Hand-coded pages carried over 1:1 ----------
// Pages whose body ships its own <style> block are kept as HTML + scoped CSS (section `htmlBlock`),
// so the move looks identical. Converting them to structured sections is a later, optional step.
const ASSET_ATTRS = ['src', 'data-src', 'poster', 'href']

function legacyBlock(rawBody: Element, slug: string) {
  const doc = rawBody.ownerDocument
  // Inline scripts drive carousels, dropdowns and scroll animations; keep them (Cloudflare's email decoder is not needed).
  const js = [...rawBody.querySelectorAll('script:not([src])')].map((sc) => sc.textContent || '').filter((t) => t.trim()).join('\n;\n')
  rawBody.querySelectorAll('script, noscript').forEach((e) => e.remove())
  const walker = doc.createTreeWalker(rawBody, 128)
  const comments: Node[] = []
  while (walker.nextNode()) comments.push(walker.currentNode)
  comments.forEach((c) => c.parentNode?.removeChild(c))
  rawBody.querySelectorAll('[data-cfemail]').forEach((e) => (e.textContent = decodeCfEmail(e.getAttribute('data-cfemail')!)))
  rawBody.querySelectorAll('a[href*="/cdn-cgi/l/email-protection#"]').forEach((a) => a.setAttribute('href', 'mailto:' + decodeCfEmail(a.getAttribute('href')!.split('#')[1])))

  // Old-style <!-- --> wrappers inside <style> are not CSS.
  const css = [...rawBody.querySelectorAll('style')].map((st) => (st.textContent || '').replace(/<!--|-->/g, '')).join('\n')
  rawBody.querySelectorAll('style').forEach((st) => st.remove())

  // Every reference to an uploaded Drupal file becomes one canonical absolute URL, recorded as an asset.
  const assets = new Map<string, string>() // canonical url -> asset kind
  const canon = (raw: string) => {
    let u: URL
    try {
      u = abs(raw.trim())
    } catch {
      return raw
    }
    if (!isLocal(u) || !decodeURIComponent(u.pathname).startsWith('/sites/default/files/')) return raw
    const c = originalFile(u.toString())
    assets.set(c, 'file')
    return c
  }
  rawBody.querySelectorAll('*').forEach((el) => {
    for (const attr of ASSET_ATTRS) {
      const v = el.getAttribute(attr)
      if (v && v.includes('/sites/default/files/')) el.setAttribute(attr, canon(v))
    }
    const srcset = el.getAttribute('srcset')
    if (srcset) el.setAttribute('srcset', srcset.split(',').map((part) => part.trim().replace(/^\S+/, (u) => canon(u))).join(', '))
    const style = el.getAttribute('style')
    if (style?.includes('url(')) el.setAttribute('style', style.replace(/url\((['"]?)([^'")]+)\1\)/g, (_m, q, u) => `url(${q}${canon(u)}${q})`))
  })
  const scope = 'lg-' + slug.replace(/[^a-z0-9]+/g, '-')
  let scopedCss = ''
  try {
    scopedCss = postcss([
    prefixer({
      prefix: '.' + scope,
      transform: (prefix: string, selector: string, prefixed: string) =>
        /^(html|body|:root)$/.test(selector) ? prefix : selector.startsWith('html ') || selector.startsWith('body ') ? prefix + selector.replace(/^(html|body)/, '') : prefixed,
    }),
    // Pass a parsed root: the plugin reads root.source in prepare(), which a raw string doesn't have yet.
  ]).process(postcss.parse(css.replace(/url\((['"]?)([^'")]+)\1\)/g, (_m, q, u) => `url(${q}${canon(u)}${q})`)), {from: undefined}).css
  } catch (e) {
    review.push(`- page \`/${slug}\`: CSS could not be scoped (${String(e).slice(0, 80)}); stored unscoped, check for clashes.`)
    scopedCss = css
  }

  return {
    _key: key(),
    _type: 'htmlBlock',
    label: 'Vecās lapas saturs',
    html: rawBody.innerHTML.trim(),
    css: scopedCss,
    js: js || undefined,
    scope,
    assets: [...assets.keys()].map((u) => ({_key: key(), _type: 'htmlAsset', originalUrl: u, file: {_type: 'file', _sanityAsset: `file@${u}`}})),
  }
}

// ---------- Path mapping ----------
const pathMap = new Map<string, string>() // old Drupal path -> new path

function newPath(oldPath: string) {
  if (oldPath === '/') return '/'
  const slug = slugify(oldPath.replace(/^\//, ''))
  const np = '/' + slug
  pathMap.set(oldPath, np)
  if (np !== oldPath) redirects.push({source: oldPath, destination: np, permanent: true})
  return np
}

function recordNodeId(html: string, np: string) {
  const m = html.match(/data-history-node-id="(\d+)"/) || html.match(/"currentPath":"node\\\/(\d+)"/)
  if (m) redirects.push({source: `/node/${m[1]}`, destination: np, permanent: true})
}

// ---------- Classify crawled pages ----------
type Kind = 'article' | 'listing' | 'page' | 'branch' | 'person' | 'gallery' | 'form' | 'skip' | 'static'
const kinds = new Map<string, Kind>()
for (const [p, html] of htmlByPath) {
  if (p.includes('?page=')) continue
  const d = dom(html)
  const {main, type} = nodeOf(d)
  let kind: Kind = 'page'
  if (d.querySelector('meta[name="app-name"][content="export_website"]')) kind = 'static'
  else if (p.startsWith('/raksts/')) kind = 'article'
  else if (p === '/skola/galerija') kind = 'gallery'
  else if (p.startsWith('/taxonomy/term/') || p.startsWith('/darbinieks/')) kind = 'person'
  else if (/-(old|legacy)$/.test(p)) kind = 'skip'
  else if (type === 'webform' || p.startsWith('/form/')) kind = 'form'
  else if (type === 'school') kind = 'branch'
  else if (main?.querySelector('.views-element-container a[href*="/raksts/"]')) kind = 'listing'
  kinds.set(p, kind)
}

// ---------- Categories (one per article listing page) ----------
const categoryByListing = new Map<string, Doc>()
const articleMeta = new Map<string, {date?: string; categories: Set<string>}>()
for (const [p, kind] of kinds) {
  if (kind !== 'listing') continue
  const d = dom(htmlByPath.get(p)!)
  const slug = slugify(p.split('/').pop()!)
  const cat: Doc = {_id: `category-${slug}`, _type: 'category', title: pageTitle(d, p, true), slug: {_type: 'slug', current: slug}}
  categoryByListing.set(p, cat)
  docs.push(cat)
  // Include paginated variants of the listing.
  for (const [pp, html] of htmlByPath) {
    if (pp !== p && !pp.startsWith(p + '?page=')) continue
    const ld = dom(html)
    ld.querySelectorAll('.views-row').forEach((row) => {
      const a = row.querySelector('a[href*="/raksts/"]')
      if (!a) return
      const ap = decodeURIComponent(abs(a.getAttribute('href')!).pathname)
      const meta = articleMeta.get(ap) || {categories: new Set<string>()}
      meta.categories.add(cat._id)
      const t = text(row.querySelector('time'))
      const dm = t.match(/(\d{2})-(\d{2})-(\d{4})/)
      if (dm && !meta.date) meta.date = `${dm[3]}-${dm[2]}-${dm[1]}`
      articleMeta.set(ap, meta)
    })
  }
}
// RSS gives exact dates for the newest items.
const rssPath = path.join(CRAWL, 'rss.xml')
if (fs.existsSync(rssPath)) {
  const rss = dom(fs.readFileSync(rssPath, 'utf8'))
  rss.querySelectorAll('item').forEach((it) => {
    const link = it.querySelector('link')?.textContent || it.innerHTML.match(/<link>([^<]+)/)?.[1]
    const date = it.querySelector('pubDate')?.textContent
    if (!link || !date) return
    const ap = decodeURIComponent(new URL(link).pathname)
    const meta = articleMeta.get(ap) || {categories: new Set<string>()}
    meta.date ||= new Date(date).toISOString().slice(0, 10)
    articleMeta.set(ap, meta)
  })
}

// ---------- People (contacts on branch pages + /darbinieks pages) ----------
const people = new Map<string, Doc>()
// Field values carry Material icon names or Drupal labels in front of them.
const stripLabel = (v: string) => v.replace(/^(mail_outline|phone|location_on|place|Adrese|Tālrunis|Epasts|E-pasts)\s*/i, '').replace(/^(mail_outline|phone|location_on)\s*/i, '').trim()
function personFrom(el: Element, fallbackName?: string) {
  const name = text(el.querySelector('.field--name-name')) || fallbackName || ''
  if (!name) return null
  const id = `person-${slugify(name)}`
  if (!people.has(id)) {
    const photo = el.querySelector('.field--name-field-kontakts-attels img')?.getAttribute('src')
    const emailA = el.querySelector('.field--name-field-kontakts-epasts a')
    people.set(id, {
      _id: id,
      _type: 'person',
      name,
      role: text(el.querySelector('.field--name-field-kontakts-amats')) || undefined,
      email: emailA ? [(emailA.getAttribute('href') || '').replace(/^mailto:/, ''), text(emailA)].map(stripLabel).find((v) => v.includes('@')) : undefined,
      phone: stripLabel(text(el.querySelector('.field--name-field-talrunis'))) || undefined,
      address: stripLabel(text(el.querySelector('.field--name-field-kontakts-adrese'))) || undefined,
      photo: photo && !photo.includes('default_images') ? asset('image', photo) : undefined,
    })
  }
  return id
}

// ---------- Build documents ----------
const pages: Doc[] = []
for (const [p, kind] of kinds) {
  const html = htmlByPath.get(p)!
  const d = dom(html)
  const {main, node, type} = nodeOf(d)
  if (main) clean(main)
  const title = pageTitle(d, p, kind === 'listing')
  const warnings: string[] = []

  if (kind === 'static') {
    review.push(`- \`${p}\`: not Drupal (Canva website export in a server folder). Copy the folder into web/public${p}/ or link to the Canva site.`)
    continue
  }

  if (kind === 'skip') {
    review.push(`- \`${p}\`: skipped (legacy duplicate). Point a redirect to its replacement if it was ever public.`)
    continue
  }

  if (kind === 'person') {
    if (main) personFrom(main, title)
    redirects.push({source: p, destination: '/kontakti', permanent: true})
    continue
  }

  if (kind === 'article') {
    const np = '/raksts/' + slugify(p.replace('/raksts/', ''))
    pathMap.set(p, np)
    if (np !== p) redirects.push({source: p, destination: np, permanent: true})
    recordNodeId(html, np)
    const meta = articleMeta.get(p)
    const bodyEl = ownBody(node)
    if (bodyEl) hoistMedia(bodyEl)
    const img = node?.querySelector('.field--name-field-image img, .field--name-field-media-image img')
    const linkA = node?.querySelector('.field--name-field-link a[href]')
    const video = node ? fieldVideos(node)[0] : undefined
    const desc = d.querySelector('meta[name="description"]')?.getAttribute('content') || undefined
    let publishedAt = meta?.date
    if (!publishedAt) {
      // Drupal stores uploads in /files/YYYY-MM/; the earliest folder is a good proxy for the publish month.
      const months = [...(node?.innerHTML || '').matchAll(/\/files\/(?:styles\/[^/]+\/public\/)?(\d{4})-(\d{2})\//g)].map((m) => `${m[1]}-${m[2]}`).sort()
      if (months[0]) {
        publishedAt = `${months[0]}-01`
        warnings.push(`date approximated from upload folder (${months[0]})`)
      } else warnings.push('no publish date found')
    }
    docs.push({
      _id: idFor('article', np.replace('/raksts/', '')),
      _type: 'article',
      title,
      slug: {_type: 'slug', current: np.replace('/raksts/', '')},
      publishedAt,
      categories: [...(meta?.categories || [])].map((ref) => ({_type: 'reference', _ref: ref, _key: key()})),
      mainImage: img ? {...asset('image', img.getAttribute('src')!), alt: img.getAttribute('alt') || undefined} : undefined,
      excerpt: desc,
      body: bodyEl ? toBlocks(bodyEl.innerHTML, warnings) : [],
      externalLink: linkA ? abs(linkA.getAttribute('href')!).toString() : undefined,
      video: video ? asset('file', video) : undefined,
      documents: node ? fieldDocuments(node) : [],
    })
    if (warnings.length) review.push(`- article \`${np}\`: ${[...new Set(warnings)].join('; ')}`)
    continue
  }

  if (kind === 'gallery') {
    const np = newPath(p)
    const galleryRefs: any[] = []
    d.querySelectorAll('.views-row, .views-col').forEach((row) => {
      const gTitle = text(row.querySelector('.views-field-title'))
      if (!gTitle) return
      const date = text(row.querySelector('.views-field-field-datums time')) || undefined
      const id = `gallery-${slugify(gTitle)}-${date || 'x'}`
      if (docs.some((x) => x._id === id)) return
      const images = [...row.querySelectorAll('.views-field-field-gallery-pictures a[href]')].map((a) => ({_key: key(), ...asset('image', a.getAttribute('href')!)}))
      docs.push({_id: id, _type: 'gallery', title: gTitle, date, images})
      galleryRefs.push({_type: 'reference', _ref: id, _key: key()})
    })
    pages.push({_id: idFor('page', np.slice(1)), _type: 'page', title, slug: {_type: 'slug', current: np.slice(1)}, sections: [{_key: key(), _type: 'gallerySection', galleries: []}]})
    continue
  }

  // page, listing, form, branch
  const np = newPath(p)
  recordNodeId(html, np)
  const slug = np === '/' ? 'sakums' : np.slice(1)
  const bodyEl = ownBody(node)
  const sections: any[] = []
  let note: string | undefined

  // clean() above stripped styles/SVGs from `main`; take the untouched body from a fresh parse.
  const rawBody = ownBody(nodeOf(dom(html)).node)
  // Only Drupal "landing-page" nodes are designed pages; other pages with <style> are Word/Facebook pastes.
  if (type === 'landing-page' && rawBody?.querySelector('style')) {
    sections.push(legacyBlock(rawBody, slug))
    note = 'Hand-coded page carried over 1:1 as an HTML block. Edit text in the HTML field, or rebuild with sections later.'
  } else if (bodyEl) {
    hoistMedia(bodyEl)
    const isBespoke = type === 'landing-page' || bodyEl.querySelectorAll('section, [style]').length > 5
    const cardSections = isBespoke ? extractCards(bodyEl) : []
    const documents = extractDocuments(bodyEl)
    const blocks = toBlocks(bodyEl.innerHTML, warnings)
    if (blocks.length) sections.push({_key: key(), _type: 'textSection', body: blocks})
    sections.push(...cardSections)
    if (documents.length) sections.push({_key: key(), _type: 'documentList', heading: 'Dokumenti', documents})
    if (isBespoke)
      note = type === 'landing-page'
        ? 'Landing page without its own CSS: text, images, cards and documents were extracted into sections. Compare with the old page.'
        : 'Text pasted with inline formatting (Word/Facebook) in the old editor. Formatting was cleaned to plain text, headings and lists; check it reads well.'
  }
  if (node && kind !== 'branch') {
    const docsField = fieldDocuments(node)
    if (docsField.length) sections.push({_key: key(), _type: 'documentList', heading: 'Dokumenti', documents: docsField})
    for (const v of fieldVideos(node)) sections.push({_key: key(), _type: 'textSection', body: [{...asset('file', v), _key: key(), _type: 'videoFile'}]})
  }
  if (kind === 'listing') {
    sections.push({_key: key(), _type: 'articleList', category: {_type: 'reference', _ref: categoryByListing.get(p)!._id}, limit: 20, layout: 'list'})
  }
  if (kind === 'form') {
    const formTitle = text(d.querySelector('form.webform-submission-form')?.closest('[class*="node"]')?.querySelector('h1, h2')) || title
    sections.push({
      _key: key(),
      _type: 'cta',
      heading: 'Pieteikšanās',
      text: 'Pieteikumu var aizpildīt klientu portālā.',
      buttons: [{_key: key(), _type: 'link', label: 'Aizpildīt pieteikumu', href: 'https://portal.patnis.lv/'}],
    })
    note = `Was a Drupal webform ("${formTitle}"). The form must be rebuilt in portal.patnis.lv; update the button link when the portal route exists.`
  }

  if (kind === 'branch') {
    const contactEls = [...(node?.querySelectorAll('.field--name-field-school-contacts > .field__item, .field--name-field-school-contacts .field__item') || [])]
    const contacts = [...new Set(contactEls.map((e) => personFrom(e)).filter((x): x is string => Boolean(x)))]
    const fb = node?.querySelector('.field--name-field-facebook-code')?.innerHTML.match(/facebook\.com\/[^"'&\s]+/)
    const img = node?.querySelector('.field--name-field-school-image img')
    const division = p.split('/')[1]
    docs.push({
      _id: idFor('branch', slug),
      _type: 'branch',
      name: title,
      slug: {_type: 'slug', current: slug},
      division: ['pirmsskola', 'skola', 'makslu-skola'].includes(division) ? division : undefined,
      image: img ? asset('image', img.getAttribute('src')!) : undefined,
      body: sections.filter((s) => s._type === 'textSection').flatMap((s) => s.body),
      contacts: contacts.map((ref) => ({_type: 'reference', _ref: ref, _key: key()})),
      documents: node ? fieldDocuments(node) : [],
      facebookUrl: fb ? 'https://www.' + decodeURIComponent(fb[0]) : undefined,
      sections: sections.filter((s) => s._type !== 'textSection'),
      migrationNote: note,
    })
    if (warnings.length) review.push(`- branch \`${np}\`: ${[...new Set(warnings)].join('; ')}`)
    continue
  }

  pages.push({
    _id: idFor('page', slug),
    _type: 'page',
    title,
    slug: {_type: 'slug', current: slug},
    intro: d.querySelector('meta[name="description"]')?.getAttribute('content') || undefined,
    sections,
    migrationNote: note,
  })
  if (note) review.push(`- page \`${np}\`: ${note}`)
  if (warnings.length) review.push(`- page \`${np}\`: ${[...new Set(warnings)].join('; ')}`)
}

// Gallery page lists all galleries (empty reference list = all, newest first).
docs.push(...pages, ...people.values())

// ---------- Site settings from the homepage chrome ----------
{
  const d = dom(htmlByPath.get('/')!)
  const toLink = (a: Element) => {
    const u = abs(a.getAttribute('href')!)
    const local = isLocal(u)
    const p = local ? decodeURIComponent(u.pathname) : ''
    const target = local ? pathMap.get(p) || p : u.toString()
    const pageDoc = local ? docs.find((x) => x._type === 'page' && '/' + x.slug?.current === target) : undefined
    return {
      _key: key(),
      _type: 'link',
      label: text(a),
      ...(pageDoc ? {internal: {_type: 'reference', _ref: pageDoc._id}} : {href: target}),
    }
  }
  docs.push({
    _id: 'siteSettings',
    _type: 'siteSettings',
    title: 'Patnis',
    tagline: 'Izglītība. Idejas. Iespējas.',
    logo: asset('image', '/sites/default/files/patnis_logo_25_160.png'),
    homePage: {_type: 'reference', _ref: 'page-sakums'},
    mainNav: [...d.querySelectorAll('#block-bootstrap-patnis-main-menu a[href]')].map(toLink),
    footerLinks: [...d.querySelectorAll('#block-kajeneinformacija a[href]')].map(toLink),
    social: [...d.querySelectorAll('#block-kajeneriki a[href]')].map((a) => ({
      _key: key(),
      _type: 'socialLink',
      platform: text(a) || a.getAttribute('title') || new URL(a.getAttribute('href')!).hostname,
      url: a.getAttribute('href'),
    })),
    copyright: text(d.querySelector('#block-kajenelegal')),
    portalUrl: 'https://portal.patnis.lv',
  })
}

// ---------- Rewrite internal hrefs to the new paths ----------
function remap(value: any): any {
  if (Array.isArray(value)) return value.map(remap)
  if (value && typeof value === 'object') {
    for (const k of Object.keys(value)) {
      if (k === 'html' && typeof value[k] === 'string') {
        value[k] = value[k].replace(/href="(?:https?:\/\/(?:www\.)?patnis\.lv)?(\/[^"#?]*)([^"]*)"/g, (m: string, p: string, rest: string) => {
          const dp = (() => { try { return decodeURIComponent(p) } catch { return p } })()
          if (dp.startsWith('/sites/default/files/')) return m
          return `href="${pathMap.get(dp.replace(/\/$/, '') || '/') || p}${rest}"`
        })
      } else if (k === 'href' && typeof value[k] === 'string' && value[k].startsWith('/')) {
        const [p, q] = value[k].split('?')
        value[k] = (pathMap.get(p) || p) + (q ? '?' + q : '')
      } else value[k] = remap(value[k])
    }
  }
  return value
}

// Drop undefined keys so the NDJSON stays clean.
const prune = (v: any): any =>
  Array.isArray(v) ? v.map(prune) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).filter(([, x]) => x !== undefined).map(([k, x]) => [k, prune(x)])) : v

// Known dead or legacy paths seen during the crawl.
redirects.push(
  {source: '/pirmsskola/gregora-iela-old', destination: '/pirmsskola/gregora-iela', permanent: true},
  {source: '/pirmsskola/adazos-legacy', destination: '/pirmsskola/adazos', permanent: true},
  {source: '/pieteikties-skolai', destination: '/skola/pieteiksanas', permanent: true},
)
review.push(
  '- `/vakances`: returns 403 on the old site (unpublished), but the homepage card links to it. Create the page or remove the card.',
  '- `/pieteikties-skolai`: 404 on the old site, linked from content. Redirected to /skola/pieteiksanas.',
)

fs.mkdirSync(OUT, {recursive: true})
const finalDocs = docs.map((x) => prune(remap(x)))
fs.writeFileSync(path.join(OUT, 'patnis.ndjson'), finalDocs.map((x) => JSON.stringify(x)).join('\n') + '\n')
const uniq = [...new Map(redirects.map((r) => [r.source, r])).values()].filter((r) => r.source !== r.destination)
fs.writeFileSync(path.join(OUT, 'redirects.json'), JSON.stringify(uniq, null, 2) + '\n')
// Copy inside the Next.js app so Vercel (root directory = web) can read it at build time.
fs.writeFileSync(path.join(__dirname, '../src/data/drupal-redirects.json'), JSON.stringify(uniq, null, 2) + '\n')

const counts = finalDocs.reduce<Record<string, number>>((acc, x) => ((acc[x._type] = (acc[x._type] || 0) + 1), acc), {})
const assetUrls = new Set(JSON.stringify(finalDocs).match(/"_sanityAsset":"[^"]+"/g) || [])
fs.writeFileSync(
  path.join(OUT, 'review.md'),
  `# Import review list\n\nGenerated by \`scripts/import-drupal.ts\`.\n\n## Counts\n\n${Object.entries(counts).map(([t, n]) => `- ${t}: ${n}`).join('\n')}\n- unique assets referenced: ${assetUrls.size}\n- redirects: ${uniq.length}\n\n## Needs a look\n\n${review.sort().join('\n')}\n`,
)
console.log(counts, 'assets', assetUrls.size, 'redirects', uniq.length, 'review items', review.length)
