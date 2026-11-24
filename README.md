# IdeaVision

A tiny, retro television-inspired idea tracker built with plain HTML, CSS, and JavaScript. No build step, frameworks, accounts, analytics, or backend.

## Run

Open `index.html` in a modern browser, or serve this directory:

```sh
python3 -m http.server 8080
```

Then visit `http://localhost:8080`. Use a local server for consistent browser storage behavior.

## Features

- Twenty-nine generic home/family AI project concepts (not implemented AI features)
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

This version uses `ideavision.ideas.v21`. Returning v20 visitors receive one new concept, **Sorting Rule Switch**, while keeping all existing entries, edits and deletions. Previous storage remains unchanged as a backup. The addition happens once; deleting it stays deleted on reload. Returning v19 visitors also receive Instruction Gap Detective; v18 visitors also receive Imaginary Language Lab; v17 visitors also receive Shape Packing Studio; v16 visitors also receive Puzzle Hint Ladder; v15 visitors also receive Shadow Story Stage; v14 visitors also receive Story Viewfinder; v13 visitors also receive Fact or Fable Studio; v12 visitors also receive Token Town Market; v11 visitors also receive Creature Habitat Lab; v10 visitors also receive Paper Bridge Lab; v9 visitors also receive Foley Forest; v8 visitors also receive Pattern Parade; v7 visitors also receive Comic Continuity Coach; v6 visitors also receive Make-Believe Museum; v5 visitors also receive Robot Route Coach; v4 visitors also receive Board Game Balance Lab; v3 visitors also receive Riddle Repair Shop; v2 visitors also receive Toybox Tales. The v1 migration retains personal and edited entries. The newest available saved version takes priority; invalid data is never overwritten or silently replaced by older data.

Token Town Market is an **AI project concept**, not a working AI service: compare imaginary shopping baskets using pretend tokens, explain totals and suggest swaps, with adult arithmetic checks. It does not use real budgets, process purchases or provide financial advice. No real people, photos, uploads, model or API are added. The existing notebook concepts also remain concepts, not implemented generators.

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

The launcher shows the last **five actually opened projects**, with a searchable **Browse all projects** directory and a native jump dropdown. It has eight real destinations; the twenty-three notebook concepts remain concepts, not invented deployed applications. Search supports multiple words across titles, descriptions, categories, statuses and tags. Directory height is bounded so 50+ projects do not make a 50-tab strip. Internal project URLs use `#project=bricks` (or `ideas`/`news`), support refresh and browser Back/Forward, and switching keeps unsaved form state.

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

Search supports multiple words; topic filters, ten-entry pagination and direct article fragments work without accounts or localStorage. Opening an article fragment clears filters, reveals its page and moves keyboard focus to the labeled article, so keyboard and screen-reader navigation follows the visible destination. The notebook and every existing project retain their own data unchanged. No external feed, private-conversation reader, X integration, analytics or publishing scheduler is built into this page.

### Adding a daily entry

Append an object to `daily-insights/insights.js`: a unique stable `YYYY-MM-DD-slug` ID, actual publication `date` in `YYYY-MM-DD`, a short `title`, one-sentence `summary` (up to 360 characters), one or more supported `topics`, and `kind: 'original'` or `'source'`. Original entries are labeled AI-assisted. Source-inspired entries also require `source: {name, url}` with a direct public HTTPS source link; paraphrase faithfully and attribute quotes. Verify source authorship and dates before publication. Do not republish private conversation content, personal details or protected material without specific approval. Do not invent old dates or claim a source was checked when it was not.

Update the `insights.js` cache version in the journal HTML when entries change. Keep older entries, use a real commit, run all tests, then verify the exact Pages deployment and rendered article. The page does not schedule future publications; any authorized recurring publishing is managed separately.

Run `node test-insights.js` plus every existing `test*.js` suite and JavaScript syntax checks. The journal suite validates entry metadata, attribution and URL safety, UTC date labels, filtering, pagination, empty states, text-only rendering and source links. Test browser layout and navigation after changes.




## Vacation Atlas

