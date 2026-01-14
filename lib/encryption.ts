import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

// ===========================================
// Application-Layer Encryption
// ===========================================
// Encrypts sensitive fields BEFORE storing in database
// Uses AES-256-GCM for authenticated encryption
//
// IMPORTANT: This runs SERVER-SIDE ONLY
// Never import this in client components
// ===========================================

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;

/**
 * Get encryption key from environment
 * Key should be 64 hex characters (32 bytes)
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  
  if (!key) {
    throw new Error(
      'ENCRYPTION_KEY environment variable is not set. ' +
      'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
  }
  
  if (key.length !== 64) {
    throw new Error(
      'ENCRYPTION_KEY must be 64 hex characters (32 bytes). ' +
      'Current length: ' + key.length
    );
  }
  
  return Buffer.from(key, 'hex');
}

/**
 * Encrypt a string value
 * Returns base64-encoded string containing: salt + iv + authTag + ciphertext
 * 
 * @param plaintext - The string to encrypt
 * @returns Encrypted string (base64)
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) {
    return '';
  }
  
  const key = getEncryptionKey();
  
  // Generate random IV for each encryption
  const iv = randomBytes(IV_LENGTH);
  
  // Generate random salt for key derivation
  const salt = randomBytes(SALT_LENGTH);
  
  // Derive a unique key for this encryption using scrypt
  const derivedKey = scryptSync(key, salt, 32);
  
  // Create cipher
  const cipher = createCipheriv(ALGORITHM, derivedKey, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  
  // Encrypt
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  
  // Get authentication tag
  const authTag = cipher.getAuthTag();
  
  // Combine: salt + iv + authTag + ciphertext
  const combined = Buffer.concat([salt, iv, authTag, encrypted]);
  
  return combined.toString('base64');
}

/**
 * Decrypt an encrypted string
 * 
 * @param encryptedData - Base64-encoded encrypted string
 * @returns Decrypted plaintext string
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData) {
    return '';
  }
  
  const key = getEncryptionKey();
  
  // Decode from base64
  const combined = Buffer.from(encryptedData, 'base64');
  
  // Extract components
  const salt = combined.subarray(0, SALT_LENGTH);
  const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const authTag = combined.subarray(
    SALT_LENGTH + IV_LENGTH,
    SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH
  );
  const ciphertext = combined.subarray(SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);
  
  // Derive the same key using the stored salt
  const derivedKey = scryptSync(key, salt, 32);
  
  // Create decipher
  const decipher = createDecipheriv(ALGORITHM, derivedKey, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  
  // Set auth tag for verification
  decipher.setAuthTag(authTag);
  
  // Decrypt
  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  
  return decrypted.toString('utf8');
}

/**
 * Safely encrypt - catches errors and returns empty string on failure
 * Use this when encryption failure shouldn't crash the app
 */
export function safeEncrypt(plaintext: string): string {
  try {
    return encrypt(plaintext);
  } catch (error) {
    console.error('Encryption failed:', error);
    return '';
  }
}

/**
 * Safely decrypt - catches errors and returns empty string on failure
 * Use this when dealing with potentially corrupted data
 */
export function safeDecrypt(encryptedData: string): string {
  try {
    return decrypt(encryptedData);
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
}

/**
 * Check if a string appears to be encrypted
 * (basic check - looks for base64 format with minimum length)
 */
export function isEncrypted(value: string): boolean {
  if (!value || value.length < 80) {
    return false;
  }
  
  // Check if it's valid base64
  const base64Regex = /^[A-Za-z0-9+/]+=*$/;
  return base64Regex.test(value);
}
