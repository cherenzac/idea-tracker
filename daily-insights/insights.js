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
  }
 ];
 if (typeof module !== 'undefined') module.exports = entries;
 else root.IdeaVisionInsights = entries;
})(typeof window !== 'undefined' ? window : globalThis);
