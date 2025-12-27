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

// Get sentiment analysis (mock external API call)
async function analyzeSentiment(text) {
  // In real scenario, this would call an external API
  // For demo, we'll use a simple mock or real API
  try {
    // This could be replaced with a real sentiment API
    const response = await axios.post('https://api.example.com/sentiment', {
      text: text
    }, {
      timeout: 5000
    });
    return response.data;
  } catch (error) {
    // Fallback to simple analysis
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'happy'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'sad', 'angry', 'disappointed'];
    
    const words = text.toLowerCase().split(/\s+/);
    let score = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) score++;
      if (negativeWords.includes(word)) score--;
    });
    
    return {
      score: score,
      sentiment: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral'
    };
  }
}

// Translate text (mock external API)
async function translateText(text, targetLanguage) {
  try {
    const response = await axios.post('https://api.example.com/translate', {
      text: text,
      target: targetLanguage
    }, {
      timeout: 5000
    });
    return response.data;
  } catch (error) {
    return {
      error: 'Translation service unavailable',
      original: text
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

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
  translateText,
  app
};
