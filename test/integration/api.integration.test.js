/**
 * Integration Tests - API Endpoints with External Service Mocking
 * 
 * This file demonstrates:
 * 1. Testing API endpoints with Supertest
 * 2. Mocking external APIs with Nock
 * 3. Testing fallback behavior when external services fail
 * 
 * Workshop Exercise: Expand these tests using GitHub Copilot!
 */

const request = require('supertest');
const nock = require('nock');
const { app, API_CONFIG } = require('../../src/index');

describe('Integration Tests - Text Analysis API', () => {
  
  // Clean up nock after each test
  afterEach(() => {
    nock.cleanAll();
  });

  // ==========================================
  // Basic Endpoint Tests (No External APIs)
  // ==========================================
  
  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('ok');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('POST /analyze/stats', () => {
    it('should return text statistics for valid input', async () => {
      const response = await request(app)
        .post('/analyze/stats')
        .send({ text: 'Hello world. This is a test.' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.wordCount).toBeGreaterThan(0);
      expect(response.body.sentenceCount).toBeGreaterThan(0);
      expect(response.body.characterCount).toBeGreaterThan(0);
    });

    it('should return 400 when text is missing', async () => {
      const response = await request(app)
        .post('/analyze/stats')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Text is required');
    });
  });

  // ==========================================
  // External API Integration Tests with Mocking
  // ==========================================

  describe('POST /analyze/sentiment - External API Integration', () => {
    
    it('should use external API when available', async () => {
      // Mock the external sentiment API
      nock('https://api.api-ninjas.com')
        .get('/v1/sentiment')
        .query(true) // Match any query params
        .reply(200, {
          sentiment: 'POSITIVE',
          score: 0.85
        });

      const response = await request(app)
        .post('/analyze/sentiment')
        .send({ text: 'This is amazing!' })
        .expect(200);

      expect(response.body.sentiment).toBe('positive');
      expect(response.body.source).toBe('api');
    });

    it('should fallback to local analysis when API fails', async () => {
      // Mock API to return error
      nock('https://api.api-ninjas.com')
        .get('/v1/sentiment')
        .query(true)
        .replyWithError('Service unavailable');

      const response = await request(app)
        .post('/analyze/sentiment')
        .send({ text: 'This is great and wonderful!' })
        .expect(200);

      // Should still return a result using local fallback
      expect(response.body.sentiment).toBeDefined();
      expect(response.body.source).toBe('local');
    });

    it('should fallback when API times out', async () => {
      // Mock API timeout
      nock('https://api.api-ninjas.com')
        .get('/v1/sentiment')
        .query(true)
        .delay(10000) // Delay longer than timeout
        .reply(200, { sentiment: 'POSITIVE' });

      const response = await request(app)
        .post('/analyze/sentiment')
        .send({ text: 'This is terrible and awful!' })
        .expect(200);

      // Should use local fallback due to timeout
      expect(response.body.sentiment).toBe('negative');
      expect(response.body.source).toBe('local');
    }, 15000); // Increase test timeout

    it('should return 400 when text is missing', async () => {
      const response = await request(app)
        .post('/analyze/sentiment')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Text is required');
    });
  });

  describe('POST /translate - External API Integration', () => {
    
    it('should translate text when API is available', async () => {
      // Mock MyMemory Translation API
      nock('https://api.mymemory.translated.net')
        .get('/get')
        .query(true)
        .reply(200, {
          responseStatus: 200,
          responseData: {
            translatedText: 'Hola mundo',
            match: 1.0
          }
        });

      const response = await request(app)
        .post('/translate')
        .send({ text: 'Hello world', targetLanguage: 'es' })
        .expect(200);

      expect(response.body.translatedText).toBe('Hola mundo');
      expect(response.body.target).toBe('es');
    });

    it('should return error when translation API fails', async () => {
      nock('https://api.mymemory.translated.net')
        .get('/get')
        .query(true)
        .replyWithError('Network error');

      const response = await request(app)
        .post('/translate')
        .send({ text: 'Hello', targetLanguage: 'fr' })
        .expect(200);

      expect(response.body.error).toBe('Translation service unavailable');
      expect(response.body.original).toBe('Hello');
    });
  });

  // ==========================================
  // TODO: Workshop participants add more tests!
  // ==========================================
  
  // Exercise: Add tests for POST /transform endpoint
  // Exercise: Add tests for POST /validate endpoint  
  // Exercise: Add tests that reveal the bugs (multiple spaces, palindrome case sensitivity)
});
