/**
 * Unit tests for the core (pure) text-analysis functions.
 *
 * These tests focus on the “main functionality” of the app without
 * exercising HTTP routes (those are covered in integration tests).
 */

// Created by AI Agent

const {
  countWords,
  countSentences,
  countCharacters,
  calculateReadingTime,
  toSlug,
  convertCase,
  reverseText,
  isValidEmail,
  isValidUrl,
  containsProfanity,
  analyzeLocalSentiment,
  analyzeSentiment,
} = require('../../src/index');

describe('core text statistics', () => {
  describe('countWords (current behavior)', () => {
    test('returns 0 for empty/falsy inputs', () => {
      expect(countWords('')).toBe(0);
      expect(countWords(null)).toBe(0);
      expect(countWords(undefined)).toBe(0);
      expect(countWords(false)).toBe(0);
      expect(countWords(0)).toBe(0);
    });

    test('counts words separated by a single space', () => {
      expect(countWords('hello')).toBe(1);
      expect(countWords('hello world')).toBe(2);
      expect(countWords('hello world again')).toBe(3);
    });

    test('counts empty tokens when there are leading/trailing/multiple spaces (known bug)', () => {
      expect(countWords('hello  world')).toBe(3);
      expect(countWords('  hello world')).toBe(4);
      expect(countWords('hello world  ')).toBe(4);
      expect(countWords('   ')).toBe(4);
    });

    test('does not treat tabs/newlines as separators (current behavior)', () => {
      expect(countWords('hello\tworld')).toBe(1);
      expect(countWords('hello\nworld')).toBe(1);
      expect(countWords('hello\r\nworld')).toBe(1);
    });

    test('handles unicode separated by spaces', () => {
      expect(countWords('שלום עולם')).toBe(2);
      expect(countWords('こんにちは 世界')).toBe(2);
    });

    test('throws TypeError for truthy non-string inputs', () => {
      expect(() => countWords({})).toThrow(TypeError);
      expect(() => countWords([])).toThrow(TypeError);
      expect(() => countWords(123)).toThrow(TypeError);
    });

    // Desired behavior tests (kept for workshop; enable once countWords is fixed)
    test.todo('treats multiple whitespace (spaces/tabs/newlines) as single separators');
    test.todo('ignores leading/trailing whitespace');
  });

  describe('countSentences (current behavior)', () => {
    test('returns 0 for empty/falsy', () => {
      expect(countSentences('')).toBe(0);
      expect(countSentences(null)).toBe(0);
    });

    test('splits on periods (naive)', () => {
      expect(countSentences('Hello world.')).toBe(2); // ['Hello world', '']
      expect(countSentences('Hello. World. Test.')).toBe(4);
      expect(countSentences('No periods here')).toBe(1);
    });
  });

  describe('countCharacters', () => {
    test('returns 0 for empty/falsy', () => {
      expect(countCharacters('')).toBe(0);
      expect(countCharacters(null)).toBe(0);
    });

    test('counts with spaces by default', () => {
      expect(countCharacters('a b')).toBe(3);
    });

    test('excludes all whitespace when includeSpaces=false', () => {
      expect(countCharacters('a b', false)).toBe(2);
      expect(countCharacters('a\tb\nc', false)).toBe(3);
    });
  });

  describe('calculateReadingTime', () => {
    test('rounds up to the nearest minute (based on countWords)', () => {
      expect(calculateReadingTime('')).toBe(0);
      expect(calculateReadingTime('hello')).toBe(1);

      const twoHundredWords = new Array(200).fill('w').join(' ');
      expect(calculateReadingTime(twoHundredWords)).toBe(1);

      const twoHundredOneWords = new Array(201).fill('w').join(' ');
      expect(calculateReadingTime(twoHundredOneWords)).toBe(2);
    });
  });
});

