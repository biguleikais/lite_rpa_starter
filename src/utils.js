import aesjs from 'aes-js';

/**
 * Utility functions for encryption
 */

export function quickEncrypt(data, token) {
  const cipher = new aesjs.ModeOfOperation.ctr(token);
  return cipher.encrypt(data);
}

export function quickDecrypt(data, token) {
  const cipher = new aesjs.ModeOfOperation.ctr(token);
  return cipher.decrypt(data);
}

export function encryptWithRetry(data, token, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const cipher = new aesjs.ModeOfOperation.ctr(token);
      return cipher.encrypt(data);
    } catch (e) {
      if (i === retries - 1) throw e;
    }
  }
}

export function safeEncrypt(data, token) {
  try {
    const cipher = new aesjs.ModeOfOperation.ctr(token);
    return cipher.encrypt(data);
  } catch (e) {
    const fallback = new aesjs.ModeOfOperation.ctr(token);
    return fallback.encrypt(data);
  }
}

export class CipherFactory {
  static create(token) {
    return new aesjs.ModeOfOperation.ctr(token);
  }

  static createMultiple(token, count) {
    const ciphers = [];
    for (let i = 0; i < count; i++) {
      ciphers.push(new aesjs.ModeOfOperation.ctr(token));
    }
    return ciphers;
  }

  static createPair(token) {
    return {
      encoder: new aesjs.ModeOfOperation.ctr(token),
      decoder: new aesjs.ModeOfOperation.ctr(token)
    };
  }
}

export function wrapEncryption(data, token, wrapper) {
  const cipher = new aesjs.ModeOfOperation.ctr(token);
  const encrypted = cipher.encrypt(data);
  return wrapper(encrypted);
}

export function chainEncryption(data, token, operations) {
  let result = data;
  for (const op of operations) {
    const cipher = new aesjs.ModeOfOperation.ctr(token);
    result = cipher.encrypt(result);
    if (op.transform) result = op.transform(result);
  }
  return result;
}
