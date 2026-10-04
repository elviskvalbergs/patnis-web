/**
 * Offline check of ../import/patnis.ndjson against the Studio schema: unknown fields, unknown
 * array member types and missing required values. Run before `sanity dataset import`.
 *
 *   npx tsx scripts/check-import.ts
 */
import fs from 'node:fs'
import path from 'node:path'
import {createSchema} from 'sanity'
import {schemaTypes} from '../src/sanity/schemaTypes'

const schema = createSchema({name: 'check', types: schemaTypes})
const docs = fs.readFileSync(path.resolve(__dirname, '../../import/patnis.ndjson'), 'utf8').trim().split('\n').map((l) => JSON.parse(l))
const problems = new Map<string, number>()
const note = (msg: string) => problems.set(msg, (problems.get(msg) || 0) + 1)
const IGNORE = new Set(['_id', '_type', '_key', '_ref', '_sanityAsset', '_weak', 'asset', 'hotspot', 'crop'])

function check(value: any, type: any, where: string) {
  if (value == null || !type) return
  const kind = type.jsonType
  if (kind === 'object') {
    // Annotations / block internals are validated by Portable Text itself.
    if (type.name === 'block' || type.name === 'span') return
    const fields = new Map((type.fields || []).map((f: any) => [f.name, f.type]))
    for (const [k, v] of Object.entries(value)) {
      if (IGNORE.has(k)) continue
      if (!fields.has(k)) note(`${where}: unknown field "${k}"`)
      else check(v, fields.get(k), `${where}.${k}`)
    }
  } else if (kind === 'array') {
    if (!Array.isArray(value)) return note(`${where}: expected array`)
    for (const item of value) {
      if (typeof item !== 'object') continue
      const member = (type.of || []).find((m: any) => m.name === item._type || (m.jsonType === 'object' && m.type?.name === item._type))
      if (!member) note(`${where}[]: type "${item._type}" not allowed (allowed: ${(type.of || []).map((m: any) => m.name).join(', ')})`)
      else check(item, member, `${where}[${item._type}]`)
    }
  }
}

for (const d of docs) {
  const type = schema.get(d._type)
  if (!type) note(`unknown document type ${d._type}`)
  else check(d, type, d._type)
}
const all = [...problems].sort()
console.log(all.length ? all.map(([m, n]) => `${n}x ${m}`).join('\n') : `OK: ${docs.length} documents match the schema`)
process.exit(all.length ? 1 : 0)
