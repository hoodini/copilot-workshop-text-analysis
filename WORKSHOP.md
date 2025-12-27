# 🚀 GitHub Copilot 101 Workshop - Step-by-Step Guide

> **Welcome!** This hands-on workshop will teach you how to use GitHub Copilot to fix bugs, write tests, refactor code, and more.
>
> ⏱️ **Duration**: 2-3 hours  
> 📋 **Prerequisites**: VS Code with GitHub Copilot extension installed

---

## 📦 Setup (5 minutes)

### 1. Clone the Repository
```bash
git clone https://github.com/hoodini/copilot-workshop-text-analysis.git
cd copilot-workshop-text-analysis
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Server
```bash
npm start
```

### 4. Open in Browser
Visit http://localhost:3000 to see the interactive UI.

### 5. Run Tests (They Will Fail!)
```bash
npm test
```

You should see **13 failing tests** - these reveal bugs you'll fix with Copilot!

---

## 🎯 Workshop Exercises

Each exercise teaches a different Copilot skill. Follow the steps and use the prompts provided.

---

## Exercise 1: Find and Fix Bugs with Copilot 🐛

### The Problem
The `countWords` function has a bug. Try this in the UI:
- Enter: `hello    world` (multiple spaces)
- Expected: 2 words
- Actual: 5 words ❌

### Step 1: Open the file
Open `src/index.js` and find the `countWords` function (around line 32):

```javascript
function countWords(text) {
  if (!text) return 0;
  return text.split(' ').length;  // BUG: splits on single space only!
}
```

### Step 2: Ask Copilot to fix it
Open **Copilot Chat** (Ctrl+Shift+I or Cmd+Shift+I) and type:

```
The countWords function has a bug - it doesn't handle multiple spaces correctly.
"hello    world" returns 5 instead of 2. Fix this function.
```

### Step 3: Apply the fix
Copilot will suggest something like:
```javascript
function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}
```

### Step 4: Verify
Run `npm test` - the countWords tests should now pass!

---

## Exercise 2: Fix the Palindrome Bug 🔄

### The Problem
Try in the UI:
- Enter: `RaceCar` → Should be a palindrome ✅
- Actual: Not a palindrome ❌

The function is case-sensitive and doesn't ignore spaces!

### Step 1: Find the function
Look for `isPalindrome` in `src/index.js` (around line 114):

```javascript
function isPalindrome(text) {
  if (!text) return false;
  const reversed = reverseText(text);
  return text === reversed;  // BUG: case-sensitive comparison!
}
```

### Step 2: Ask Copilot
```
Fix the isPalindrome function to:
1. Ignore case (RaceCar should be true)
2. Ignore spaces ("race car" should be true)
3. Ignore punctuation ("A man, a plan, a canal: Panama" should be true)
```

### Step 3: Expected Result
```javascript
function isPalindrome(text) {
  if (!text) return false;
  const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  const reversed = cleaned.split('').reverse().join('');
  return cleaned === reversed;
}
```

---

## Exercise 3: Generate Unit Tests 🧪

### Goal
Learn how Copilot can generate comprehensive tests automatically.

### Step 1: Create test file
Create a new file: `test/unit/textAnalysis.test.js`

### Step 2: Ask Copilot to generate tests
In the empty file, open Copilot Chat and type:

```
Generate comprehensive unit tests for the countWords function from src/index.js
```

> **💡 Tip**: Notice how Copilot suggests edge cases you might not have thought of!

### Step 3: Let Copilot think of edge cases
Try this prompt:
```
What edge cases should I test for a word counting function?
```

Copilot might suggest:
- Empty string
- Only whitespace
- Tabs and newlines
- Unicode characters
- Very long text
- Numbers mixed with words

---

## Exercise 4: Improve the Sentiment Analysis 😊

### The Problem
The current sentiment analysis is very basic - it just counts positive/negative words.

### Current Limitations
```javascript
// "not good" → counts "good" as positive (WRONG!)
// "very happy" → same score as "happy" (should be stronger)
// "loving" → doesn't match "love"
```

### Step 1: Ask Copilot to improve it
Open `src/index.js`, find `analyzeLocalSentiment`, and ask:

```
Improve this sentiment analysis function to:
1. Handle negation - "not good" should be negative
2. Add intensity modifiers - "very good" should score higher than "good"
3. Use basic stemming - "loving" should match "love"
```

### Step 2: Test your improvements
```javascript
// Test cases to verify:
analyzeSentiment("This is not good")     // Should be negative
analyzeSentiment("This is very good")    // Should be more positive than "good"
analyzeSentiment("I'm loving this!")     // Should detect "loving" as positive
```

---

## Exercise 5: Optimize the Algorithm ⚡

### The Problem
The `findMostFrequentWord` function uses O(n²) complexity - it's slow!

### Step 1: Find the inefficient code
```javascript
// O(n²) - checks every word against every other word
for (let i = 0; i < words.length; i++) {
  let count = 0;
  for (let j = 0; j < words.length; j++) {
    if (words[i] === words[j]) count++;
  }
}
```

### Step 2: Ask Copilot to optimize
```
Optimize findMostFrequentWord from O(n²) to O(n) using a hash map.
Keep the same function signature.
```

### Step 3: Expected result
```javascript
function findMostFrequentWord(text) {
  if (!text) return null;
  
  const words = text.toLowerCase().split(/\s+/);
  const frequency = {};
  
  // O(n) - single pass with hash map
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  let maxWord = null;
  let maxCount = 0;
  
  for (const [word, count] of Object.entries(frequency)) {
    if (count > maxCount) {
      maxCount = count;
      maxWord = word;
    }
  }
  
  return { word: maxWord, count: maxCount };
}
```

---

## Exercise 6: Create a Dockerfile 🐳

### Step 1: Ask Copilot to create it
Create a new file called `Dockerfile` and type this comment:

```dockerfile
# Create a production-ready Dockerfile for this Node.js application
# Use multi-stage build for smaller image size
# Run as non-root user for security
```

Then press Enter and let Copilot generate the rest!

### Step 2: Build and test
```bash
docker build -t text-analysis .
docker run -p 3000:3000 text-analysis
```

---

## Exercise 7: Write Integration Tests with API Mocking 🔗

### Goal
Learn to test code that calls external APIs without actually calling them.

### Step 1: Understand the setup
Look at `test/integration/api.integration.test.js` - it uses `nock` to mock HTTP calls.

### Step 2: Add more tests
Ask Copilot:
```
Add integration tests for the POST /transform endpoint.
Test all operations: slug, case, reverse.
Include error cases.
```

### Step 3: Run integration tests
```bash
npm run test:integration
```

---

## Exercise 8: Add Documentation 📚

### Step 1: Generate JSDoc
Select the `countWords` function and ask:
```
Add comprehensive JSDoc documentation to this function including
@param, @returns, @throws, and @example
```

### Step 2: Generate Swagger/OpenAPI
```
Create OpenAPI/Swagger documentation for all the endpoints in this Express app
```

---

## Exercise 9: Refactor to NestJS 🏗️

### The Big Challenge!
Convert this Express.js app to NestJS architecture.

### Step 1: Plan the migration
```
I want to migrate this Express.js app to NestJS.
Create a migration plan with:
- Module structure
- Services to create
- Controllers needed
- DTOs for validation
```

### Step 2: Create the service
```
Convert the text analysis functions into a NestJS service class called TextAnalysisService
with proper TypeScript types
```

### Step 3: Create the controller
```
Create a NestJS controller for TextAnalysisService with the same endpoints
```

---

## 🏆 Challenge Yourself!

### Bonus Challenges

1. **Add rate limiting** - Prevent API abuse
   ```
   Add rate limiting to this Express app - 100 requests per minute per IP
   ```

2. **Add caching** - Speed up repeated requests
   ```
   Add Redis caching to the sentiment analysis endpoint
   ```

3. **Add logging** - Production-ready logging
   ```
   Add Winston logger with request correlation IDs
   ```

4. **Add CI/CD** - Automated testing
   ```
   Create a GitHub Actions workflow that runs tests on every push
   ```

---

## 💡 Copilot Pro Tips

### 1. Be Specific
❌ `"Fix this"`  
✅ `"Fix the countWords function to handle multiple spaces between words"`

### 2. Provide Context
❌ `"Add tests"`  
✅ `"Add unit tests for countWords with edge cases like empty strings and unicode"`

### 3. Ask for Explanations
```
Explain why this regex works: /\s+/
```

### 4. Iterate
Start simple, then refine:
1. `"Generate tests for countWords"`
2. `"Add more edge cases"`
3. `"Add a test for emoji handling"`

### 5. Use Copilot as a Thought Partner
```
What edge cases should I consider for a URL validation function?
```

---

## ✅ Completion Checklist

- [ ] Fixed `countWords` multiple spaces bug
- [ ] Fixed `countSentences` counting bug  
- [ ] Fixed `isPalindrome` case sensitivity bug
- [ ] Fixed `findMostFrequentWord` punctuation bug
- [ ] Optimized `findMostFrequentWord` to O(n)
- [ ] Generated unit tests with edge cases
- [ ] Created Dockerfile
- [ ] Added integration tests with mocking
- [ ] Improved sentiment analysis
- [ ] Added JSDoc documentation

---

## 📚 Additional Resources

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Prompt Engineering Guide](https://github.com/dair-ai/Prompt-Engineering-Guide)
- [More Prompts](./docs/PROMPTS_LIBRARY.md)
- [Workshop Overview](./docs/COPILOT_101_WORKSHOP.md)

---

## 🎉 Congratulations!

You've completed the GitHub Copilot 101 Workshop! You've learned to:

- 🐛 Find and fix bugs with AI assistance
- 🧪 Generate comprehensive tests
- ⚡ Optimize algorithms
- 🐳 Create Dockerfiles
- 🔗 Write integration tests with mocking
- 📚 Generate documentation
- 🏗️ Plan code refactoring

**Keep practicing!** The more you use Copilot, the better you'll become at prompting.

---

*Made with ❤️ for GitHub Copilot Workshop*
