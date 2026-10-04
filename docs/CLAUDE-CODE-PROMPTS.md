# Claude Code prompts for patnis-web

Paste these into Claude Code on your computer. Do the "You" steps first; they need a browser login.

## 0. You (browser, ~10 min)

1. **Bitbucket:** create an empty repo `patnis-web` (no README, no .gitignore) in your workspace. Copy its SSH URL.
2. **Sanity:** in <https://www.sanity.io/manage>, in your agency organization, create a project **Patnis** with dataset `production`, visibility **public**. Copy the project ID.
3. **Vercel:** make sure your Vercel account/team is connected to Bitbucket (Vercel → Account Settings → Authentication/Git). It's needed once, for auto-deploys from Bitbucket.

## 1. Move to Bitbucket + set up (prompt)

Run this in an empty working folder (e.g. `~/dev`). Replace the two placeholders.

```text
Set up the patnis-web project from the migration kit.

BITBUCKET_URL = git@bitbucket.org:<workspace>/patnis-web.git
SANITY_PROJECT_ID = <id>

1. Export the kit with history into its own repo:
   git clone --branch claude/drupal-replacement-cms-btwy77 https://github.com/elviskvalbergs/sample_app.git /tmp/patnis-src
   cd /tmp/patnis-src && git subtree split --prefix=patnis -b patnis-main
   mkdir -p ./patnis-web && cd ./patnis-web && git init -b main && git pull /tmp/patnis-src patnis-main
   git remote add origin $BITBUCKET_URL && git push -u origin main
2. In the new repo, fix paths in HANDOFF.md and web/README.md: the repo root is now the old `patnis/`
   folder, so "patnis/web" becomes "web". Commit.
3. In web/: npm ci. Create .env.local from .env.example with NEXT_PUBLIC_SANITY_PROJECT_ID set, and
   SANITY_REVALIDATE_SECRET = output of `openssl rand -hex 32`. Do not commit it; check it is gitignored.
4. Ask me to run `! npx sanity login` (browser). Then:
   npx sanity cors add http://localhost:3000 --credentials -y
   npx tsx scripts/check-import.ts           (must print OK)
   npx sanity dataset import ../import/patnis.ndjson production
   Report the import result, including failed assets if any.
5. npm run build, then start npm run dev and screenshot /, /skola, /skola/steam, one article and
   /studio with Playwright. Show me the screenshots.
6. Vercel (CLI is logged in): from web/, `vercel link` to a new project "patnis-web". Add env vars
   NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET=production, NEXT_PUBLIC_SITE_URL=https://patnis.lv,
   SANITY_REVALIDATE_SECRET (same value as .env.local) for production, preview and development.
   Connect the Bitbucket repo (`vercel git connect`) and set the project Root Directory to `web`;
   if the CLI can't set Root Directory, tell me exactly where to click. Deploy with `vercel --prod`.
7. npx sanity cors add https://<the vercel production domain> --credentials -y
8. Print what I still have to do by hand: the two Sanity webhooks from HANDOFF.md with the exact URL
   and the secret to paste, and the Vercel deploy hook. Never print the secret into a file that gets committed.
```

## 2. You (browser, ~5 min)

- Sanity → API → Webhooks: create the two webhooks Claude printed (revalidate + redeploy on redirects).
- Sanity → Members: invite the school's editors once the design is approved, not before.
- DNS switch to Vercel only after the design run and content review.

## 3. Optional: Sanity MCP for Claude Code

This lets Claude read and edit content directly, which the landing-page rebuild in the design run needs:

```bash
claude mcp add --transport http sanity https://mcp.sanity.io
```

Then run `/mcp` in Claude Code to log in. Without it, Claude can still write content with the Sanity CLI
(`npx sanity documents create`), using your CLI login. No API tokens are needed for either route.
Check the current MCP URL in Sanity's docs if this one fails.

## 4. Design run (prompt)

Run after the import, so the design uses real content and images. Get 2–3 reference sites the school likes first.

```text
Design run for patnis-web. Read CLAUDE.md, HANDOFF.md, docs/INVENTORY.md and import/review.md first.

Audience: parents choosing a preschool, school or arts school in Riga/Ādaži; secondary: current parents
looking for documents and news. Main goal: get parents to "Pieteikties" (applications go to portal.patnis.lv).
Brand: existing logo, cream #fff8ee, greens #3b6b57/#2a5e4a, yellow #f1b01d, coral #ff9068, Figtree +
Source Serif 4. References the school likes: <urls>.

Phase 1, directions (stop for my choice):
- Write docs/DESIGN.md: audience, goals, tone, page types, section inventory.
- Make 3 distinct homepage directions as static HTML mockups using real content from Sanity
  (real headlines, cards, photos), desktop and mobile. Screenshot each. Recommend one and say why.

Phase 2, build the chosen direction:
- Turn it into design tokens (globals.css @theme) and section components. Add section types the old
  landing pages need (e.g. stats strip, day schedule/timeline for /ppms, programme cards with prices,
  team grid, image+text split, video). Every new section gets a Sanity schema, query fields and renderer.
- Rebuild the 22 flagged landing pages (import/review.md, "hand-coded") as structured sections.
  Source: crawl/raw.tgz (old HTML) + current Sanity content. Write via the Sanity MCP or CLI, one page at a
  time; clear migrationNote when a page is done. Keep all text; don't invent content.
- Header with dropdown menus per division, mobile menu, footer with contacts per division.
- After each page: Playwright screenshots desktop 1280 and mobile 390, compare with the old page,
  fix spacing/hierarchy issues before moving on.

Phase 3, checks:
- Lighthouse (performance, accessibility ≥ 95), keyboard navigation, alt texts, contrast.
- npm run lint, tsc, build. Push to a branch `design` so Vercel gives me a preview URL for the school.
```

Tips:
- Keep the design run on a branch; every push gets its own Vercel preview URL you can send to the school.
- Do Phase 1 in one session and Phase 2 in a fresh one: the mockups and DESIGN.md carry the decisions forward.
- Content edits the school makes in the Studio during the design run are fine; schema changes go through Claude.