A standalone travel notebook at `vacations/`, linked from the launcher and project directory. Six editorial hotel selections offer source-linked factual descriptions, associated experiences, and separately labeled planning perspectives. They are not an objective ranking or firsthand guest reviews. Source dates are shown; verify current facilities, policies, transport, prices and availability directly before booking.

Type a hotel name, destination or style to search the curated collection, filter by region, expand details and save a local shortlist. An unlisted hotel can be saved with your own notes as **unresearched**. External research links open only on deliberate click. The page does not fetch hotel reviews, enrich unknown names automatically, contact an AI service, book stays or run a background research job.

Shortlists and custom notes stay in this browser under their own storage key, separate from ideas and other projects. Shared-browser users can see them; avoid private travel or personal details. Storage errors are visible. No analytics, credentials or external images are embedded. The landscape artwork is decorative, not a photograph of a hotel.

Run `node test-vacations.js` and all existing test suites after changes.

## Nightly update: November 12, 2026 UTC

Added **Fact or Fable Studio**, a family-friendly AI concept about matching invented claims to evidence and recognizing missing information. This is a notebook concept, not a working AI service. The v14 migration keeps existing records and backups, introduces only missing newer concepts, and respects later deletions.

This scheduled run belongs to November 11 in America/Los_Angeles. The November 12–December 12 website-improvement trial has not started in that time zone; its single new standalone project page remains pending. Existing project destinations are unchanged.

Verification for this update: all 13 `test*.js` suites and all JavaScript syntax checks passed, including v1–v13 migration, edited/new records, deletion persistence, corrupt storage and failed-write handling. Local browser preview was blocked by Chromium socket permissions and the cloud browser's file-protocol restriction. No CSS or layout structure changed; deployed-page verification is recorded separately.


## November 13 nightly update

Added **Story Viewfinder**, a family-friendly concept about comparing fictional viewpoints and distinguishing observations from guesses. It is not a working AI service or a tool for profiling real people. The v15 migration preserves records, edited concepts, prior deletions and older backups. Regression tests cover v2–v14 upgrades, malformed data, current-version priority and failed storage writes.


## Website-improvement trial: sole new standalone page

**Fair Test Studio** (`fair-test.html`, registry ID `fair-test`) is the one new standalone page for the November 12–December 12 trial. Public URL: https://cherenzac.github.io/idea-tracker/fair-test.html. Future trial sessions should improve this page rather than add another standalone project. It organizes a question, one changed variable, controls, observations and an optional prediction into a downloadable text worksheet. A reviewed paper example, clear/replace confirmation and stale-output invalidation are included. It is deterministic, not AI, a simulator or a safety checker. No storage, uploads, accounts or external requests; reload loses the worksheet, so download first. Existing notebook storage and other projects are unchanged.

Run `node test-fair-test.js` plus every existing suite and JavaScript syntax check. The completion commit and live deployment evidence are recorded in the run report after publication.

### Insight archive page navigation

Choosing Older or Newer moves keyboard focus and the viewport to the first article on the selected page. Search and topic changes do not move focus. Article permalinks retain their existing navigation behavior. This is view-only and writes no saved data. Covered by `node test-insights.js`.

## November 14 nightly update (November 13 Pacific)
Added **Shadow Story Stage**, a text-only AI concept about invented silhouette puppet scenes, not an implemented AI service. The v16 migration preserves existing entries, edits, deletions and backups.

Fair Test Studio now offers **Print plan** after building a valid worksheet. Print layout uses the complete text rather than a scrolling textarea, hides controls, and wraps long lines. Canceling printing keeps the worksheet; editing it clears stale print content until rebuilt. Printing does not save or upload data. Browser headers, footers and pagination remain controlled by the print dialog.

The trial's sole standalone page was completed in commit `1b07b7631c9862c36460fae8cd363012e27cee4b`: https://cherenzac.github.io/idea-tracker/fair-test.html. This session improves that page, not a new project.

