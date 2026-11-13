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
  }
 ];
 if (typeof module !== 'undefined') module.exports = entries;
 else root.IdeaVisionInsights = entries;
})(typeof window !== 'undefined' ? window : globalThis);
