# Copilot instructions (Text Analysis Service)


- note you can use git commands in the cli, and you can also use 'gh' commands in the terminal, i have it installed

- for each code modification, i want you to create a detailed commit message that explains:
  - what was changed
  - why it was changed
  - how it improves the codebase
  - any relevant context from the test report or project goals

- each commit message must begin with a jira ticket id in this format: [TAS-123], if there is no jira id provided, use [TAS-000] as a placeholder

- for each code change that has been made by AI, add a comment above the code snippet saying it was created by AI Agent.


## Big picture
- This repo is a **workshop demo**: it intentionally contains bugs and suboptimal code to be fixed with tests (see [AGENTS.md](../AGENTS.md), [WORKSHOP.md](../WORKSHOP.md), [llms.txt](../llms.txt)).
- Current architecture is a **single Express.js monolith** in [src/index.js](../src/index.js):
  - “Pure” text functions (good for unit tests)
  - Express route handlers (API)
  - External integration (`translateText` via MyMemory)
  - Exports `app` + functions via `module.exports` for tests
- UI is static files in [public/](../public/) served by Express.

## Critical workflows
- Install: `npm install` (CI uses `npm ci`).
- Run server: `npm start` (or `npm run dev` for nodemon). UI at `http://localhost:3000`.
- Run tests: `npm test`
  - Integration-only: `npm run test:integration`
  - Coverage: `npm run test:coverage` (CI runs `npm test -- --coverage`).

## Testing conventions (project-specific)
- Jest config: [jest.config.js](../jest.config.js)
  - Test files must match `test/**/*.test.js` or `test/**/*.spec.js`.
  - `test/setup.js` sets `NODE_ENV=test` so the server **does not listen**.
- Import pattern: tests `require('../src/index')` to access exported functions and `app`.
- Integration tests use **Supertest + Nock** (see [test/integration/api.integration.test.js](../test/integration/api.integration.test.js)).
- Workshop note: [test/sample.test.js](../test/sample.test.js) is meant to **demonstrate bug-revealing tests**; don’t “make everything pass” by changing expectations unless the task explicitly asks for it.

## Codebase patterns to follow
- Keep changes focused and readable (this repo is educational).
- Prefer improving behavior by tightening “pure” functions first, then updating route handlers as needed.
- When mocking external calls, prefer Nock (already used) instead of adding new mocking libraries.

## Known intentional bug hotspots (don’t auto-fix unless asked)
- `countWords`: uses `text.split(' ')` (fails on multiple spaces/tabs/newlines).
- `countSentences`: splits only on `.`.
- `isPalindrome`: case/space sensitive.
- `findMostFrequentWord`: O(n²) nested loop.