Session verification: all 14 test*.js suites, all 28 JavaScript syntax checks and git diff whitespace checks passed. Browser visual/print-preview checks were attempted but Chromium could not launch: socket() failed with Operation not permitted. Print layout is therefore not visually verified in this environment; automated tests cover print snapshot, stale-output prevention and error handling.

### November 14 morning insight update

Added an original, AI-assisted note about separating retrieval tests from reasoning tests. Archive search now also matches the displayed English date (for example, `November 2026`), alongside ISO dates, titles, topics and text. Search still matches all terms and respects the topic filter; it does not write storage or change article links. Covered by `node test-insights.js`.

Session checks: all 14 test*.js suites, all 28 JavaScript syntax checks and whitespace checks passed. Browser layout/navigation checks were attempted but Chromium could not launch because socket() was denied (Operation not permitted); visual behavior remains unverified. No layout, notebook data or project navigation code changed.


## November 15 nightly update (November 14 Pacific)

Added **Puzzle Hint Ladder**, a distinct AI concept about learner-controlled, progressively stronger hints for fictional puzzles. It is a concept, not a working AI service. Notebook v17 adds it once while preserving existing records, edits, deletions and backups.

Improved the trial’s existing Fair Test Studio with an optional observations field. After a real test, record results and rebuild the worksheet to include them in text downloads and printouts. Observations are entered by the visitor, never generated or inferred. Editing invalidates stale output; example replacement and clearing retain confirmation. No storage, accounts, collection or external service added. This is the nightly session for November 14 Pacific, following that day’s morning insight update; no additional standalone project was created.

Verification: all 14 test*.js suites and all 28 JavaScript syntax checks passed. Tests include v1–v16 notebook migrations, edited IDs, deletion persistence, corrupt/failed storage, optional observations, literal text, output rebuild and print inclusion. Local browser layout/navigation attempt was blocked before launch by Chromium socket permissions (Operation not permitted); mobile and print preview are not visually verified. Exact remote commit and Pages deployment are checked separately after publication.



### Morning insight update · November 15, 2026

Added an original AI-assisted note about evaluating recovery from incomplete tool results. The archive result count now shows the visible range when results span multiple pages, including after paging, filtering and shared-link navigation. This is a view-only accessibility aid; storage, notebook migrations and existing projects are unchanged. The nightly session's Puzzle Hint Ladder and Fair Test observations are preserved.

Verification: all 14 test*.js suites, all 28 JavaScript syntax checks and whitespace checks passed. Local browser layout/navigation was attempted but Chromium could not launch: socket() failed with Operation not permitted. Visual checks remain blocked; pagination, filters, clear and shared-link behavior are covered by the DOM regression suite. Exact remote commit and Pages deployment are verified separately.


## November 16 nightly update (November 15 Pacific)

Added **Shape Packing Studio**, a family-friendly AI concept about testing arrangements of fictional shapes and checking overlap or gaps by hand. It is not an implemented AI feature. Notebook v18 adds the concept once and preserves existing records, edited IDs, deletions and backups.

Fair Test Studio now has **Select plan text** after building a valid worksheet. It selects the complete output and explains how to use the device's Copy command. It does not read or write the clipboard, claim that copying succeeded, request permissions or upload anything. Editing hides the control until the plan is rebuilt. This is an improvement to the trial's sole standalone page, not an additional project. The November 15 morning insight update is preserved; this is that day's second scheduled session.

Verification: all 14 test*.js suites and all 28 JavaScript syntax checks passed, including v1–v17 migrations and full selection, repeat selection, stale-output protection and rebuilt output. Local browser launch was attempted but blocked by Chromium socket permissions (Operation not permitted). Mobile and print-preview visual checks remain unverified. Remote commit, exact Pages deployment and cloud desktop interaction are checked separately after publication.


### Morning insight update · November 16, 2026

Added **Shuffle the evidence**, an original AI-assisted note about checking whether RAG answers remain stable when the same evidence is reordered. Archive topic chips are now labeled keyboard-accessible filter buttons with 44px minimum height. Choosing one preserves the search query, returns to the first result page and focuses the topic selector; Clear filters still restores the full archive. No storage, notebook migrations, forms or projects changed. The Shape Packing Studio concept and Fair Test Studio selection improvement from the previous nightly session are preserved.

