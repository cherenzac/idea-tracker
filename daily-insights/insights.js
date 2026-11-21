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
  }
 ];
 if (typeof module !== 'undefined') module.exports = entries;
 else root.IdeaVisionInsights = entries;
})(typeof window !== 'undefined' ? window : globalThis);
