# Career Control — isolated demo

Original, buildless career-operations prototype. All employers, roles, evidence IDs, fit ratings and stories are fictional. This is not a connected job tracker or proof of any application. No real applicant data, external requests, browser storage, analytics, account access, email or submission capability. Changes are session-only and reset on reload.

Run from a local HTTP static server and open `career-control/`. ES modules require HTTP in many browsers. Run checks with `node --test career-control/test.mjs` and `node --check career-control/app.mjs`.

## Interaction

Search/filter the five pipeline stages; select a role to see evidence, gaps and readiness gates. Place or release a **demo** hold. Release returns the role to Research rather than automatically marking it ready. Practice interview prompts and fictional STAR/reflection outlines. Derived summary counts do not equate research to eligibility or preparedness to submission.

## Design inspiration and limits

Conceptually informed by [Career Ops](https://github.com/career-ops-hq/career-ops): evidence-first role assessment, separation of preparation from action, and interview story preparation. No upstream source code, assets or branding copied. This is an independent original prototype, not affiliated with Career Ops. Scores are illustrative rubrics, not hiring probabilities. The UI is not an authorization or security boundary.

Before any production connection: use a private authoritative database with immutable source/evidence IDs, separate claims/profile access, append-only status events, server-enforced holds, unique application keys, worker leases, stale-state checks and idempotency. Migrate by copy/verify before archiving. Require authenticated private access and approved integrations; retain live automation and receipts untouched. This public demo must never contain candidate information. No backend or deployment is included.
