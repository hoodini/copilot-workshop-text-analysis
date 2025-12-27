/**
 * Text Analysis Service - Legacy Version
 * 
 * This is a "before" state for the workshop.
 * The code intentionally has areas for improvement:
 * - No proper structure (can be refactored to NestJS)
 * - No tests
 * - No documentation
 * - Suboptimal algorithms
 * - No Docker support
 * - No logging
 * - Mixed concerns
 */

const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.json());

// Serve static files (UI)
app.use(express.static(path.join(__dirname, '../public')));

const PORT = process.env.PORT || 3000;

// ============================================
// TEXT STATISTICS - Good for UNIT TESTING
// ============================================

// Count words in text - has edge case bugs!
function countWords(text) {
  if (!text) return 0;
  return text.split(' ').length;
}

// Count sentences - naive implementation
function countSentences(text) {
  if (!text) return 0;
  return text.split('.').length;
}

// Count characters (with/without spaces)
function countCharacters(text, includeSpaces = true) {
  if (!text) return 0;
  if (includeSpaces) {
    return text.length;
  }
  return text.replace(/\s/g, '').length;
}

// Calculate reading time (average 200 words per minute)
function calculateReadingTime(text) {
  const words = countWords(text);
  return Math.ceil(words / 200);
}

// Find most frequent word - SUBOPTIMAL ALGORITHM (good for optimization demo)
function findMostFrequentWord(text) {
  if (!text) return null;
  
  const words = text.toLowerCase().split(' ');
  let maxCount = 0;
  let mostFrequent = null;
  
  // O(n²) - intentionally inefficient for optimization demo
  for (let i = 0; i < words.length; i++) {
    let count = 0;
    for (let j = 0; j < words.length; j++) {
      if (words[i] === words[j]) {
        count++;
      }
    }
    if (count > maxCount) {
      maxCount = count;
      mostFrequent = words[i];
    }
  }
  
  return { word: mostFrequent, count: maxCount };
}

// ============================================
// TEXT TRANSFORMATION
// ============================================

// Convert to slug
function toSlug(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Convert case
function convertCase(text, targetCase) {
  if (!text) return '';
  
  switch (targetCase) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return text.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    case 'camel':
      return text.split(' ').map((word, index) => 
        index === 0 
          ? word.toLowerCase() 
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join('');
    default:
      return text;
  }
}

// Reverse text
function reverseText(text) {
  if (!text) return '';
  return text.split('').reverse().join('');
}

// Check if palindrome - has bugs with spaces and case!
function isPalindrome(text) {
  if (!text) return false;
  const reversed = reverseText(text);
  return text === reversed;
}

// ============================================
// TEXT VALIDATION
// ============================================

// Validate email - basic regex
function isValidEmail(text) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(text);
}

// Validate URL
function isValidUrl(text) {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}

// Check for profanity (simple word list - good for unit testing)
function containsProfanity(text) {
  if (!text) return false;
  const profanityList = ['badword1', 'badword2', 'offensive'];
  const lowerText = text.toLowerCase();
  return profanityList.some(word => lowerText.includes(word));
}

// ============================================
// EXTERNAL API INTEGRATION - Good for INTEGRATION TESTING
// ============================================

// Configuration for external APIs (can be overridden in tests)
const API_CONFIG = {
  // Using free translation API (no key required)
  translateApi: process.env.TRANSLATE_API_URL || 'https://api.mymemory.translated.net/get',
  timeout: parseInt(process.env.API_TIMEOUT) || 5000
};

/**
 * Analyze sentiment of text
 * Uses a simple but effective word-based analysis
 * 
 * In a real production app, you'd integrate with:
 * - OpenAI API (paid)
 * - Google Cloud Natural Language (paid) 
 * - AWS Comprehend (paid)
 * - Hugging Face Inference API (has free tier)
 * 
 * For this workshop, we use local analysis to avoid API key requirements
 * 
 * @param {string} text - Text to analyze
 * @returns {Promise<{score: number, sentiment: string}>}
 */
async function analyzeSentiment(text) {
  // Simulate async behavior (like a real API call would have)
  return new Promise((resolve) => {
    // Small delay to simulate network latency
    setTimeout(() => {
      resolve(analyzeLocalSentiment(text));
    }, 50);
  });
}

/**
 * Local sentiment analysis using word matching
 * 
 * This is intentionally simple for the workshop.
 * Workshop exercise: Ask Copilot to improve this algorithm!
 * 
 * Improvements participants could make:
 * - Add more words
 * - Handle negation ("not good" → negative)
 * - Use word stemming
 * - Add intensity modifiers ("very good" → more positive)
 */
