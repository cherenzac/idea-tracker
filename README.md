# IdeaVision

A tiny, retro television-inspired idea tracker built with plain HTML, CSS, and JavaScript. No build step, frameworks, accounts, analytics, or backend.

## Run

Open `index.html` in a modern browser, or serve this directory:

```sh
python3 -m http.server 8080
```

Then visit `http://localhost:8080`. Use a local server for consistent browser storage behavior.

## Features

- Eleven generic home/family AI project concepts (not implemented AI features)
- Five official external inspiration links, clearly attributed to their creators
- Add, edit, and delete ideas (deletion asks for confirmation)
- New, Exploring, and Built statuses
- Search, status filters, and JSON export
- Responsive old-school TV styling and labeled keyboard-accessible controls
- Browser-local persistence with a visible warning if storage fails

## Privacy

The public repository contains code and fictional examples only. Ideas you type are stored in your browser's localStorage, not sent to GitHub or another server. There is no synchronization or account isolation: people using the same browser profile and origin can access that storage. Clearing site data removes it. Export JSON to make your own backup. Avoid sensitive information on a shared device. Exported files contain the ideas you entered; share them thoughtfully.

Do not add passwords, API keys, private notes, or personal information to this repository. The notebook itself has no runtime dependencies or external network requests. AI Agent Radar requests Algolia when its panel is visible; the optional X preview described below is loaded only on request. External inspiration links open third-party websites with their own privacy practices and age requirements; no idea content is included in those links.

## Saved-data upgrades

This version uses `ideavision.ideas.v3`. Returning v2 visitors receive one new concept, **Toybox Tales**, while keeping all existing entries, edits and deletions. The prior v2 data is left unchanged as a backup. The addition happens once; deleting the new idea stays deleted on reload. Earlier v1 data still migrates while retaining personal and edited entries. Invalid saved data is never overwritten.

Toybox Tales is a project concept, not a working AI generator: choose three pretend toys and imagine a short, adult-reviewed puppet-show script. It requires no names, photos or recordings.

## Development and attribution

This first version was implemented with AI assistance. The commit history records actual changes; no backdated or synthetic activity is intended. This is a small portfolio starter, not evidence of production deployment or a production security audit.

## Checks

Run the dependency-free smoke checks:

```sh
node --check app.js
node test.js
node --check channels.js
node test-channels.js
```

The tests exercise initial rendering, create/edit/cancel, filtering, deletion and reload persistence using a minimal DOM harness. They are not a substitute for visual browser testing.

## AI Agent Radar

Real recent Hacker News stories via the public Algolia search API, default topic **AI agents**, adjustable query and presets. Automatically checks on opening the news panel, and every five minutes while visible; pause/resume and manual refresh available. No server-side/background job runs after closing the page. Last successful check, actual HN submission dates, empty and stale/error states are shown. These are not original article publication dates or independent validation of community claims. Requests disclose only the search topic and normal network metadata to Algolia (credentials omitted); notebook data stays local. Upstream indexing and availability may lag.

This is explicitly **not an X topic feed**. A latest-X-search outbound link follows the current query; the optional profile widget remains opt-in. Actual embedded X search requires authorized API access, server-side secrets and separately approved costs. No X API is connected, billed or scraped. No key belongs in public JavaScript.

Tests: `node test-news.js` checks URL safety, parsing, ordering, empty results, stale errors and request races. Browser/network integration checks are also required.

## Brick Word studio

The third TV channel converts a word or short phrase into LEGO-style **lettering** with colored bricks and studs. This is deterministic, browser-local canvas typography, not an AI model that generates objects from prompts. Up to 24 Unicode code points are rendered using installed fonts; unsupported characters may display fallback glyphs. Choose three palettes, try presets, and download a 1400×900 PNG. No user text is sent to a service or saved, and no API key is needed. LEGO is a trademark of the LEGO Group; this independent experiment is not affiliated with or endorsed by it.

Additional checks: `node --check brickword.js && node test-brickword.js`. Existing notebook storage/version and news behavior are unchanged.

## Scalable project navigation

The launcher shows the last **five actually opened projects**, with a searchable **Browse all projects** directory and a native jump dropdown. It starts with three real destinations; the eleven notebook concepts remain concepts, not invented deployed applications. Search supports multiple words across titles, descriptions, categories, statuses and tags. Directory height is bounded so 50+ projects do not make a 50-tab strip. Internal project URLs use `#project=bricks` (or `ideas`/`news`), support refresh and browser Back/Forward, and switching keeps unsaved form state.

Navigation history stores only project IDs in `ideavision.recent-projects.v1`, independently of existing notebook storage. Unavailable storage degrades gracefully. Clear browser site data to clear recents (export your notebook first). Nothing is uploaded.

### Nightly builder contract

Add real destinations to `projects.js`: unique stable `id`, `title`, truthful `description`, `category`, `status`, `tags`, and either an existing `panel` ID or a public HTTPS `url`. External sites open only after a deliberate link click, in a new tab with `noopener noreferrer`; never iframe arbitrary sites or put credentials/private endpoints in this public registry. For larger standalone builds, prefer a separate path/page in this same repository and register its public URL rather than loading all application code in the shell. Do not add placeholder applications to inflate counts. Keep notebook concepts separate from deployed projects.

Preserve all existing user storage, forms and working projects; inspect latest main and concurrent changes before committing. Add one useful, safe, tested increment per nightly run, not a synthetic commit merely to maintain a streak. Run `node test.js`, `node test-channels.js`, `node test-brickword.js`, `node test-navigation.js`, `node test-news.js` and browser checks for new UI. The navigation suite includes 50 fixture destinations (test-only, not published as working projects), recent cap, search, stale-ID cleanup and unsafe URL rejection. Verify the exact commit's Pages deployment before reporting it live. No paid APIs, credentials or unrelated publication without scoped approval. The website itself does not schedule builds.
