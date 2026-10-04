import type {Download} from './types'

const fmtSize = (b?: number) => (b ? (b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.round(b / 1e3)} KB`) : '')

// Uploaded file -> download link with type and size; link-only item -> "open" link to the other source.
export function Documents({items, heading}: {items?: Download[]; heading?: string}) {
  if (!items?.length) return null
  return (
    <div>
      {heading && <h2 className="mb-4 font-serif text-2xl text-brand-dark">{heading}</h2>}
      <ul className="divide-y divide-brand/15 rounded-xl border border-brand/15 bg-white">
        {items.map((d) => {
          const href = d.fileUrl ? `${d.fileUrl}?dl=` : d.url
          if (!href) return null
          return (
            <li key={d._key}>
              <a href={href} target={d.fileUrl ? undefined : '_blank'} rel="noopener noreferrer" className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-cream">
                <span className="font-medium text-brand-dark">{d.title}</span>
                <span className="shrink-0 text-sm text-ink/60">
                  {d.fileUrl ? `${(d.ext || '').toUpperCase()} ${fmtSize(d.size)} ↓` : 'Atvērt ↗'}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