function analyzeLocalSentiment(text) {
  const positiveWords = [
    'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 
    'love', 'happy', 'best', 'awesome', 'perfect', 'beautiful', 
    'brilliant', 'outstanding', 'superb', 'delightful', 'pleased',
    'recommend', 'impressed', 'exceeded', 'incredible', 'loving'
  ];
  
  const negativeWords = [
    'bad', 'terrible', 'awful', 'horrible', 'hate', 'sad', 'angry', 
    'disappointed', 'worst', 'poor', 'broken', 'useless', 'waste',
    'frustrating', 'annoying', 'disgusting', 'pathetic', 'regret',
    'disappointing', 'mediocre', 'overpriced', 'avoid'
  ];
  
  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  let matches = { positive: [], negative: [] };
  
  words.forEach(word => {
    // Remove punctuation for matching
    const cleanWord = word.replace(/[^a-z]/g, '');
    if (positiveWords.includes(cleanWord)) {
      score++;
      matches.positive.push(cleanWord);
    }
    if (negativeWords.includes(cleanWord)) {
      score--;
      matches.negative.push(cleanWord);
    }
  });
  
  // Normalize score to -1 to 1 range
  const normalizedScore = Math.max(-1, Math.min(1, score / 5));
  
  return {
    score: normalizedScore,
    sentiment: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral',
    source: 'local',
    matchedWords: matches
  };
}

/**
 * Translate text using MyMemory API (free, no API key needed)
 * 
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code (e.g., 'es', 'fr', 'he')
 * @returns {Promise<{translatedText: string, source: string, target: string}>}
 */
async function translateText(text, targetLanguage) {
  try {
    // MyMemory Translation API - completely free, no API key required
    const response = await axios.get(API_CONFIG.translateApi, {
      params: {
        q: text.substring(0, 500), // API has text limit
        langpair: `en|${targetLanguage}`
      },
      timeout: API_CONFIG.timeout
    });
    
    if (response.data.responseStatus === 200) {
      return {
        translatedText: response.data.responseData.translatedText,
        source: 'en',
        target: targetLanguage,
        match: response.data.responseData.match,
        apiSource: 'mymemory'
      };
    }
    
    throw new Error('Translation failed');
  } catch (error) {
    return {
      error: 'Translation service unavailable',
      message: error.message,
      original: text,
      targetLanguage
    };
  }
}

// ============================================
// API ROUTES
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get text statistics
app.post('/analyze/stats', (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  
  res.json({
    wordCount: countWords(text),
    sentenceCount: countSentences(text),
    characterCount: countCharacters(text),
    characterCountNoSpaces: countCharacters(text, false),
    readingTimeMinutes: calculateReadingTime(text),
    mostFrequentWord: findMostFrequentWord(text)
  });
});

// Transform text
app.post('/transform', (req, res) => {
  const { text, operation, options } = req.body;
  
  if (!text || !operation) {
    return res.status(400).json({ error: 'Text and operation are required' });
  }
  
  let result;
  
  switch (operation) {
    case 'slug':
      result = toSlug(text);
      break;
    case 'case':
      result = convertCase(text, options?.targetCase || 'lower');
      break;
    case 'reverse':
      result = reverseText(text);
      break;
    default:
      return res.status(400).json({ error: 'Invalid operation' });
  }
  
  res.json({ original: text, result, operation });
});

// Validate text
app.post('/validate', (req, res) => {
  const { text, type } = req.body;
  
  if (!text || !type) {
    return res.status(400).json({ error: 'Text and type are required' });
  }
  
  let isValid;
  
  switch (type) {
    case 'email':
      isValid = isValidEmail(text);
      break;
    case 'url':
      isValid = isValidUrl(text);
      break;
    case 'palindrome':
      isValid = isPalindrome(text);
      break;
    case 'profanity':
      isValid = !containsProfanity(text);
      break;
    default:
      return res.status(400).json({ error: 'Invalid validation type' });
  }
  
  res.json({ text, type, isValid });
});

// Sentiment analysis
app.post('/analyze/sentiment', async (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  
  const sentiment = await analyzeSentiment(text);
  res.json({ text, ...sentiment });
});

// Translation
app.post('/translate', async (req, res) => {
  const { text, targetLanguage } = req.body;
  
  if (!text || !targetLanguage) {
    return res.status(400).json({ error: 'Text and targetLanguage are required' });
  }
  
  const translation = await translateText(text, targetLanguage);
  res.json(translation);
});

// Start server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = {
  // Export functions for testing
  countWords,
  countSentences,
  countCharacters,
  calculateReadingTime,
  findMostFrequentWord,
  toSlug,
  convertCase,
  reverseText,
  isPalindrome,
  isValidEmail,
  isValidUrl,
  containsProfanity,
  analyzeSentiment,
  analyzeLocalSentiment,
  translateText,
  app,
  API_CONFIG
};
