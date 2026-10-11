# Claude Code prompts for patnis-web

The code is in <https://github.com/elviskvalbergs-lab/patnis-web> (moved from `sample_app/patnis`). Setup runs in a
Claude Code **cloud session**: API tokens replace the browser logins, so no computer is needed.

## 0. You (phone or browser, ~10 min)

1. **Sanity** (<https://www.sanity.io/manage>, agency organization): **Create new project** → name **Patnis**,
   dataset `production`, visibility **public**. If it offers a Studio template or "create a studio", skip it:
   the Studio is already in this repo (`/studio`). Then in the project: **API → Tokens → Add API token**,
   permission **Editor**. Copy the project ID and the token.
2. **Vercel** (<https://vercel.com/account/tokens>): create a token scoped to your team, expiry ~7 days.
   Check that the Vercel GitHub app can access `patnis-web` (GitHub → Settings → Applications → Vercel).
3. **Claude cloud environment** (environment menu in the session title bar → Edit), add:
   - secret `SANITY_AUTH_TOKEN` = the Sanity token
   - secret `VERCEL_TOKEN` = the Vercel token
   - variable `NEXT_PUBLIC_SANITY_PROJECT_ID` = the project ID

   Never paste tokens into the chat. Secrets load in **new** sessions only: start a fresh session on the
   `patnis-web` repo for the next step.

## 1. Set up and deploy (prompt, in the new cloud session)

```text
Set up and deploy patnis-web. Read CLAUDE.md and HANDOFF.md first.
Auth comes from env: SANITY_AUTH_TOKEN (Sanity CLI reads it), VERCEL_TOKEN (pass as --token to the Vercel CLI),
NEXT_PUBLIC_SANITY_PROJECT_ID. Never print token values or write them to committed files.

1. In web/: npm ci. Create .env.local from .env.example with the project ID and
   SANITY_REVALIDATE_SECRET = `openssl rand -hex 32` (gitignored; keep the value for steps 4 and 6).
2. Sanity: npx tsx scripts/check-import.ts (must print OK), then
   npx sanity dataset import ../import/patnis.ndjson production
   Report the result, including any assets that failed to download.
3. npm run build. Start npm run dev and screenshot /, /pirmsskola, /skola/steam, one article and /studio
   with Playwright; show me.
4. Vercel with --token "$VERCEL_TOKEN": create/link project "patnis-web" from web/, Root Directory `web`
   (use the Vercel REST API if the CLI can't set it), connect the GitHub repo elviskvalbergs-lab/patnis-web,
   add env vars NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET=production,
   NEXT_PUBLIC_SITE_URL=https://patnis.lv and SANITY_REVALIDATE_SECRET for production, preview and development.
   Deploy with `vercel --prod`.
5. npx sanity cors add https://<the vercel production domain> --credentials -y
6. Webhooks via the Sanity API (token from env): "Revalidate site" → https://<domain>/api/revalidate,
   all documents, create/update/delete, secret = SANITY_REVALIDATE_SECRET. Create a Vercel deploy hook for
   main and a second Sanity webhook for _type == "redirect" pointing to it. If an API refuses, tell me the
   exact clicks instead.
7. Report the production URL and what is left for me.
```

## 2. You (~5 min)

- Open the Vercel URL and `/studio` (log in with your Sanity account) and check that it works.
- Sanity → Members: invite the school's editors once the move check is approved.
- DNS switch to Vercel only after the move check (section 4) and the school's OK on the preview URL.
- When live: revoke the Vercel token (and the Sanity token, if no further cloud work is planned).

## 3. Optional: Sanity MCP for Claude Code

This lets Claude read and edit content directly, which is useful for fixing content after the move (and for a
redesign later):

```bash
claude mcp add --transport http sanity https://mcp.sanity.io
```

Then run `/mcp` in Claude Code to log in. Without it, Claude can still write content with the Sanity CLI
(with `SANITY_AUTH_TOKEN` in a cloud session, or your CLI login locally). Check the current MCP URL in Sanity's docs if
this one fails.

## 4. Move check (prompt): the scope the school asked for

The look is already defined: 12 designed pages are carried over 1:1, and the header and footer reproduce the
old theme. This run makes every page match the old site and fixes what doesn't. Run it after the import.

```text
Move check for patnis-web. The school asked for a move, not a redesign: the new site must look and work
like the old one. Read CLAUDE.md, HANDOFF.md and import/review.md first.

Visual target: docs/reference/desktop/*.jpg and docs/reference/mobile/*.jpg (old site, full-page screenshots),
docs/reference/css/ (old Drupal theme CSS), crawl/raw.tgz (old HTML).

For every page in docs/reference/: screenshot the new page (npm run dev, Playwright, 1280 and 390 wide,
full page, scroll to the bottom first so scroll animations fire) and compare it side by side with the
reference. List differences in docs/MOVE-CHECK.md (page, difference, fix), then fix them:
- HTML-block pages: fix scoped CSS or the legacy baseline in globals.css; never rewrite their content.
- Other pages (articles, listings, branches, galleries, text pages): adjust the components in
  src/components/ so they match the old theme's typography, spacing and widths.
- Content problems (cleaned Word pastes, wrong dates, missing images): fix in Sanity.
Then check links: crawl the new site locally and report any 404 or link that still points to the old domain.
Finish with npm run lint, tsc, build; push to branch `move-check` for a Vercel preview URL.
```

## 5. Redesign (later, only if the school wants it)

```text
Redesign run for patnis-web. Read CLAUDE.md, HANDOFF.md, docs/INVENTORY.md and docs/reference/ first.
The current look (docs/reference) is the starting point, not a constraint. Audience: parents choosing a
preschool, school or arts school; goal: "Pieteikties" (applications go to portal.patnis.lv).

Phase 1: write docs/DESIGN.md and 3 homepage directions as static mockups with real content; stop for my choice.
Phase 2: turn the chosen direction into tokens and structured section types (Sanity schema + query + component
for each), then rebuild the 12 HTML-block pages as structured sections one at a time, keeping all text.
Phase 3: Lighthouse/accessibility, lint, tsc, build; push to a branch for a Vercel preview.
```

Tips:
- Each branch push gets its own Vercel preview URL you can send to the school.
- Content edits the school makes in the Studio during either run are fine; schema changes go through Claude.
