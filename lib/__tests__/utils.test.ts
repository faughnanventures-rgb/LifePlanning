import {
  cn,
  formatCurrency,
  formatDate,
  formatRelativeTime,
  truncate,
  capitalize,
  snakeToTitle,
  generateTempId,
  isServer,
  isClient,
  safeJsonParse,
  removeUndefined,
} from '@/lib/utils';

describe('Utility Functions', () => {
  describe('cn (className merge)', () => {
    it('should merge class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should handle conditional classes', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
    });

    it('should merge Tailwind classes correctly', () => {
      expect(cn('px-4', 'px-6')).toBe('px-6');
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });
  });

  describe('formatCurrency', () => {
    it('should format cents to dollars', () => {
      expect(formatCurrency(10000)).toBe('$100');
      expect(formatCurrency(150050)).toBe('$1,501');
    });

    it('should handle null/undefined', () => {
      expect(formatCurrency(null)).toBe('-');
      expect(formatCurrency(undefined)).toBe('-');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('$0');
    });
  });

  describe('formatDate', () => {
    it('should format date string', () => {
      const result = formatDate('2024-01-15');
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });

    it('should handle null/undefined', () => {
      expect(formatDate(null)).toBe('-');
      expect(formatDate(undefined)).toBe('-');
    });

    it('should accept custom options', () => {
      const result = formatDate('2024-01-15', { month: 'long' });
      expect(result).toContain('January');
    });
  });

  describe('formatRelativeTime', () => {
    it('should show "just now" for recent times', () => {
      const now = new Date();
      expect(formatRelativeTime(now)).toBe('just now');
    });

    it('should show minutes ago', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      expect(formatRelativeTime(fiveMinutesAgo)).toBe('5 minutes ago');
    });

    it('should show hours ago', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      expect(formatRelativeTime(twoHoursAgo)).toBe('2 hours ago');
    });

    it('should show days ago', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(threeDaysAgo)).toBe('3 days ago');
    });

    it('should handle singular forms', () => {
      const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);
      expect(formatRelativeTime(oneMinuteAgo)).toBe('1 minute ago');

      const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000);
      expect(formatRelativeTime(oneHourAgo)).toBe('1 hour ago');

      const oneDayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(oneDayAgo)).toBe('1 day ago');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('Hello World', 8)).toBe('Hello...');
    });

    it('should not truncate short strings', () => {
      expect(truncate('Hi', 10)).toBe('Hi');
    });

    it('should handle exact length', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle already capitalized', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });
  });

  describe('snakeToTitle', () => {
    it('should convert snake_case to Title Case', () => {
      expect(snakeToTitle('hello_world')).toBe('Hello World');
      expect(snakeToTitle('in_progress')).toBe('In Progress');
    });

    it('should handle single word', () => {
      expect(snakeToTitle('draft')).toBe('Draft');
    });
  });

  describe('generateTempId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateTempId();
      const id2 = generateTempId();
      expect(id1).not.toBe(id2);
    });

    it('should start with temp-', () => {
      const id = generateTempId();
      expect(id.startsWith('temp-')).toBe(true);
    });
  });

  describe('isServer and isClient', () => {
    it('should detect server environment', () => {
      // In Jest (Node), window is undefined by default
      // but jsdom may define it
      expect(typeof isServer()).toBe('boolean');
      expect(typeof isClient()).toBe('boolean');
      expect(isServer()).not.toBe(isClient());
    });
  });

  describe('safeJsonParse', () => {
    it('should parse valid JSON', () => {
      expect(safeJsonParse('{"name":"test"}', {})).toEqual({ name: 'test' });
    });

    it('should return fallback for invalid JSON', () => {
      expect(safeJsonParse('invalid', { default: true })).toEqual({ default: true });
    });

    it('should return fallback for empty string', () => {
      expect(safeJsonParse('', [])).toEqual([]);
    });
  });

  describe('removeUndefined', () => {
    it('should remove undefined values', () => {
      const obj = { a: 1, b: undefined, c: 'test' };
      expect(removeUndefined(obj)).toEqual({ a: 1, c: 'test' });
    });

    it('should keep null values', () => {
      const obj = { a: 1, b: null, c: undefined };
      expect(removeUndefined(obj)).toEqual({ a: 1, b: null });
    });

    it('should handle empty object', () => {
      expect(removeUndefined({})).toEqual({});
    });
  });
});
