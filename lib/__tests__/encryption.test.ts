/**
 * @jest-environment node
 */
import { encrypt, decrypt, safeEncrypt, safeDecrypt, isEncrypted } from '@/lib/encryption';

// Set up test encryption key
const TEST_ENCRYPTION_KEY = 'a'.repeat(64); // Valid 64-char hex key

describe('Encryption Utility', () => {
  beforeAll(() => {
    process.env.ENCRYPTION_KEY = TEST_ENCRYPTION_KEY;
  });

  afterAll(() => {
    delete process.env.ENCRYPTION_KEY;
  });

  describe('encrypt and decrypt', () => {
    it('should encrypt and decrypt a string correctly', () => {
      const plaintext = 'Hello, World!';
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    it('should produce different ciphertext for same plaintext', () => {
      const plaintext = 'Same message';
      const encrypted1 = encrypt(plaintext);
      const encrypted2 = encrypt(plaintext);

      // Due to random IV and salt, ciphertexts should differ
      expect(encrypted1).not.toBe(encrypted2);

      // But both should decrypt to same plaintext
      expect(decrypt(encrypted1)).toBe(plaintext);
      expect(decrypt(encrypted2)).toBe(plaintext);
    });

    it('should handle empty strings', () => {
      const encrypted = encrypt('');
      expect(encrypted).toBe('');
      expect(decrypt('')).toBe('');
    });

    it('should handle special characters', () => {
      const plaintext = 'Special chars: !@#$%^&*()_+-=[]{}|;:",.<>?/`~';
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    it('should handle unicode characters', () => {
      const plaintext = 'Unicode: 你好世界 🌍 émojis café naïve';
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    it('should handle long strings', () => {
      const plaintext = 'a'.repeat(10000);
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });
  });

  describe('safeEncrypt and safeDecrypt', () => {
    it('should return empty string on encryption error', () => {
      // Temporarily remove encryption key
      const originalKey = process.env.ENCRYPTION_KEY;
      delete process.env.ENCRYPTION_KEY;

      const result = safeEncrypt('test');
      expect(result).toBe('');

      // Restore key
      process.env.ENCRYPTION_KEY = originalKey;
    });

    it('should return empty string on decryption error', () => {
      const result = safeDecrypt('invalid-encrypted-data');
      expect(result).toBe('');
    });
  });

  describe('isEncrypted', () => {
    it('should return true for encrypted strings', () => {
      const encrypted = encrypt('test message');
      expect(isEncrypted(encrypted)).toBe(true);
    });

    it('should return false for plain strings', () => {
      expect(isEncrypted('plain text')).toBe(false);
      expect(isEncrypted('')).toBe(false);
      expect(isEncrypted('short')).toBe(false);
    });

    it('should return false for invalid base64', () => {
      expect(isEncrypted('not valid base64!!')).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should throw error when encryption key is missing', () => {
      const originalKey = process.env.ENCRYPTION_KEY;
      delete process.env.ENCRYPTION_KEY;

      expect(() => encrypt('test')).toThrow('ENCRYPTION_KEY environment variable is not set');

      process.env.ENCRYPTION_KEY = originalKey;
    });

    it('should throw error when encryption key is wrong length', () => {
      const originalKey = process.env.ENCRYPTION_KEY;
      process.env.ENCRYPTION_KEY = 'too-short';

      expect(() => encrypt('test')).toThrow('ENCRYPTION_KEY must be 64 hex characters');

      process.env.ENCRYPTION_KEY = originalKey;
    });
  });
});
