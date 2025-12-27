# 🎓 Workshop Exercises - Step by Step Guide

## Prerequisites
- Node.js 18+
- VS Code with GitHub Copilot extension
- Basic JavaScript/TypeScript knowledge

---

## 🧪 Exercise 1: Unit Testing

### Step 1: Install testing dependencies
```bash
npm install --save-dev jest @types/jest
```

### Step 2: Add test script to package.json
```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

### Step 3: Use Copilot to generate tests

Open `src/index.js` and select the `countWords` function. 

**Copilot Chat Prompt:**
> Create a test file for countWords function with the following test cases:
> - Empty string
> - Single word
> - Multiple words
> - Multiple spaces between words
> - Tabs and newlines
> - Unicode characters
> - Numbers mixed with words

### Step 4: Discover the bugs!

Run the tests - some will fail! This demonstrates:
1. How Copilot generates edge cases
2. How tests reveal bugs in existing code
3. TDD workflow

---

## 🔄 Exercise 2: Refactoring to NestJS

### Step 1: Install NestJS CLI
```bash
npm install -g @nestjs/cli
```

### Step 2: Use Copilot to plan the migration

**Copilot Chat Prompt:**
> I have this Express.js application. Help me plan a migration to NestJS. 
> What modules, controllers, and services should I create?

### Step 3: Generate NestJS structure

**Copilot Chat Prompt:**
> Convert the text analysis functions to a NestJS service class with proper typing

### Step 4: Generate DTOs

**Copilot Chat Prompt:**
> Create DTOs for the /analyze/stats endpoint with class-validator decorators

---

## ⚡ Exercise 3: Algorithm Optimization

### Step 1: Analyze current implementation

Look at `findMostFrequentWord` - it's O(n²)!

### Step 2: Ask Copilot to optimize

**Copilot Chat Prompt:**
> Optimize this findMostFrequentWord function from O(n²) to O(n) using a hash map

### Step 3: Compare performance

```javascript
// Add this to test performance
console.time('original');
findMostFrequentWord(longText);
console.timeEnd('original');

console.time('optimized');
findMostFrequentWordOptimized(longText);
console.timeEnd('optimized');
```

---

## 🐳 Exercise 4: Dockerfile Creation

### Step 1: Ask Copilot to generate Dockerfile

**Copilot Chat Prompt:**
> Create a multi-stage Dockerfile for this Node.js application with:
> - Development stage
> - Build stage  
> - Production stage with minimal image size
> - Non-root user for security
> - Health check

### Step 2: Generate docker-compose.yml

**Copilot Chat Prompt:**
> Create a docker-compose.yml for local development with hot reload

---

## 📚 Exercise 5: Auto Documentation

### Step 1: Add JSDoc to functions

Select a function and use:

**Copilot Chat Prompt:**
> Add comprehensive JSDoc documentation to this function including @param, @returns, @throws, and @example

### Step 2: Install Swagger for NestJS

```bash
npm install @nestjs/swagger swagger-ui-express
```

### Step 3: Generate Swagger decorators

**Copilot Chat Prompt:**
> Add Swagger decorators to this controller endpoint including @ApiOperation, @ApiBody, @ApiResponse

---

## 📝 Exercise 6: Structured Logging

### Step 1: Install Winston

```bash
npm install winston
```

### Step 2: Generate logger service

**Copilot Chat Prompt:**
> Create a Winston logger service for NestJS with:
> - JSON format for production
> - Pretty print for development
> - Different log levels
> - Request correlation ID
> - File rotation

### Step 3: Add logging middleware

**Copilot Chat Prompt:**
> Create a NestJS middleware that logs all incoming requests and outgoing responses with timing

---

## 🔗 Exercise 7: Integration Testing

### Step 1: Install supertest

```bash
npm install --save-dev supertest @types/supertest
```

### Step 2: Generate integration tests

**Copilot Chat Prompt:**
> Create integration tests for the /analyze/stats endpoint using supertest with:
> - Success case
> - Missing text error
> - Invalid JSON error
> - Large text input

---

## 🎯 Bonus Exercises

### Error Handling
> Add global exception filter to NestJS application with proper error responses

### Rate Limiting
> Add rate limiting middleware to prevent API abuse

### Caching
> Add Redis caching for sentiment analysis results

### Input Validation
> Add input sanitization to prevent XSS attacks

### CI/CD
> Generate a GitHub Actions workflow for testing and deployment

---

## 💡 Tips for Workshop Facilitators

1. **Start Simple**: Begin with unit testing to show immediate value
2. **Show Iterations**: Copilot suggestions improve with context
3. **Compare Solutions**: Show how different prompts give different results
4. **Embrace Bugs**: Test failures are learning opportunities
5. **Time Box**: Each exercise should take 15-20 minutes

---

## 📊 Assessment Checklist

By the end of the workshop, participants should have:

- [ ] Generated unit tests with edge cases
- [ ] Fixed bugs discovered by tests
- [ ] Refactored at least one module to NestJS
- [ ] Optimized the findMostFrequentWord function
- [ ] Created a Dockerfile
- [ ] Added Swagger documentation
- [ ] Implemented logging
- [ ] Written integration tests

---

## 🔗 Resources

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Swagger/OpenAPI](https://swagger.io/specification/)
