# IdeaVision

A tiny, retro television-inspired idea tracker built with plain HTML, CSS, and JavaScript. No build step, frameworks, accounts, analytics, or backend.

## Run

Open `index.html` in a modern browser, or serve this directory:

```sh
python3 -m http.server 8080
```

Then visit `http://localhost:8080`. Use a local server for consistent browser storage behavior.

## Features

- Seventeen generic home/family AI project concepts (not implemented AI features)
- Five official external inspiration links, clearly attributed to their creators
- Add, edit, and delete ideas (deletion asks for confirmation), with Undo last delete
- Confirmation before replacing or canceling an unsaved form draft
- New, Exploring, and Built statuses
- Multiple-word search, status filters, live match counts, Clear filters, view-only title/status sorting, and JSON export
- Responsive old-school TV styling and labeled keyboard-accessible controls
- Browser-local persistence with a visible warning if storage fails

## Privacy

The public repository contains code and fictional examples only. Ideas you type are stored in your browser's localStorage, not sent to GitHub or another server. There is no synchronization or account isolation: people using the same browser profile and origin can access that storage. Clearing site data removes it. Export JSON to make your own backup. Avoid sensitive information on a shared device. Exported files contain the ideas you entered; share them thoughtfully.

Do not add passwords, API keys, private notes, or personal information to this repository. The notebook itself has no runtime dependencies or external network requests. AI Agent Radar requests Algolia when its panel is visible; the optional X preview described below is loaded only on request. External inspiration links open third-party websites with their own privacy practices and age requirements; no idea content is included in those links.

## Saved-data upgrades

This version uses `ideavision.ideas.v9`. Returning v8 visitors receive one new concept, **Pattern Parade**, while keeping all existing entries, edits and deletions. Previous storage remains unchanged as a backup. The addition happens once; deleting it stays deleted on reload. Returning v7 visitors also receive Comic Continuity Coach; v6 visitors also receive Make-Believe Museum; v5 visitors also receive Robot Route Coach; v4 visitors also receive Board Game Balance Lab; v3 visitors also receive Riddle Repair Shop; v2 visitors also receive Toybox Tales. The v1 migration retains personal and edited entries. The newest available saved version takes priority; invalid data is never overwritten or silently replaced by older data.

Pattern Parade is an **AI project concept**, not a working AI service: compare multiple possible rules for invented shape or color sequences and suggest examples that distinguish those rules, with adult review. No real people, photos, uploads, model or API are added. The existing notebook concepts also remain concepts, not implemented generators.

### Find a saved idea

Notebook search matches every space-separated search term in any order across an idea's title, description and status, ignoring letter case. The status dropdown applies at the same time. Matching is literal substring matching, not AI or semantic search. A live result count distinguishes the visible matches from your total saved ideas; an empty notebook has a different message from no matching results. **Clear filters** resets only the search and status dropdown, then focuses search. It does not change saved records, unsaved form text, the current edit or the last-deletion undo. Search terms and filters are not saved or sent anywhere.

Run `node test-notebook-search.js` for multiple terms, whitespace/case, cross-field and status matching, empty states, result counts, repeated clearing, draft/edit/undo preservation and zero storage writes.

### Change the view order

**View order** offers Saved order, Title A–Z (case-insensitive, with numbers in natural order), and Status (New, Exploring, Built). Equal titles or statuses keep their saved relative order. Sorting affects only the visible cards; it does not change notebook storage, JSON export order, unsaved form text, the current edit or deletion recovery. Search and status filtering work with any view order. Clear filters leaves the selected order alone; reload returns to Saved order. The choice is not saved or sent anywhere.

Run `node test-notebook-sort.js` for sorting, stable ties, filtering, draft/edit/undo preservation, export order, reload and zero storage writes.

### Protect an unsaved form draft

Choosing a different idea to edit or canceling an edit asks for confirmation when any form field has changed. Canceling the prompt keeps the draft and its original edit target. Clicking Edit again on the same card simply focuses the current draft. Unchanged forms switch without a prompt. Deleting the idea being edited includes an extra warning when its form has unsaved changes; deleting another idea leaves the draft alone.

