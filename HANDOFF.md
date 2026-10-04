# patnis.lv → Sanity + Next.js on Vercel: handoff

Everything up to "create the Sanity project" is done. The steps below need your Sanity and Vercel accounts.

## What's in this folder

| Path | What |
|---|---|
| `docs/INVENTORY.md` | Every crawled URL, what it became, content type mapping, forms list |
| `crawl/` | Crawler (`crawl.py`), URL index, RSS, file sizes, and the raw HTML snapshot (`raw.tgz`, 229 pages) |
| `import/patnis.ndjson` | 227 Sanity documents ready for `sanity dataset import` |
| `import/redirects.json` | 205 redirects (old Drupal paths and `/node/N` → new paths) |
| `import/review.md` | Pages and articles that need a human look after import |
| `web/` | Next.js 16 site + embedded Sanity Studio at `/studio` |
| `web/scripts/import-drupal.ts` | Rebuilds `import/` from `crawl/` (re-run after a fresh crawl) |
| `web/scripts/check-import.ts` | Offline check of the NDJSON against the Studio schema |
| `web/scripts/mock-sanity.ts` | Local fake Sanity API, to preview the site from the NDJSON without an account |

Checked in this session: `npm run lint`, `tsc`, `next build` (with and without Sanity env), `sanity schema validate` (0 errors, 0 warnings), `check-import.ts` (227 docs match the schema), and the pages rendered against the mock API. **Not** checked: a real Sanity import, real asset upload, Vercel deploy.

## Content model (Sanity)

- `siteSettings` (singleton): logo, main menu, footer links, social links, homepage, portal URL
- `page`: title, path (`skola/steam`), and a list of sections: hero, text, cards, links, documents, article list, branch list, contacts, prices, FAQ, call-to-action, galleries
- `article`: title, date, categories, main image, body, source link, video, documents. URL `/raksts/<slug>`
- `category`: STEAM, Mācību darbs, Publikācijas medijos, Blogs, Cambridge English, OECD, Atvērtās durvis
- `branch`: preschool/school location with address, image, contacts, documents. URL is its own path (`pirmsskola/maldugunu-iela`)
- `person`, `gallery`, `redirect`

Documents can be an uploaded file **or** a link to another source (`downloadItem`), the same pattern LGAA needs.

## Your steps

Run everything from `patnis/web`.

### 1. Sanity project (about 5 min)

1. Go to <https://www.sanity.io/manage> and pick your agency organization. Create a project named **Patnis** with a dataset `production` set to **public** (see the public/private notes we discussed: only published content is readable, and nothing personal goes in here).
2. Copy the project ID and write it to the env file:
   ```bash
   cp .env.example .env.local
   # set NEXT_PUBLIC_SANITY_PROJECT_ID=<id>, and SANITY_REVALIDATE_SECRET=<any long random string>
   ```
3. Log in and allow the local Studio:
   ```bash
   npm install
   npx sanity login
   npx sanity cors add http://localhost:3000 --credentials
   ```

### 2. Import content (10 to 30 min, mostly asset download)

The import fetches all 671 images, PDFs and videos (~450 MB) **from the live patnis.lv**, so do it while the Drupal site is still up.

```bash
npx tsx scripts/check-import.ts                          # should print OK
npx sanity dataset import ../import/patnis.ndjson production
# re-running later: add --replace
```

Then `npm run dev` and open <http://localhost:3000> and <http://localhost:3000/studio>.

### 3. Vercel

1. New project from the repo. **Root Directory: `patnis/web`** (or the repo root if you move `web/` into its own repo, which I'd recommend: this branch lives in `sample_app`).
2. Environment variables: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET=production`, `NEXT_PUBLIC_SITE_URL=https://patnis.lv`, `SANITY_REVALIDATE_SECRET`.
3. Deploy, then allow the Studio on the Vercel domain:
   `npx sanity cors add https://<project>.vercel.app --credentials` (and later `https://patnis.lv`).

### 4. Webhooks (free plan allows 2)

In sanity.io/manage → API → Webhooks:

| Name | URL | Filter | Other |
|---|---|---|---|
| Revalidate site | `https://<domain>/api/revalidate` | (empty = all) | POST, create/update/delete, **Secret** = `SANITY_REVALIDATE_SECRET` |
| Redeploy on redirects | Vercel deploy hook URL (Vercel → Settings → Git → Deploy Hooks) | `_type == "redirect"` | POST, create/update/delete |

Pages are cached by Next.js and only refetched after a publish, so Sanity API usage stays far below the free plan's limits.

### 5. Go-live

1. Point `patnis.lv` and `www.patnis.lv` to Vercel (Vercel → Domains). Keep the Drupal server reachable at a temporary hostname for a few weeks, for comparison.
2. `/konference` is a **Canva website export** in a folder on the Drupal server, not Drupal content. Copy that folder into `web/public/konference/` before switching DNS, or replace the link with the Canva site URL.
3. Invite the school's editors in sanity.io/manage → Members (free plan: 20 seats).
4. Submit `https://patnis.lv/sitemap.xml` in Google Search Console.

## Content work after import (`import/review.md`)

- **22 hand-coded landing pages** (home, /pirmsskola, /skola, /makslu-skola, /ppms, /playlab, music, art…) were pasted HTML in Drupal. Their text, images, cards and documents are imported, but the layout is flattened into one text section. These get rebuilt with sections during the design pass. Each has a "Migrācijas piezīme" in the Studio.
- **8 forms** are now pages with a button to `https://portal.patnis.lv/`. Update the button links when the portal routes exist. Field lists are in `docs/INVENTORY.md`.
- **Article dates:** 47 came from the old listings/RSS, 101 are approximated from the upload month (`/files/2026-03/`), and 5 have none (the "20xx/20xx mācību gads" reports).
- `/vakances` is unpublished on the old site (403), but a homepage card links to it.

## Not done yet (next session)

- Design pass: the frontend is a clean, functional baseline in Patnis colours (cream, green, yellow; Figtree and Source Serif 4), not a designed site.
- Sanity Presentation / visual editing (click-to-edit preview).
- Cookie consent and Google Analytics (`G-N9YZ8RVJNL` and the Ads tag `AW-16843733644` are on the old site).
- Search (Drupal had none in use).

## Local preview without a Sanity account

```bash
npx tsx scripts/mock-sanity.ts &
SANITY_API_HOST=http://localhost:3333 NEXT_PUBLIC_SANITY_PROJECT_ID=mock npm run dev
```

Images don't show in this mode because they only exist after the real import uploads them.

## Re-crawl (if content changes before go-live)

```bash
cd ../crawl && python3 crawl.py && curl -s https://patnis.lv/rss.xml -o rss.xml
cd ../web && npx tsx scripts/import-drupal.ts && npx tsx scripts/check-import.ts
```

Needs `pip install beautifulsoup4 lxml requests`. To rebuild `import/` from the committed snapshot without re-crawling, first run `tar xzf raw.tgz` in `crawl/`. Re-importing with `--replace` overwrites documents with the same `_id`, so edits made in the Studio to those documents are lost. Re-crawl only before editors start working.
