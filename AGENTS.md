# AGENTS.md - AI Agent Guidelines

> Guidelines for AI coding assistants working on this project

## Project Context

This is the **Text Analysis Service** - a workshop demo project for teaching GitHub Copilot. The codebase intentionally contains bugs and suboptimal code that participants will fix using AI assistance.

## Primary Goals

1. **Educational**: Code should be readable and well-documented
2. **Demonstrative**: Show clear before/after improvements
3. **Testable**: Every function should be easy to test
4. **Refactorable**: Structure should support migration to NestJS

## Architecture

### Current State (Legacy)
```
Express.js monolith in src/index.js
├── Text Statistics Functions
├── Text Transformation Functions  
├── Text Validation Functions
├── External API Integration
└── Route Handlers
```

### Target State (After Workshop)
```
NestJS Application
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── text-analysis/
│   │   ├── text-analysis.module.ts
│   │   ├── text-analysis.controller.ts
│   │   ├── text-analysis.service.ts
│   │   └── dto/
│   ├── common/
│   │   ├── logger/
│   │   ├── middleware/
│   │   └── filters/
│   └── config/
└── test/
    ├── unit/
    └── integration/
```

## Coding Standards

### JavaScript/TypeScript
- Use ES6+ features (const/let, arrow functions, destructuring)
- Prefer async/await over Promises
- Use meaningful variable names
- Keep functions small and focused (max 20 lines)

### Functions
```javascript
// Good
function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Bad - intentionally in codebase for demo
function countWords(text) {
  if (!text) return 0;
  return text.split(' ').length; // Bug: doesn't handle multiple spaces
}
```

### Documentation
Every exported function needs:
```javascript
/**
 * Counts the number of words in a text string.
 * 
 * @param {string} text - The input text to analyze
 * @returns {number} The word count
 * @throws {TypeError} If text is not a string
 * @example
 * countWords("Hello world") // returns 2
 */
```

### Testing
- Test file naming: `*.test.js` or `*.spec.ts`
- One describe block per function
- Include edge cases: null, undefined, empty, special chars
- Use clear test names: "should return 0 for empty string"

```javascript
describe('countWords', () => {
  it('should return 0 for empty string', () => {
    expect(countWords('')).toBe(0);
  });

  it('should handle multiple spaces', () => {
    expect(countWords('hello   world')).toBe(2);
  });
});
```

## Making Changes

### Adding New Features
1. Write tests first (TDD approach)
2. Implement the feature
3. Add JSDoc documentation
4. Update README if needed
5. Run full test suite

### Fixing Bugs
1. Write a failing test that exposes the bug
2. Fix the bug
3. Verify all tests pass
4. Document the fix in commit message

### Refactoring
1. Ensure tests exist for current behavior
2. Make incremental changes
3. Run tests after each change
4. Keep commits small and focused

## Common Patterns

### Error Handling
```javascript
// Validate input at function start
if (!text || typeof text !== 'string') {
  return null; // or throw new Error('Text is required')
}
```

### API Responses
```javascript
// Success
res.json({ data: result, success: true });

// Error
res.status(400).json({ error: 'Text is required', success: false });
```

### Logging
```javascript
// Use structured logging
logger.info('Processing text', { 
  endpoint: '/analyze/stats',
  textLength: text.length,
  correlationId: req.id
});
```

## Things to Avoid

### Anti-patterns
- ❌ Deeply nested callbacks
- ❌ Global variables
- ❌ Synchronous file operations
- ❌ Hard-coded configuration values
- ❌ Console.log in production code
- ❌ Catching errors without handling them

### Security
- ❌ Logging sensitive data (passwords, tokens)
- ❌ SQL/NoSQL injection vulnerabilities
- ❌ Executing user input as code
- ❌ Exposing stack traces to clients

## File Organization

### Where to Put Things
| Type | Location |
|------|----------|
| Main application | `src/` |
| Unit tests | `test/unit/` |
| Integration tests | `test/integration/` |
| Documentation | `docs/` |
| Configuration | `config/` or root |
| Docker files | root |
| CI/CD | `.github/` or `.gitlab/` |

### Naming Conventions
- Files: kebab-case (`text-analysis.service.ts`)
- Classes: PascalCase (`TextAnalysisService`)
- Functions: camelCase (`countWords`)
- Constants: UPPER_SNAKE_CASE (`MAX_TEXT_LENGTH`)
- Test files: `*.test.js` or `*.spec.ts`

## Dependencies

### Approved Dependencies
- express (current)
- @nestjs/* (target framework)
- jest (testing)
- supertest (integration testing)
- winston (logging)
- class-validator (DTO validation)
- @nestjs/swagger (API documentation)

### Adding New Dependencies
Before adding a dependency, consider:
1. Is it actively maintained?
2. Does it have security vulnerabilities?
3. What's the bundle size impact?
4. Is there a simpler solution?

## Commit Messages

Follow conventional commits:
```
feat: add palindrome validation endpoint
fix: handle multiple spaces in countWords
docs: add API documentation
test: add edge cases for isPalindrome
refactor: extract text utilities to service class
```

## Pull Request Guidelines

1. **Title**: Clear description of changes
2. **Description**: What and why (not how)
3. **Tests**: All tests passing
4. **Coverage**: No decrease in coverage
5. **Documentation**: Updated if needed
6. **Size**: Keep PRs small and focused

## Questions?

If you're an AI assistant and unsure about something:
1. Check llms.txt for quick reference
2. Review existing code patterns
3. Follow the target NestJS architecture
4. Prioritize readability and testability
