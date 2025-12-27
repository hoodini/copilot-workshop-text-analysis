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
  // Sentiment Analysis Tests (Local Algorithm)
  // ==========================================

  describe('POST /analyze/sentiment - Local Analysis', () => {
    
    it('should detect positive sentiment', async () => {
      const response = await request(app)
        .post('/analyze/sentiment')
        .send({ text: 'This is amazing and wonderful!' })
        .expect(200);

      expect(response.body.sentiment).toBe('positive');
      expect(response.body.score).toBeGreaterThan(0);
      expect(response.body.source).toBe('local');
    });

    it('should detect negative sentiment', async () => {
      const response = await request(app)
        .post('/analyze/sentiment')
        .send({ text: 'This is terrible and awful!' })
        .expect(200);

      expect(response.body.sentiment).toBe('negative');
      expect(response.body.score).toBeLessThan(0);
    });

    it('should detect neutral sentiment', async () => {
      const response = await request(app)
        .post('/analyze/sentiment')
        .send({ text: 'The sky is blue.' })
        .expect(200);

      expect(response.body.sentiment).toBe('neutral');
      expect(response.body.score).toBe(0);
    });

    it('should return matched words for transparency', async () => {
      const response = await request(app)
        .post('/analyze/sentiment')
        .send({ text: 'This product is great and amazing!' })
        .expect(200);

      expect(response.body.matchedWords).toBeDefined();
      expect(response.body.matchedWords.positive).toContain('great');
      expect(response.body.matchedWords.positive).toContain('amazing');
    });

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
