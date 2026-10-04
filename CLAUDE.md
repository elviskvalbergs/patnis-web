# patnis-web

Public website for Patnis (private preschool, school and arts school in Riga/Ādaži), migrated from Drupal 10.
Next.js 16 (App Router) on Vercel, content in Sanity (EU, free plan, public dataset), Studio embedded at `/studio`.

## Layout

- `web/`: the Next.js app (Vercel Root Directory). Read `web/AGENTS.md` first: Next 16 differs from older versions.
- `web/src/sanity/schemaTypes/`: content model. Editor-facing labels are Latvian.
- `web/src/sanity/queries.ts`: all GROQ. `web/src/components/Sections.tsx` renders page sections.
- `web/scripts/`: Drupal import (`import-drupal.ts`), schema check (`check-import.ts`), local mock API (`mock-sanity.ts`).
- `crawl/`, `import/`, `docs/INVENTORY.md`: migration snapshot of the old site. `crawl/raw.tgz` is the HTML archive.

## Rules

- Scope is a 1:1 move of the old site, not a redesign. `docs/reference/` (screenshots + old CSS) is the visual
  target. Pages with an `htmlBlock` section are carried over verbatim: fix their CSS, never rewrite their content.
- Never put personal data in Sanity: the dataset is public and uploaded files are public by URL. Forms and anything
  with personas kods, addresses or bank details belong in portal.patnis.lv (separate Next.js + Neon app).
- All Sanity reads go through `sanityFetch` (cached, tag `sanity`, cleared by `/api/revalidate`). Never fetch per
  request: that burns the free plan's API quota.
- Schema changes: run `npx sanity schema validate` and `npx tsx scripts/check-import.ts`.
- Before pushing: `npm run lint && npx tsc --noEmit && npm run build` in `web/`.
- Secrets live in `web/.env.local` and Vercel env vars only. Never commit them.
- UI text is Latvian. Customer-facing copy: natural Latvian, Jūs/tu per the page's register.
