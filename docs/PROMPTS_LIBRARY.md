# 📋 Copilot Prompts Library

> Ready-to-use prompts for the GitHub Copilot 101 Workshop
> 
> **Instructions**: Copy each prompt and paste it in GitHub Copilot Chat

---

## 🧪 Exercise 1: Unit Testing

> **💡 Teaching Tip**: These prompts are intentionally open-ended. Let Copilot suggest edge cases! 
> This teaches participants that AI can help them think through test scenarios they might miss.

### Prompt 1.1 - Generate Basic Tests
```
Generate comprehensive unit tests for the countWords function in src/index.js
```

> **What to observe**: Watch what edge cases Copilot suggests on its own!

### Prompt 1.2 - Ask AI to Think About Edge Cases
```
What edge cases should I test for a word counting function?
```

> **Learning moment**: This teaches participants to use AI as a thought partner, not just a code generator.

### Prompt 1.3 - Test isPalindrome
```
Generate comprehensive unit tests for the isPalindrome function.
Some tests should FAIL to reveal bugs in the current implementation.
```

> **Discussion point**: After running tests, ask: "Which tests failed? What does this tell us about the bug?"

### Prompt 1.4 - Test findMostFrequentWord
```
Create thorough unit tests for the findMostFrequentWord function.
Think about edge cases and tricky inputs.
```

> **Follow-up prompt** (if tests are too basic):
> ```
> What additional edge cases might break this function?
> ```

### Prompt 1.5 - Generate Jest Config
```
Create a jest.config.js file for this Node.js project with coverage enabled
```

---

## 🔄 Exercise 2: Refactoring to NestJS

> **📖 What are DTOs?** Data Transfer Objects - classes that define the shape and validation rules 
> for data sent to/from your API. Think of them as "contracts" for your request/response bodies.

### Prompt 2.1 - Plan Migration
```
I have an Express.js application in src/index.js. Help me plan a migration to NestJS.
List all the modules, controllers, services, and DTOs I need to create.
Show the recommended folder structure.
```

### Prompt 2.2 - Create Service Class
```
Convert the text analysis functions from src/index.js into a NestJS service class called TextAnalysisService.
Include:
- Proper TypeScript types
- All the text analysis methods (countWords, countSentences, isPalindrome, etc.)
- Dependency injection ready
```

### Prompt 2.3 - Create Controller
```
Create a NestJS controller for the TextAnalysisService with these endpoints:
- POST /analyze/stats - get text statistics
- POST /transform - transform text (slug, case, reverse)
- POST /validate - validate text (email, url, palindrome)
- GET /health - health check

Include proper HTTP status codes and error handling.
```

### Prompt 2.4 - Create DTOs
```
Create TypeScript DTOs for the text analysis endpoints using class-validator:
- AnalyzeStatsDto (text: string required)
- TransformTextDto (text: string, operation: enum, options: optional)
- ValidateTextDto (text: string, type: enum)

Add validation decorators and Swagger documentation decorators.
```

### Prompt 2.5 - Create Module
```
Create a NestJS module file for the TextAnalysis feature that:
- Imports necessary modules
- Provides TextAnalysisService
- Exports TextAnalysisService for use in other modules
```

---

## ⚡ Exercise 3: Algorithm Optimization

### Prompt 3.1 - Analyze Complexity
```
Analyze the time complexity of the findMostFrequentWord function in src/index.js.
Explain why it's inefficient and suggest an optimized approach.
```

### Prompt 3.2 - Optimize Algorithm
```
Optimize the findMostFrequentWord function from O(n²) to O(n) using a hash map.
Keep the same function signature and return type.
Add comments explaining the optimization.
```

### Prompt 3.3 - Add Caching
```
Add a simple in-memory cache to the analyzeSentiment function.
Use a Map to cache results based on input text.
Include cache expiration after 5 minutes.
```

### Prompt 3.4 - Performance Test
```
Create a performance test that:
1. Generates a long text with 10,000 words
2. Runs the original findMostFrequentWord function
3. Runs the optimized version
4. Compares execution times
5. Asserts the optimized version is at least 10x faster
```

---

## 🐳 Exercise 4: Dockerfile

### Prompt 4.1 - Basic Dockerfile
```
Create a Dockerfile for this Node.js application with:
- Node 20 Alpine base image
- Production dependencies only
- Non-root user for security
- Exposed port 3000
- Health check command
```

