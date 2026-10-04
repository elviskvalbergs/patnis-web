/**
 * Serves ../import/patnis.ndjson as a fake Sanity query API so the site can be previewed
 * before a real project exists. Assets are not uploaded, so images render as gaps.
 *
 *   npx tsx scripts/mock-sanity.ts            # http://localhost:3333
 *   SANITY_API_HOST=http://localhost:3333 NEXT_PUBLIC_SANITY_PROJECT_ID=mock npm run dev
 */
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import {evaluate, parse} from 'groq-js'

const docs = fs.readFileSync(path.resolve(__dirname, '../../import/patnis.ndjson'), 'utf8').trim().split('\n').map((l) => JSON.parse(l))

http
  .createServer(async (req, res) => {
    const url = new URL(req.url || '/', 'http://localhost')
    const query = url.searchParams.get('query')
    if (!query) return res.writeHead(404).end()
    const params: Record<string, unknown> = {}
    for (const [k, v] of url.searchParams) if (k.startsWith('$')) params[k.slice(1)] = JSON.parse(v)
    try {
      const result = await (await evaluate(parse(query), {dataset: docs, params})).get()
      res.writeHead(200, {'content-type': 'application/json'}).end(JSON.stringify({result, ms: 1}))
    } catch (e) {
      res.writeHead(400, {'content-type': 'application/json'}).end(JSON.stringify({error: {description: String(e)}}))
    }
  })
  .listen(3333, () => console.log('mock sanity on http://localhost:3333'))
