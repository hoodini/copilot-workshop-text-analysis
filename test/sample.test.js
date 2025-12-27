/**
 * Sample test file showing expected output after Exercise 1
 * 
 * This file demonstrates what participants should generate
 * using GitHub Copilot for the countWords function.
 * 
 * NOTE: Some tests will FAIL - this is intentional!
 * It shows how tests reveal bugs in the original code.
 */

const { countWords, countSentences, isPalindrome, findMostFrequentWord } = require('../src/index');

describe('countWords', () => {
  // Basic cases
  test('returns 0 for empty string', () => {
    expect(countWords('')).toBe(0);
  });

  test('returns 0 for null', () => {
    expect(countWords(null)).toBe(0);
  });

  test('returns 0 for undefined', () => {
    expect(countWords(undefined)).toBe(0);
  });

  test('counts single word', () => {
    expect(countWords('hello')).toBe(1);
  });

  test('counts multiple words', () => {
    expect(countWords('hello world')).toBe(2);
  });

  // Edge cases - These will FAIL with current implementation!
  test('handles multiple spaces between words', () => {
    // BUG: Current implementation counts empty strings as words
    expect(countWords('hello    world')).toBe(2);
  });

  test('handles leading spaces', () => {
    expect(countWords('  hello world')).toBe(2);
  });

  test('handles trailing spaces', () => {
    expect(countWords('hello world  ')).toBe(2);
  });

  test('handles tabs', () => {
    expect(countWords('hello\tworld')).toBe(2);
  });

  test('handles newlines', () => {
    expect(countWords('hello\nworld')).toBe(2);
  });

  // Unicode
  test('handles unicode characters', () => {
    expect(countWords('שלום עולם')).toBe(2);
  });

  test('handles emojis', () => {
    expect(countWords('hello 👋 world')).toBe(3);
  });
});

describe('countSentences', () => {
  test('returns 0 for empty string', () => {
    expect(countSentences('')).toBe(0);
  });

  test('counts single sentence', () => {
    expect(countSentences('Hello world.')).toBe(1);
  });

  test('counts multiple sentences', () => {
    expect(countSentences('Hello. World. Test.')).toBe(3);
  });

  // Edge cases - May fail!
  test('handles sentence without period', () => {
    expect(countSentences('Hello world')).toBe(1);
  });

  test('handles question marks', () => {
    expect(countSentences('Hello? World!')).toBe(2);
  });

  test('handles abbreviations', () => {
    // Should not count "Dr." as sentence end
    expect(countSentences('Dr. Smith is here.')).toBe(1);
  });
});

describe('isPalindrome', () => {
  test('returns true for simple palindrome', () => {
    expect(isPalindrome('racecar')).toBe(true);
  });

  test('returns false for non-palindrome', () => {
    expect(isPalindrome('hello')).toBe(false);
  });

  // These tests will FAIL - revealing bugs!
  test('ignores case', () => {
    // BUG: Current implementation is case-sensitive
    expect(isPalindrome('RaceCar')).toBe(true);
  });

  test('ignores spaces', () => {
    // BUG: Current implementation doesn't ignore spaces
    expect(isPalindrome('race car')).toBe(true);
  });

  test('handles phrase palindrome', () => {
    // "A man a plan a canal Panama"
    expect(isPalindrome('A man a plan a canal Panama')).toBe(true);
  });

  test('returns false for empty string', () => {
    expect(isPalindrome('')).toBe(false);
  });

  test('returns true for single character', () => {
    expect(isPalindrome('a')).toBe(true);
  });
});

describe('findMostFrequentWord', () => {
  test('returns null for empty string', () => {
    expect(findMostFrequentWord('')).toBe(null);
  });

  test('finds most frequent word', () => {
    const result = findMostFrequentWord('hello world hello');
    expect(result.word).toBe('hello');
    expect(result.count).toBe(2);
  });

  test('handles tie by returning first occurrence', () => {
    const result = findMostFrequentWord('cat dog cat dog');
    expect(result.count).toBe(2);
  });

  // Edge cases
  test('ignores punctuation', () => {
    // BUG: Current implementation includes punctuation
    const result = findMostFrequentWord('hello, hello. hello!');
    expect(result.word).toBe('hello');
    expect(result.count).toBe(3);
  });

  test('is case insensitive', () => {
    const result = findMostFrequentWord('Hello HELLO hello');
    expect(result.word).toBe('hello');
    expect(result.count).toBe(3);
  });
});