The guard does not save draft text or upload it. Search, filters, sorting and switching project panels keep the live form as before. **Save before reloading or closing the tab:** this is not an autosave or browser-navigation recovery feature. JSON export contains notebook records, not unsaved form fields.

Run `node test-notebook-drafts.js` for accepted/canceled switches and cancel-edit prompts, all four fields, repeated Edit clicks, save/reset behavior, delete warnings and undo preservation.

### Undo a notebook deletion

After confirming a deletion, choose **Undo last delete** above the idea cards to restore that entry and its fields. Only the latest confirmed deletion is available to undo, until the page is reloaded or closed. Canceling a later deletion keeps the previous undo available. Other additions, edits, and unsaved form text are retained. Search and status filters remain active, so a restored idea may still be hidden by a filter. Restoring saves to browser storage when available; a storage failure is reported and keeps the restored idea in memory for export. This is not a multi-tab sync or backup recovery system.

## Development and attribution

This first version was implemented with AI assistance. The commit history records actual changes; no backdated or synthetic activity is intended. This is a small portfolio starter, not evidence of production deployment or a production security audit.

## Checks

Run the dependency-free smoke checks:

```sh
node --check app.js
node test.js
node --check channels.js
node test-channels.js
node test-undo.js
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

The launcher shows the last **five actually opened projects**, with a searchable **Browse all projects** directory and a native jump dropdown. It starts with seven real destinations; the seventeen notebook concepts remain concepts, not invented deployed applications. Search supports multiple words across titles, descriptions, categories, statuses and tags. Directory height is bounded so 50+ projects do not make a 50-tab strip. Internal project URLs use `#project=bricks` (or `ideas`/`news`), support refresh and browser Back/Forward, and switching keeps unsaved form state.

Navigation history stores only project IDs in `ideavision.recent-projects.v1`, independently of existing notebook storage. Unavailable storage degrades gracefully. Clear browser site data to clear recents (export your notebook first). Nothing is uploaded.

### Nightly builder contract

Add real destinations to `projects.js`: unique stable `id`, `title`, truthful `description`, `category`, `status`, `tags`, and either an existing `panel` ID or a public HTTPS `url`. External sites open only after a deliberate link click, in a new tab with `noopener noreferrer`; never iframe arbitrary sites or put credentials/private endpoints in this public registry. For larger standalone builds, prefer a separate path/page in this same repository and register its public URL rather than loading all application code in the shell. Do not add placeholder applications to inflate counts. Keep notebook concepts separate from deployed projects.

Preserve all existing user storage, forms and working projects; inspect latest main and concurrent changes before committing. Add one useful, safe, tested increment per nightly run, not a synthetic commit merely to maintain a streak. Run `node test.js`, `node test-channels.js`, `node test-brickword.js`, `node test-navigation.js`, `node test-news.js` and browser checks for new UI. The navigation suite includes 50 fixture destinations (test-only, not published as working projects), recent cap, search, stale-ID cleanup and unsafe URL rejection. Verify the exact commit's Pages deployment before reporting it live. No paid APIs, credentials or unrelated publication without scoped approval. The website itself does not schedule builds.


## Pomodoro Focus

A working browser-local interval timer, not an AI feature. Defaults: five 30-minute focus rounds, 10-minute short breaks, and a 30-minute long break after every fourth focus round. The final focus round ends the session without an extra break. All durations (1–180 whole minutes), round count (1–20), and long-break frequency (1–20) are configurable. If the long-break frequency is at least the total round count, there is no long break before completion.

Start, pause/resume, and confirmed reset are supported. Applying settings to a started session asks for confirmation; cancel leaves the active timer unchanged. Intervals advance automatically using wall-clock deadlines rather than counting interval callbacks. Delayed background callbacks catch up, including across multiple phases. Manual system-clock changes can affect remaining time. Switching projects preserves the timer; closing/reloading the page resets it and its settings. There is no alarm, notification permission, persistent timer, or service running after the page closes. No network, secrets, dependencies or notebook-storage changes.

