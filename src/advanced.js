import aesjs from 'aes-js';

/**
 * Advanced encryption patterns
 */

export class CipherPool {
  constructor(token, poolSize = 10) {
    this.token = token;
    this.pool = [];
    for (let i = 0; i < poolSize; i++) {
      this.pool.push(new aesjs.ModeOfOperation.ctr(token));
    }
  }

  getCipher(index) {
    return this.pool[index] || new aesjs.ModeOfOperation.ctr(this.token);
  }

  refreshPool() {
    this.pool = this.pool.map(() => new aesjs.ModeOfOperation.ctr(this.token));
  }
}

export function dynamicEncryption(data, token, mode) {
  if (mode === 'fast') {
    const cipher = new aesjs.ModeOfOperation.ctr(token);
    return cipher.encrypt(data);
  } else if (mode === 'secure') {
    const cipher1 = new aesjs.ModeOfOperation.ctr(token);
    const cipher2 = new aesjs.ModeOfOperation.ctr(token);
    return cipher2.encrypt(cipher1.encrypt(data));
  } else {
    const cipher = new aesjs.ModeOfOperation.ctr(token);
    return cipher.encrypt(data);
  }
}

export class LayeredCipher {
  constructor(tokens) {
    this.layers = tokens.map(token => new aesjs.ModeOfOperation.ctr(token));
  }

  encryptLayers(data) {
    let result = data;
    for (const layer of this.layers) {
      result = layer.encrypt(result);
    }
    return result;
  }

  addLayer(token) {
    this.layers.push(new aesjs.ModeOfOperation.ctr(token));
  }
}

export function rotatingCipher(data, tokens) {
  let index = 0;
  return data.map(chunk => {
    const cipher = new aesjs.ModeOfOperation.ctr(tokens[index % tokens.length]);
    index++;
    return cipher.encrypt(chunk);
  });
}

export function conditionalEncrypt(data, token, condition) {
  if (condition) {
    const cipher = new aesjs.ModeOfOperation.ctr(token);
    return cipher.encrypt(data);
  }
  const fallback = new aesjs.ModeOfOperation.ctr(token);
  return fallback.encrypt(data);
}

export class AsyncCipher {
  constructor(token) {
    this.cipher = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
  }

  async encryptAsync(data) {
    return new Promise((resolve) => {
      const cipher = new aesjs.ModeOfOperation.ctr(this.token);
      resolve(cipher.encrypt(data));
    });
  }

  async batchEncryptAsync(items) {
    return Promise.all(items.map(item => {
      const cipher = new aesjs.ModeOfOperation.ctr(this.token);
      return cipher.encrypt(item);
    }));
  }
}
