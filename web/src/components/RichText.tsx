import {PortableText, type PortableTextComponents} from 'next-sanity'
import {SanityImg} from './SanityImg'
import {SmartLink} from './SmartLink'
import type {RichText as RT} from './types'

function embedUrl(url: string) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/)
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  if (url.includes('facebook.com')) return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}`
  return null
}

const components: PortableTextComponents = {
  types: {
    image: ({value}) => (
      <figure className="my-6">
        <SanityImg image={value} width={1000} className="h-auto w-full rounded-xl" sizes="(min-width: 768px) 720px, 100vw" />
        {value.caption && <figcaption className="mt-2 text-sm text-ink/60">{value.caption}</figcaption>}
      </figure>
    ),
    videoFile: ({value}) => (value.url ? <video src={value.url} controls preload="metadata" className="my-6 w-full rounded-xl" /> : null),
    embed: ({value}) => {
      const src = embedUrl(value.url)
      return src ? (
        <div className="my-6 aspect-video overflow-hidden rounded-xl">
          <iframe src={src} className="h-full w-full" allowFullScreen loading="lazy" title="Video" />
        </div>
      ) : (
        <p>
          <a href={value.url} target="_blank" rel="noopener noreferrer">{value.url}</a>
        </p>
      )
    },
  },
  marks: {
    link: ({value, children}) => <SmartLink href={value?.href || '#'}>{children}</SmartLink>,
    fileLink: ({value, children}) => <a href={value?.href} target="_blank" rel="noopener noreferrer">{children}</a>,
    internalLink: ({value, children}) => <SmartLink href={value?.href || '#'}>{children}</SmartLink>,
  },
}

export function RichText({value}: {value?: RT}) {
  if (!value?.length) return null
  return (
    <div className="prose-patnis">
      <PortableText value={value} components={components} />
    </div>
  )
}