Run `node --check pomodoro.js && node test-pomodoro.js` in addition to the five existing suites. Tests cover default and custom sequences, validation, exact boundaries, pause/resume, repeated start, delayed callbacks, completion/reset and UI control wiring. Browser QA and deployment must be verified separately before claiming live availability.

## Explore Projects and the modern retro screen

The **Explore Projects** channel contains exactly 50 original concepts inspired by linked primary sources, in five categories. They are ideas to build, not 50 functioning apps. Search, category and difficulty filters, 12-card pagination, a surprise picker, and browser-local favorites help choose a next project. Time estimates are rough MVP planning estimates; source tools may require models, APIs, accounts, hardware or paid services. Sources were inspected November 1, 2026; their future availability is outside this site's control.

Favorites use a separate `ideavision.saved-sparks.v1` localStorage key. They never alter the existing notebook. Storage failure is visible and falls back to in-memory use; no ideas/favorites are uploaded. The screen is wider with a mint chassis, pale reading surface and violet/coral accents, retaining decorative dials and the existing working tools. Respect reduced-motion preferences. The image-search reference informed colors and proportions only; no third-party image was copied.

Additional checks: `node --check explore.js && node test-explore.js`. This suite verifies 50 unique sourced concepts, safe source URLs, filters, pagination, favorites, surprise/empty states and storage failure. Run every existing suite after UI changes. `node test-undo.js` covers confirmed/canceled deletion, repeated undo, multiple deletions, active filters, unsaved edits, reload expiry and unavailable storage.



## Daily Insights

A public, blog-style journal at `daily-insights/`, linked from the main launcher. The journal opens in a new tab so notebook drafts and running timers stay open. Each dated entry is a short perspective on AI, MCP, RAG, agent governance or harness design. The first note is an original, AI-assisted design perspective: keep retrieved evidence, tool permissions and human approvals separate. It is not attributed to the user's conversations or X account.

Search supports multiple words; topic filters, ten-entry pagination and direct article fragments work without accounts or localStorage. The notebook and every existing project retain their own data unchanged. No external feed, private-conversation reader, X integration, analytics or publishing scheduler is built into this page.

### Adding a daily entry

Append an object to `daily-insights/insights.js`: a unique stable `YYYY-MM-DD-slug` ID, actual publication `date` in `YYYY-MM-DD`, a short `title`, one-sentence `summary` (up to 360 characters), one or more supported `topics`, and `kind: 'original'` or `'source'`. Original entries are labeled AI-assisted. Source-inspired entries also require `source: {name, url}` with a direct public HTTPS source link; paraphrase faithfully and attribute quotes. Verify source authorship and dates before publication. Do not republish private conversation content, personal details or protected material without specific approval. Do not invent old dates or claim a source was checked when it was not.

Update the `insights.js` cache version in the journal HTML when entries change. Keep older entries, use a real commit, run all tests, then verify the exact Pages deployment and rendered article. The page does not schedule future publications; any authorized recurring publishing is managed separately.

Run `node test-insights.js` plus every existing `test*.js` suite and JavaScript syntax checks. The journal suite validates entry metadata, attribution and URL safety, UTC date labels, filtering, pagination, empty states, text-only rendering and source links. Test browser layout and navigation after changes.




## Vacation Atlas

A standalone travel notebook at `vacations/`, linked from the launcher and project directory. Six editorial hotel selections offer source-linked factual descriptions, associated experiences, and separately labeled planning perspectives. They are not an objective ranking or firsthand guest reviews. Source dates are shown; verify current facilities, policies, transport, prices and availability directly before booking.

Type a hotel name, destination or style to search the curated collection, filter by region, expand details and save a local shortlist. An unlisted hotel can be saved with your own notes as **unresearched**. External research links open only on deliberate click. The page does not fetch hotel reviews, enrich unknown names automatically, contact an AI service, book stays or run a background research job.

Shortlists and custom notes stay in this browser under their own storage key, separate from ideas and other projects. Shared-browser users can see them; avoid private travel or personal details. Storage errors are visible. No analytics, credentials or external images are embedded. The landscape artwork is decorative, not a photograph of a hotel.

Run `node test-vacations.js` and all existing test suites after changes.