Verification: all 14 test*.js suites, all 28 JavaScript syntax checks and whitespace checks passed. Regression coverage includes topic button semantics, query preservation, repeat selection, clear and pagination reset. Local mobile browser QA was attempted but the installed Chromium could not launch because socket() was denied (Operation not permitted); layout and visual navigation remain unverified at this stage. Exact remote commit and Pages deployment are verified separately after publishing.

## November 17 nightly update

Added **Imaginary Language Lab**, a family-friendly AI concept for checking invented grammar rules using fictional example sentences and counterexamples. It is not a translator or a connected AI tool. Notebook v19 appends the concept once while preserving edits, deletions and backup storage.

Fair Test Studio now has an optional success rule and three labeled trial records: expected result, observed result, and a human-selected Pass / Fail / Unclear outcome. Untested trials remain unscored. Scoring requires a rule and both expected and observed text; no automatic verdict is generated. All records are included in the plan, download and print snapshot, and any edit invalidates stale output. Example and clear actions retain their cancellation protection. Nothing is uploaded or persisted.

Verification: all 14 test*.js suites, all 28 JavaScript syntax checks and git diff whitespace checks passed. Local Chromium visual QA was attempted but blocked before launch by socket permissions (Operation not permitted); desktop/mobile and print-preview appearance remain unverified locally. Remote commit and exact Pages deployment are checked separately.


### Morning insight update · November 17, 2026

Added **Check the boundary, not just the answer**, an original AI-assisted note about testing authority boundaries independently of final output. The archive now offers **Clear search only** when a query is present. It removes the query while retaining the selected topic, returns to the first result page and focuses search. Clear filters still resets both. No storage, notebook migration or other project changes.

Verification: all 14 test suites, 28 JavaScript syntax checks and whitespace checks passed. Regression tests cover empty results, repeated clearing, topic retention, pagination reset and focus. Local mobile visual QA could not launch because the Playwright browser executable is absent; visual checks remain unverified here. Exact remote commit and Pages deployment are checked separately after publication.


## November 17 Pacific nightly session (November 18 UTC)

Added **Instruction Gap Detective**, a family-friendly AI concept for finding missing steps in fictional paper-craft instructions and asking clarifying questions. It is a concept, not a connected AI feature. Notebook v20 preserves records, edited IDs, deletions and backups while adding the concept once.

Fair Test Studio now offers **Clear trial log only**. After confirmation it clears expectations, observations, human verdicts and notes while retaining the question, planned change, controls, measurement, prediction and success rule. Cancel leaves everything intact. A successful reset invalidates old exports and focuses the first expectation. Empty and repeated resets preserve the current plan. No new storage or network behavior is introduced.

Verification: all 14 test*.js suites and all 28 JavaScript syntax checks passed, including v1–v19 migration tests and cancel/repeat/empty result-reset flows. Local Chromium QA was attempted but socket creation was denied (Operation not permitted), so local desktop/mobile visual checks remain unverified. Remote commit and exact Pages deployment are checked separately after publication.

### Morning insight update · November 18, 2026

Added **Trace repeated evidence**, an original AI-assisted note about checking whether apparently agreeing sources share one origin. Pressing Escape in the archive search now clears a nonempty query while retaining the topic and focusing search. Empty or repeated Escape leaves pagination alone. A visible hint describes the shortcut. No storage, notebook migrations, timers or other projects changed.

Verification: all 14 test suites and 28 JavaScript syntax checks passed, including query recovery, topic preservation, focus, unrelated keys and repeated Escape. Browser layout and navigation checks could not run because the installed Playwright Chromium executable is missing; no cloud browser tool or alternate computer was available. Remote commit and exact Pages deployment are verified separately after publication.

## November 18 Pacific nightly session (November 19 UTC)

Added **Sorting Rule Switch**, a family-friendly AI concept about regrouping fictional objects when a sorting rule changes, including objects that fit neither group. This is a concept, not a connected AI feature. Notebook v21 adds it once while preserving earlier records, edits, deletions and storage backups.