### Prompt 4.2 - Multi-Stage Build
```
Create an optimized multi-stage Dockerfile with:
- Stage 1: Install all dependencies
- Stage 2: Build/compile (if needed)
- Stage 3: Production with minimal footprint
- Final image should be under 200MB
```

### Prompt 4.3 - Docker Compose
```
Create a docker-compose.yml file for local development with:
- The Node.js application service
- Volume mount for hot reload
- Environment variables from .env file
- Redis service for caching
- Health checks
- Named volumes for node_modules
```

### Prompt 4.4 - Docker Ignore
```
Create a .dockerignore file optimized for Node.js that excludes:
- node_modules
- Test files
- Documentation
- Git files
- IDE configurations
- Local environment files
```

---

## 📚 Exercise 5: Documentation

### Prompt 5.1 - JSDoc for Functions
```
Add comprehensive JSDoc documentation to all exported functions in src/index.js.
Include:
- @description with detailed explanation
- @param with types and descriptions
- @returns with type and description
- @throws for error conditions
- @example with usage example
```

### Prompt 5.2 - Generate README
```
Generate a comprehensive README.md for this text analysis service project.
Include:
- Project title and badges
- Description
- Features list
- Installation instructions
- API documentation with examples
- Configuration options
- Contributing guidelines
- License
```

### Prompt 5.3 - API Documentation Table
```
Create a markdown table documenting all API endpoints with:
- Method (GET/POST)
- Endpoint path
- Description
- Request body example
- Response example
- Possible error codes
```

### Prompt 5.4 - Swagger Setup
```
Add Swagger/OpenAPI documentation to this NestJS application:
1. Install and configure @nestjs/swagger
2. Add decorators to all endpoints
3. Create API tags for grouping
4. Add authentication documentation (if applicable)
5. Configure the Swagger UI endpoint
```

---

## 📊 Exercise 6: Mermaid Diagrams

### Prompt 6.1 - Architecture Diagram
```
Create a Mermaid architecture diagram showing:
- Client making HTTP requests
- API Gateway / Load Balancer
- The Text Analysis Service
- External APIs (sentiment, translation)
- Cache layer (Redis)
- Database (if any)

Use a flowchart or C4 diagram style.
```

### Prompt 6.2 - Request Flow Diagram
```
Create a Mermaid sequence diagram showing the flow when a user:
1. Sends a POST request to /analyze/stats
2. Request validation
3. Text processing
4. Response formatting
5. Response sent back

Include error handling paths.
```

### Prompt 6.3 - Class Diagram
```
Create a Mermaid class diagram showing:
- TextAnalysisService with all its methods
- TextAnalysisController
- DTOs (AnalyzeStatsDto, TransformTextDto, etc.)
- Relationships between classes
```

### Prompt 6.4 - Module Structure
```
Create a Mermaid diagram showing the NestJS module structure:
- AppModule
- TextAnalysisModule
- CommonModule (Logger, etc.)
- ConfigModule

Show imports and dependencies.
```

---

## 📝 Exercise 7: Logging

### Prompt 7.1 - Winston Logger Service
```
Create a Winston logger service for NestJS with:
- JSON format for production
- Colorized pretty print for development
- Log levels: error, warn, info, debug
- Timestamp in ISO format
- Request correlation ID support
- File output for errors
```

### Prompt 7.2 - Request Logging Middleware
```
Create a NestJS middleware that logs:
- Incoming request method and URL
- Request body (sanitized, no passwords)
- Response status code
- Response time in milliseconds
- Correlation ID for tracing
```

### Prompt 7.3 - Error Logging
```
Create a NestJS exception filter that:
- Catches all exceptions
- Logs error details (message, stack trace)
- Returns sanitized error to client
- Includes correlation ID
- Different handling for HTTP vs unknown errors
```

### Prompt 7.4 - Log Rotation Config
```
Add log rotation to the Winston logger with:
- Daily rotation
- Maximum file size of 20MB
- Keep logs for 14 days
- Compress old logs
- Separate files for errors and combined logs
```

---

## 🔗 Exercise 8: Integration Tests

> **🎯 Key Skill**: Testing your API endpoints AND mocking external service calls.
> This is critical for real-world applications that depend on third-party APIs.

### Prompt 8.1 - Setup Integration Tests
```
Create the test setup for integration tests using Jest and Supertest.
Include before/after hooks to manage the server lifecycle.
```

### Prompt 8.2 - Test API Endpoints
```
Write integration tests for POST /analyze/stats endpoint using Supertest.
Test both success and error scenarios.
```

### Prompt 8.3 - Test Transform Endpoint
```
Write integration tests for the POST /transform endpoint.
Cover all operation types and error cases.
```

