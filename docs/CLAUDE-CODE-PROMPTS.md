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
- Sanity → Members: invite the school's editors once the move check is approved.
- DNS switch to Vercel only after the move check (section 4) and the school's OK on the preview URL.

## 3. Optional: Sanity MCP for Claude Code

This lets Claude read and edit content directly, which is useful for fixing content after the move (and for a
redesign later):

```bash
claude mcp add --transport http sanity https://mcp.sanity.io
```

Then run `/mcp` in Claude Code to log in. Without it, Claude can still write content with the Sanity CLI,
using your CLI login. No API tokens are needed for either route. Check the current MCP URL in Sanity's docs if
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
