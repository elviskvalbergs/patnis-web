# patnis-web

Next.js 16 site for patnis.lv with an embedded Sanity Studio at `/studio`.
Setup, import and deployment steps: [`../HANDOFF.md`](../HANDOFF.md).

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SANITY_PROJECT_ID
npm run dev                  # site on :3000, Studio on :3000/studio
```

- `src/sanity/schemaTypes/` – content model (Latvian labels for editors)
- `src/sanity/queries.ts` – all GROQ queries
- `src/components/Sections.tsx` – renders page sections
- `src/app/api/revalidate` – Sanity webhook target, clears the cache tag on publish
- `scripts/` – Drupal import, import checker, local mock API
