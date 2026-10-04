import Link from 'next/link'
import {isExternal} from './types'

export function SmartLink({href, className, children}: {href: string; className?: string; children: React.ReactNode}) {
  if (isExternal(href) || href.startsWith('mailto:') || href.startsWith('tel:') || href.includes('cdn.sanity.io')) {
    return (
      <a href={href} className={className} {...(isExternal(href) || href.includes('cdn.sanity.io') ? {target: '_blank', rel: 'noopener noreferrer'} : {})}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}