### Prompt 8.4 - Test Validation Endpoint
```
Write integration tests for POST /validate endpoint.
Include tests that expose the bugs in isPalindrome.
```

### Prompt 8.5 - Mock External API Calls ⭐ NEW
```
Create integration tests for the /analyze/sentiment endpoint that mock the external API using nock.
Test these scenarios:
- When external API returns successful response
- When external API times out
- When external API returns an error
- Verify the fallback to local analysis works
```

> **Why this matters**: Real apps call external APIs (payment, auth, AI services). 
> You need to test YOUR code without depending on external services being available.

### Prompt 8.6 - Test Translation with Mocked API ⭐ NEW
```
Write integration tests for /translate endpoint that mock the MyMemory Translation API.
Use nock to simulate API responses and failures.
```

### Prompt 8.7 - Test External API Fallback Behavior ⭐ NEW
```
Create tests that verify the sentiment analysis correctly falls back to local analysis when:
- The external API is unreachable
- The API returns invalid data
- The API times out

Ensure the fallback response has source: 'local' to confirm fallback was used.
```

---

## 🤖 Exercise 9: LLM Guidance Files

### Prompt 9.1 - Create llms.txt
```
Create an llms.txt file for this project that helps AI assistants understand:
- What this project does
- How to install and run it
- Project structure overview
- Key files and their purposes
- Common tasks and how to do them
- Testing instructions
- Deployment notes
```

### Prompt 9.2 - Create AGENTS.md
```
Create an AGENTS.md file following the AGENTS.md specification that includes:
- Project context and purpose
- Code style guidelines
- Architecture decisions
- How to add new features
- Testing requirements
- PR guidelines
- Common pitfalls to avoid
```

### Prompt 9.3 - Create CONTRIBUTING.md
```
Create a CONTRIBUTING.md file that explains:
- How to set up the development environment
- Code style and linting rules
- How to write tests
- Pull request process
- Commit message format
- Code review guidelines
```

### Prompt 9.4 - Create CLAUDE.md
```
Create a CLAUDE.md file (for Claude AI / GitHub Copilot) with:
- Project summary
- Technology stack
- Directory structure explanation
- How to run common development tasks
- Important patterns used in this codebase
- What NOT to do (anti-patterns to avoid)
```

---

## 🎁 Bonus Prompts

### Bonus 1 - Security Scan
```
Review src/index.js for security vulnerabilities:
- Input validation issues
- Injection attacks
- XSS vulnerabilities
- Sensitive data exposure
Provide fixes for each issue found.
```

### Bonus 2 - Rate Limiting
```
Add rate limiting to the Express app using express-rate-limit:
- 100 requests per 15 minutes per IP
- Different limits for different endpoints
- Custom error message
- Headers showing remaining requests
```

### Bonus 3 - GitHub Actions
```
Create a GitHub Actions workflow file (.github/workflows/ci.yml) that:
- Runs on push and pull request
- Sets up Node.js
- Installs dependencies
- Runs linting
- Runs unit tests
- Runs integration tests
- Uploads coverage report
```

### Bonus 4 - GitLab CI
```
Create a .gitlab-ci.yml file that:
- Defines stages: test, build, deploy
- Runs tests with coverage
- Builds Docker image
- Pushes to container registry
- Deploys to staging on main branch
```

---

## 💡 Pro Tips

### Better Prompts = Better Results

**Don't over-specify!** Let AI think for you:

❌ **Over-specified**: "Add tests for empty string, null, undefined, spaces..."

✅ **Let AI think**: "Generate comprehensive tests with edge cases"

✅ **Even better**: "What edge cases should I test for this function?"

### The Power of Open-Ended Prompts

| Instead of... | Try... |
|---------------|--------|
| "Test these 5 cases: ..." | "Generate thorough tests with edge cases" |
| "Create a DTO with these fields: ..." | "Create DTOs for this endpoint with proper validation" |
| "Handle these errors: ..." | "Add comprehensive error handling" |

> **Why?** AI assistants often think of edge cases you'd miss!

### Iterate and Refine

1. Start with a basic prompt
2. Review the output
3. Ask for improvements: "Add more edge cases for..."
4. Request fixes: "The test for X should actually..."

### Use Context

- Open relevant files before prompting
- Reference specific functions or lines
- Describe the expected behavior

### Learn from Failures

When tests fail, ask Copilot:
```
This test is failing because [describe issue].
Fix the function to handle this case correctly.
```
