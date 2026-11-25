'use strict';
// Public editorial entries only. Never copy private conversations or personal data here.
(function(root){
 const entries = [
  {
   id: '2026-11-03-evidence-and-authority',
   date: '2026-11-03',
   title: 'Keep evidence and authority separate',
   summary: 'An agent harness should keep retrieved evidence, tool permissions and human approvals separate, so a useful source never becomes permission to act.',
   topics: ['Agent governance', 'RAG', 'Agent harnesses'],
   kind: 'original'
  },
  {
   id: '2026-11-04-test-the-missing-evidence',
   date: '2026-11-04',
   title: 'Test the missing evidence',
   summary: 'Include questions the source material cannot answer in RAG evaluations, so the system is tested on when to ask for better evidence as well as when to respond.',
   topics: ['AI', 'RAG'],
   kind: 'original'
  },
  {
   id: '2026-11-05-a-timeout-is-not-a-rollback',
   date: '2026-11-05',
   title: 'A timeout is not a rollback',
   summary: 'Treat a timed-out tool call as an unknown outcome, not proof that nothing happened. Check for completion before retrying, and reuse an idempotency key when the tool supports one.',
   topics: ['MCP', 'Agent harnesses'],
   kind: 'original'
  },
  {
   id: '2026-11-06-tool-schemas-are-not-semantics',
   date: '2026-11-06',
   title: 'Tool schemas are not semantics',
   summary: 'A valid MCP tool call can still carry the wrong units, time zone or resource scope. Make those meanings explicit in the tool contract, then test plausible but incorrect inputs rather than only malformed JSON.',
   topics: ['MCP', 'Agent harnesses'],
   kind: 'original'
  },
  {
   id: '2026-11-07-define-the-exit-before-the-loop',
   date: '2026-11-07',
   title: 'Define the exit before the loop',
   summary: 'An agent loop needs a stopping rule as much as a success criterion: set an iteration budget and decide what partial result or blocker to return when it runs out, so persistence does not become silent, unbounded work.',
   topics: ['Agent governance', 'Agent harnesses'],
   kind: 'source',
   source: {name: 'Anthropic: Building effective agents (December 19, 2024)', url: 'https://www.anthropic.com/research/building-effective-agents'}
  },
  {
   id: '2026-11-08-test-revocation-not-just-access',
   date: '2026-11-08',
   title: 'Test revocation, not just access',
   summary: 'Test what happens when permission disappears halfway through an agent task: cached context and queued tool calls should not preserve authority that has been withdrawn. A harness needs a safe stopping path, not just a successful sign-in path.',
   topics: ['Agent governance', 'Agent harnesses'],
   kind: 'original'
  },
  {
   id: '2026-11-09-preserve-disagreement-in-retrieval',
   date: '2026-11-09',
   title: 'Preserve disagreement in retrieval',
   summary: 'When retrieved sources disagree, a fluent summary can hide the most useful signal. Keep each claim tied to its source and date, show the conflict, and ask what evidence would resolve it. Evaluate whether the answer preserves uncertainty rather than rewarding a confident blend.',
   topics: ['AI', 'RAG'],
   kind: 'original'
  },
  {
   id: '2026-11-10-give-memory-an-expiry-rule',
   date: '2026-11-10',
   title: 'Give memory an expiry rule',
   summary: 'Store when an agent learned a fact and what would make it stale, then test whether it refreshes that fact before a consequential action, so a useful memory does not quietly become an outdated assumption.',
   topics: ['AI', 'Agent harnesses'],
   kind: 'original'
  },
  {
   id: '2026-11-11-test-the-sequence-not-just-the-answer',
   date: '2026-11-11',
   title: 'Test the sequence, not just the answer',
   summary: 'A correct final answer can hide an unnecessary write, a skipped approval or a leaked tool argument. Evaluate the action sequence as well as the response, so an agent earns credit for reaching the result through an acceptable path.',
   topics: ['Agent governance', 'Agent harnesses'],
   kind: 'original'
  },
  {
   id: '2026-11-12-measure-the-cost-of-correctness',
   date: '2026-11-12',
   title: 'Measure the cost of correctness',
   summary: 'Compare agent runs that reach the same correct result by their tool calls, latency and human interruptions, so a harness is rewarded for using just enough work rather than making every task an exhaustive investigation.',
   topics: ['AI', 'Agent harnesses'],
   kind: 'original'
  },
  {
   id: '2026-11-13-make-handoffs-replayable',
   date: '2026-11-13',
   title: 'Make handoffs replayable',
   summary: 'A useful agent handoff records the goal, evidence, actions already taken and unresolved decisions, not just a summary. Test whether a fresh worker can continue without repeating a side effect or silently turning an assumption into a fact.',
   topics: ['Agent harnesses', 'Agent governance'],
   kind: 'original'
  },
  {
   id: '2026-11-14-separate-retrieval-from-reasoning',
   date: '2026-11-14',
   title: 'Separate retrieval from reasoning',
   summary: 'When a RAG answer fails, test the same question with a known relevant passage supplied directly. If the answer improves, investigate retrieval; if it still fails, investigate interpretation. Keep both tests so a fluent answer does not hide a weak evidence pipeline.',
   topics: ['AI', 'RAG'],
   kind: 'original'
  },
  {
   id: '2026-11-15-test-the-recovery-path',
   date: '2026-11-15',
   title: 'Test the recovery path',
   summary: 'An agent evaluation should include a tool that returns a valid but incomplete result. Check whether the harness notices the missing work, preserves what succeeded and reports the remaining gap, rather than treating a successful status code as a completed task.',
   topics: ['MCP', 'Agent harnesses'],
   kind: 'original'
  },
  {
   id: '2026-11-16-shuffle-the-evidence',
   date: '2026-11-16',
   title: 'Shuffle the evidence',
   summary: 'Run the same RAG question with the same passages in a different order. If the answer changes, inspect which evidence the model uses before adding more documents. A useful evaluation checks stability under harmless rearrangements, not only accuracy on one convenient ordering.',
   topics: ['AI', 'RAG'],
   kind: 'original'
  },
  {
   id: '2026-11-17-check-the-boundary-not-just-the-answer',
   date: '2026-11-17',
   title: 'Check the boundary, not just the answer',
   summary: 'Give an agent two similar tasks with different allowed actions and check whether its behavior changes with that boundary, because the same correct answer can come from either an authorized path or an unauthorized one.',
   topics: ['Agent governance', 'AI'],
   kind: 'original'
  },
  {
   id: '2026-11-18-trace-repeated-evidence',
   date: '2026-11-18',
   title: 'Trace repeated evidence',
   summary: 'Several retrieved pages can repeat one original claim, so track where evidence originated before treating agreement as corroboration and test whether an answer changes when copied passages are counted only once.',
   topics: ['AI', 'RAG'],
   kind: 'original'
  },
  {
   id: '2026-11-19-count-the-runs-that-stop',
   date: '2026-11-19',
   title: 'Count the runs that stop',
   summary: 'Keep every planned case in an agent regression report: show completions, timeouts and human stops separately, and compare both outcome quality and completion coverage so a release cannot look better just because its hardest runs stopped producing answers.',
   topics: ['AI', 'Agent harnesses'],
   kind: 'original'
  },
  {
   id: '2026-11-20-test-where-corrections-land',
   date: '2026-11-20',
   title: 'Test where corrections land',
   summary: 'After a user changes one field, score the agent’s reply and its proposed action separately. It can say Wednesday while still sending Tuesday to the calendar. Also check that unchanged fields stay intact, and that a withdrawn request produces no action at all.',
   topics: ['AI', 'Agent harnesses', 'Agent governance'],
   kind: 'source',
   source: {name: 'Mem2ActBench: testing memory in tool selection and arguments (preprint)', url: 'https://arxiv.org/abs/2601.19935'}
  },
  {
   id: '2026-11-21-check-the-order-of-online-updates',
   date: '2026-11-21',
   title: 'Check the order of online updates',
   summary: 'A fixed-step moving average can end at a different estimate when the same observations arrive in a different order. For a stationary replay, hold the sample and initial state fixed, rotate the order, and compare against a batch baseline. Set aside a chronological test too: if the stream really drifts, giving more weight to recent events can be intentional.',
   topics: ['AI'],
   kind: 'source',
   source: {name: 'Bessa et al.: e-means, §3.2 on centroid finalization (preprint)', url: 'https://arxiv.org/html/2611.09501v1#S3.SS2'}
  },
  {
    "id": "2026-11-22-check-the-trace-not-just-its-average",
    "date": "2026-11-22",
    "title": "Check the trace, not just its average",
    "summary": "A dashboard can preserve an average and one local change while losing most of the trace shape. In a synthetic Fourier replay, two three-bin summaries pass both checks but reconstruct very differently. For agent harnesses, keep the aggregate, then score the relevant time slices and failure windows separately.",
    "topics": [
      "AI",
      "Agent harnesses"
    ],
    "kind": "source",
    "source": {
      "name": "Jorge Jovicich, MIT HST.583: Fourier transform concepts (lecture slides)",
      "url": "https://web.mit.edu/hst.583/www/www_2004/hst583_jovicich_oct20.pdf"
    },
    "workedExample": [
      "Reproduce it: take 32 equally spaced samples on a circle, with x[0] through x[15] = 1 and x[16] through x[31] = 0. In the 32-point DFT, keep DC (k = 0) and either k = ±1 or k = ±15; zero all other bins and invert. Negative indices wrap modulo 32, so the kept pairs are (1, 31) and (15, 17).",
      "Both reconstructions average 0.5 and have values 0.5625 and 0.4375 at n = 15 and n = 16, the same 0.125 downward change. That local change matches between reconstructions, not the original step of 1.",
      "Across all 32 samples, the ±1 result retains 90.66% of the original energy and has mean squared error 0.04671. The ±15 result retains 50.39% and has mean squared error 0.24803. Retained energy is the kept sum of squared DFT magnitudes divided by the original sum, including DC; error is the average of (x[n] − reconstruction[n])².",
      "Boundary and metric choices matter: the DFT repeats this toy block, so there is another edge at 31→0. This is a synthetic 1D example, not a claim about clinical images, real agent traces or the superiority of one metric. In a harness, choose trace checks that reflect the failure you need to detect."
    ]
  },
  {
    "id": "2026-11-23-score-the-handoff-too",
    "date": "2026-11-23",
    "title": "Score the handoff too",
    "summary": "When an agent hands off a case, count both the errors it avoids and the work it creates. In a fictional 100-case test, escalating 20 cases to prevent 4 wrong actions and escalating 50 to prevent 5 are different tradeoffs. Track residual errors and review effort together, with separate counts for high-severity cases.",
    "topics": [
      "AI",
      "Agent governance"
    ],
    "kind": "original"
  },
  {
    "id": "2026-11-24-test-both-sides-of-a-policy-change",
    "date": "2026-11-24",
    "title": "Test both sides of a policy change",
    "summary": "Give a RAG system two fictional policies, one with an $80 limit through June 30 and one with a $120 limit starting July 1, then ask the same as‑of question on both dates and grade the cited version separately from the answer.",
    "topics": [
      "RAG",
      "Agent governance"
    ],
    "kind": "original"
  },
  {
    "id": "2026-11-25-fix-the-mix-before-comparing",
    "date": "2026-11-25",
    "title": "Fix the mix before comparing",
    "summary": "An agent can improve on both easy and hard cases while its overall score drops because the test mix changed. Use the same held-out cases when possible; otherwise report each slice and compare against fixed reference weights chosen before looking at results.",
    "topics": [
      "AI",
      "Agent harnesses"
    ],
    "kind": "original",
    "workedExample": [
      "Fictional releases: A passes 90/100 easy and 4/10 hard cases; B passes 19/20 easy and 45/100 hard cases. Easy improves from 90% to 95%; hard improves from 40% to 45%.",
      "The raw aggregate falls from 85.45% (94/110) to 53.33% (64/120). Reweight both to the same 50/50 reference mix and the comparison reverses: 65% for A versus 70% for B.",
      "Equal weights illustrate the method; they are not a production traffic estimate. Publish the weights and counts, and prefer paired cases within slices. Reweighting cannot correct differences in difficulty within a slice or replace uncertainty estimates."
    ]
  }
 ];
 if (typeof module !== 'undefined') module.exports = entries;
 else root.IdeaVisionInsights = entries;
})(typeof window !== 'undefined' ? window : globalThis);
