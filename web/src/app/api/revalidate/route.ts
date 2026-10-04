import {revalidateTag} from 'next/cache'
import {type NextRequest, NextResponse} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

// Sanity webhook target: any publish clears the shared "sanity" cache tag.
// The site is small, so one tag for everything keeps cross-references (menus, lists) correct.
export async function POST(req: NextRequest) {
  const {isValidSignature, body} = await parseBody<{_type?: string}>(req, process.env.SANITY_REVALIDATE_SECRET, true)
  if (!isValidSignature) return new NextResponse('Invalid signature', {status: 401})
  revalidateTag('sanity', {expire: 0})
  return NextResponse.json({revalidated: true, type: body?._type, now: Date.now()})
}