describe('core text transformations', () => {
  describe('toSlug', () => {
    test('returns empty string for empty/falsy', () => {
      expect(toSlug('')).toBe('');
      expect(toSlug(null)).toBe('');
    });

    test('lowercases and replaces non-alphanumerics with hyphens', () => {
      expect(toSlug('Hello world')).toBe('hello-world');
      expect(toSlug('  Hello, world!!  ')).toBe('hello-world');
      expect(toSlug('API v2: status=OK')).toBe('api-v2-status-ok');
    });
  });

  describe('convertCase', () => {
    test('returns empty string for empty/falsy', () => {
      expect(convertCase('', 'upper')).toBe('');
      expect(convertCase(null, 'lower')).toBe('');
    });

    test('upper', () => {
      expect(convertCase('Hello world', 'upper')).toBe('HELLO WORLD');
    });

    test('lower', () => {
      expect(convertCase('Hello World', 'lower')).toBe('hello world');
    });

    test('title (space-splitting naive)', () => {
      expect(convertCase('hello world', 'title')).toBe('Hello World');
      expect(convertCase('hello  world', 'title')).toBe('Hello  World');
    });

    test('camel (space-splitting naive)', () => {
      expect(convertCase('hello world', 'camel')).toBe('helloWorld');
      expect(convertCase('Hello WORLD', 'camel')).toBe('helloWorld');
    });

    test('default returns original', () => {
      expect(convertCase('Hello world', 'unknown')).toBe('Hello world');
    });
  });

  describe('reverseText', () => {
    test('returns empty string for empty/falsy', () => {
      expect(reverseText('')).toBe('');
      expect(reverseText(null)).toBe('');
    });

    test('reverses text', () => {
      expect(reverseText('abc')).toBe('cba');
      expect(reverseText('a b')).toBe('b a');
    });
  });
});

describe('core validation + sentiment', () => {
  describe('isValidEmail', () => {
    test('valid emails', () => {
      expect(isValidEmail('a@b.com')).toBe(true);
      expect(isValidEmail('first.last+tag@sub.example.co')).toBe(true);
    });

    test('invalid emails', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('not-an-email')).toBe(false);
      expect(isValidEmail('a@b')).toBe(false);
      expect(isValidEmail('a@b.')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    test('valid urls', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000/path?q=1')).toBe(true);
    });

    test('invalid urls', () => {
      expect(isValidUrl('not a url')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });
  });

  describe('containsProfanity', () => {
    test('returns false for empty/falsy', () => {
      expect(containsProfanity('')).toBe(false);
      expect(containsProfanity(null)).toBe(false);
    });

    test('detects profane substrings (current behavior)', () => {
      expect(containsProfanity('This has badword1 in it')).toBe(true);
      expect(containsProfanity('OFFENSIVE content')).toBe(true);
    });

    test('returns false when no profane words present', () => {
      expect(containsProfanity('clean text')).toBe(false);
    });
  });

  describe('analyzeLocalSentiment', () => {
    test('returns neutral for empty-ish text', () => {
      const result = analyzeLocalSentiment('');
      expect(result.sentiment).toBe('neutral');
      expect(result.score).toBe(0);
      expect(result.source).toBe('local');
    });

    test('detects positive sentiment and returns matched words', () => {
      const result = analyzeLocalSentiment('Amazing, wonderful, great!');
      expect(result.sentiment).toBe('positive');
      expect(result.score).toBeGreaterThan(0);
      expect(result.matchedWords.positive).toEqual(expect.arrayContaining(['amazing', 'wonderful', 'great']));
    });

    test('detects negative sentiment', () => {
      const result = analyzeLocalSentiment('This is terrible and awful. Avoid.');
      expect(result.sentiment).toBe('negative');
      expect(result.score).toBeLessThan(0);
      expect(result.matchedWords.negative).toEqual(expect.arrayContaining(['terrible', 'awful', 'avoid']));
    });

    test('clamps normalized score to [-1, 1]', () => {
      const veryPositive = analyzeLocalSentiment('good great excellent amazing wonderful fantastic perfect awesome superb brilliant');
      expect(veryPositive.score).toBeLessThanOrEqual(1);

      const veryNegative = analyzeLocalSentiment('bad terrible awful horrible worst useless waste pathetic disgusting regret avoid');
      expect(veryNegative.score).toBeGreaterThanOrEqual(-1);
    });
  });

  describe('analyzeSentiment (async wrapper)', () => {
    test('resolves to local sentiment object', async () => {
      const result = await analyzeSentiment('I love this, it is great!');
      expect(result).toHaveProperty('source', 'local');
      expect(result).toHaveProperty('sentiment');
      expect(result).toHaveProperty('score');
    });
  });
});
