import Image from 'next/image'
import {urlFor} from '@/sanity/image'
import type {SanityImage} from './types'

// Width/height from the asset ref ("image-<id>-<w>x<h>-<ext>") so next/image can reserve space.
export function SanityImg({image, width = 1200, className, sizes, priority}: {image?: SanityImage; width?: number; className?: string; sizes?: string; priority?: boolean}) {
  const ref = image?.asset?._ref
  if (!ref) return null
  const m = ref.match(/-(\d+)x(\d+)-/)
  const [w, h] = m ? [Number(m[1]), Number(m[2])] : [width, Math.round(width * 0.66)]
  const height = Math.round((Math.min(width, w) / w) * h)
  return (
    <Image
      src={urlFor(image).width(Math.min(width, w)).url()}
      width={Math.min(width, w)}
      height={height}
      alt={image.alt || ''}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  )
}
