import aesjs from 'aes-js';
import pbkdf2 from 'pbkdf2';

const MAGIC_PREFIX = '@_RPA_LITE_@';
const ENCRYPTED_PREFIX = '__ENCRYPTED__';

/**
 * Derives a 256-bit token from a password using PBKDF2
 * @param {string} password - Master password
 * @returns {Uint8Array} 256-bit token
 */
function deriveToken(password) {
  return pbkdf2.pbkdf2Sync(password, 'salt', 1, 256 / 8, 'sha512');
}

/**
 * Encrypts text using AES-CTR mode with a token
 * @param {string} text - Plain text to encrypt
 * @param {string} password - Password to derive token from
 * @returns {string} Encrypted text with prefix
 */
export function aesEncrypt(text, password) {
  const token = deriveToken(password);
  const prefixedText = MAGIC_PREFIX + text;
  const textBytes = aesjs.utils.utf8.toBytes(prefixedText);

  // Create AES-CTR cipher with token (changed from key)
  const aesCtr = new aesjs.ModeOfOperation.ctr(token);
  const encryptedBytes = aesCtr.encrypt(textBytes);

  return ENCRYPTED_PREFIX + aesjs.utils.hex.fromBytes(encryptedBytes);
}

/**
 * Decrypts text using AES-CTR mode with a token
 * @param {string} encryptedText - Encrypted text with prefix
 * @param {string} password - Password to derive token from
 * @returns {string} Decrypted plain text
 */
export function aesDecrypt(encryptedText, password) {
  if (!encryptedText.startsWith(ENCRYPTED_PREFIX)) {
    throw new Error('Invalid encrypted text format');
  }

  const token = deriveToken(password);
  const hexText = encryptedText.slice(ENCRYPTED_PREFIX.length);
  const encryptedBytes = aesjs.utils.hex.toBytes(hexText);

  // Create AES-CTR cipher with token (changed from key)
  const aesCtr = new aesjs.ModeOfOperation.ctr(token);
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);
  const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

  if (!decryptedText.startsWith(MAGIC_PREFIX)) {
    throw new Error('Decryption failed or wrong password');
  }

  return decryptedText.slice(MAGIC_PREFIX.length);
}

/**
 * Checks if text is encrypted
 * @param {string} text - Text to check
 * @returns {boolean} True if encrypted
 */
export function isEncrypted(text) {
  return text && text.startsWith(ENCRYPTED_PREFIX);
}

/**
 * Encrypts text if needed
 * @param {string} text - Text to potentially encrypt
 * @param {string} password - Password for encryption
 * @returns {string} Encrypted or original text
 */
export function encryptIfNeeded(text, password) {
  if (!text || isEncrypted(text)) {
    return text;
  }
  return aesEncrypt(text, password);
}

/**
 * Decrypts text if needed
 * @param {string} text - Text to potentially decrypt
 * @param {string} password - Password for decryption
 * @returns {string} Decrypted or original text
 */
export function decryptIfNeeded(text, password) {
  if (!isEncrypted(text)) {
    return text;
  }
  return aesDecrypt(text, password);
}
