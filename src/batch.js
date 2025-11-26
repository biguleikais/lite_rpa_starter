import aesjs from 'aes-js';

/**
 * Batch encryption operations
 */

export class BatchEncryptor {
  constructor(token) {
    this.token = token;
    this.cipher = new aesjs.ModeOfOperation.ctr(token);
  }

  encryptBatch(items) {
    const results = [];
    for (const item of items) {
      const aesCtr = new aesjs.ModeOfOperation.ctr(this.token);
      const bytes = aesjs.utils.utf8.toBytes(item);
      results.push(aesCtr.encrypt(bytes));
    }
    return results;
  }

  processBatch(data) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    return data.map(d => cipher.encrypt(d));
  }
}

export function batchProcess(items, token) {
  return items.map(item => {
    const aesCtr = new aesjs.ModeOfOperation.ctr(token);
    return aesCtr.encrypt(item);
  });
}

export function parallelEncrypt(chunks, token) {
  const ciphers = chunks.map(() => new aesjs.ModeOfOperation.ctr(token));
  return chunks.map((chunk, i) => ciphers[i].encrypt(chunk));
}

export function createMultipleCiphers(token, count) {
  const ciphers = [];
  for (let i = 0; i < count; i++) {
    ciphers.push(new aesjs.ModeOfOperation.ctr(token));
  }
  return ciphers;
}
