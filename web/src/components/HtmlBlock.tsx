// Renders a hand-coded page carried over from Drupal. HTML and CSS come from trusted Studio editors only.
// Old file URLs are swapped for their uploaded Sanity copies; until the import has run they still point to the old site.
import {LegacyScript} from './LegacyScript'

type Props = {html?: string; css?: string; js?: string; scope?: string; assets?: {originalUrl?: string; url?: string}[]}

export function HtmlBlock({html = '', css = '', js, scope = '', assets = []}: Props) {
  let h = html
  let c = css
  for (const a of assets) {
    if (!a.originalUrl || !a.url) continue
    h = h.split(a.originalUrl).join(a.url)
    c = c.split(a.originalUrl).join(a.url)
  }
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: c}} />
      <div className={`legacy-html ${scope}`} dangerouslySetInnerHTML={{__html: h}} />
      {js && <LegacyScript code={js} />}
    </>
  )
}