Improved the trial's existing Fair Test Studio: generated plans now summarize counts of the visitor's Pass, Fail, Unclear and Not scored judgments. Unscored trials are never counted as failures, and the summary is explicitly not a scientific conclusion. Counts appear in the same current snapshot used for download and printing, with existing stale-output protection. No new standalone page, storage or network behavior was added. The November 18 morning insight remains unchanged.

Verification: all 14 test suites and all 28 JavaScript syntax checks passed, including v1–v20 migrations, edited IDs, repeat loads, deletions, corrupt storage and mixed/unscored judgment counts. Browser layout/navigation checks were attempted but Playwright's Chromium executable is missing; visual checks remain unverified. Remote commit and exact Pages deployment are checked separately after publication.

## November 19 Pacific nightly session (November 20 UTC)

Added **Puzzle Pair Scorekeeper**, a family-friendly AI concept for comparing fictional clue generators on the same puzzles. It is a proposal, not a working AI feature. Notebook v22 adds it once while preserving earlier edits, deletions and storage backups.

Fair Test Studio now compares two binary pass/fail methods on the same cases. Enter all four paired counts (both pass, A only, B only, neither). The browser shows wins, ties, both pass rates and the signed B-minus-A difference, plus the exact two-sided McNemar p-value when there are discordant pairs. The exact binomial sum uses integer arithmetic before displaying a rounded probability. The UI limits input to 1–500 complete pairs and explains independent pairs, multiple metrics and small samples. The optional fictional example touches only the comparison; no network, uploads, storage, worksheet or print-output changes.

Verification: all 15 test suites and all 30 JavaScript syntax checks passed, including exhaustive comparisons against enumerated fair-coin sequences for up to nine discordant pairs and notebook migration from v1–v21. Browser checks and exact Pages deployment are verified separately.

### November 20 Pacific evening: Audit sampling comparison and Label Swap Lab

Fair Test Studio includes a local, synthetic review-planning calculator. Compare a random review with a budget split across two slices, and find the minimum number of independent random reviews to reach a detection target. The worked scenario yields 63.58% versus 89.26% at the same 50-review budget; reaching 95% at a 2% failure rate takes 149 independent reviews. The tool estimates detection odds under assumed rates and perfect review, not failure prevalence or safety. No input is stored or transmitted.

Label Swap Lab is one new Explore Projects idea, not a deployed classifier. It proposes checking whether opaque class names change grouping decisions when outputs are mapped back to the same categories. Existing notebook data, storage keys, and saved project IDs are unchanged.

### November 21 Pacific evening: Position-only answer order check

Fair Test Studio compares the same three candidate answers in all six presentation orders. With wording and semantic labels fixed, it reports correctness, differences from the ABC order, and differences over all 15 unordered pairs. The fictional first-position rule gets 2/6 right and changes across 12/15 pairs; always selecting the wrong answer gives no changes but 0/6 correct. These are descriptive comparisons for one question, not independent observations or a significance test. No model, network service, or new browser storage is involved.

Tie Rule Garden is a new idea in Explore Projects, not a working application. It compares tie-breaking policies over repeated fictional recommendations without changing their scores. Existing notebook and favorite IDs are unchanged.

### November 22 Pacific evening: Review one exact draft

Fair Test Studio now includes a synthetic approval-revision exercise. Review a fictional $120 order and change its total or its recipient; either change invalidates the review. Reverting the change does not resurrect the prior revision’s approval. A current review permits one simulation, never a real action. No orders, payments, messages or new storage are involved.

Partial Replay Scorecard is a new Explore Projects proposal about measuring skipped, repeated and completed steps in a fictional workshop. It is not a built application.

### November 23 Pacific evening: Find the studio by its exercises

Browse all projects now returns Fair Test Studio for queries such as agent approval, answer order and audit sampling. Search still uses the same launcher and does not create projects or rewrite recents. Explore lists 54 proposals; Severity Budget Cards is a new concept, not a built application.
