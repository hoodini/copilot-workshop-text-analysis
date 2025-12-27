# 🎬 Workshop Quick Reference Card

> Print this for participants

---

## 🚀 Setup Commands

```bash
# Clone & Install
git clone <repo-url>
cd text-analysis-service
npm install
npm start
```

---

## 🧪 Exercise 1: Unit Testing

**Open:** `src/index.js`  
**Select:** `countWords` function

**Prompt:**
```
Generate unit tests for the countWords function with edge cases:
- Empty string, null, undefined
- Multiple spaces, tabs, newlines
- Unicode characters and emojis
```

---

## 🔄 Exercise 2: Refactor to NestJS

**Prompt:**
```
Convert this Express.js application to NestJS with:
- TextAnalysisService class
- TextAnalysisController
- DTO with class-validator
- Proper module structure
```

---

## ⚡ Exercise 3: Optimize Algorithm

**Select:** `findMostFrequentWord` function

**Prompt:**
```
This function is O(n²). Optimize it to O(n) using a hash map.
```

---

## 🐳 Exercise 4: Dockerfile

**Prompt:**
```
Create a multi-stage Dockerfile with:
- Node 20 Alpine base
- Production dependencies only
- Non-root user
- Health check
```

---

## 📚 Exercise 5: Documentation

**Prompt:**
```
Add JSDoc documentation to all functions with:
- @param, @returns, @throws
- @example with usage
```

---

## 📊 Exercise 6: Mermaid Diagrams

**Prompt:**
```
Create a Mermaid sequence diagram showing the request flow for POST /analyze/stats
```

---

## 📝 Exercise 7: Logging

**Prompt:**
```
Create a Winston logger with:
- JSON format for production
- Request correlation IDs
- Log rotation
```

---

## 🔗 Exercise 8: Integration Tests

**Prompt:**
```
Create integration tests for POST /analyze/stats using Supertest with success and error cases
```

---

## 🤖 Exercise 9: LLM Files

**Prompt:**
```
Create an llms.txt file that explains this project to AI assistants
```

---

## 💡 Tips

1. **Be specific** - Include details in prompts
2. **Iterate** - Refine prompts based on output
3. **Review** - Always verify generated code
4. **Context** - Open relevant files first

---

## 📋 Test Commands

```bash
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage
```

---

## 🐳 Docker Commands

```bash
docker build -t text-analysis .
docker run -p 3000:3000 text-analysis
```

---

**Happy Coding! 🚀**
