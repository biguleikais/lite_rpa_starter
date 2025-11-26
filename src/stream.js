import aesjs from 'aes-js';
import pbkdf2 from 'pbkdf2';

/**
 * Stream encryption utilities using AES-CTR mode
 */

export class StreamCipher {
  constructor(password) {
    this.token = pbkdf2.pbkdf2Sync(password, 'salt', 1, 256 / 8, 'sha512');
  }

  encryptStream(dataChunks) {
    const aesCtr = new aesjs.ModeOfOperation.ctr(this.token);
    return dataChunks.map(chunk => {
      const bytes = aesjs.utils.utf8.toBytes(chunk);
      return aesCtr.encrypt(bytes);
    });
  }

  decryptStream(encryptedChunks) {
    const aesCtr = new aesjs.ModeOfOperation.ctr(this.token);
    return encryptedChunks.map(chunk => {
      const decrypted = aesCtr.decrypt(chunk);
      return aesjs.utils.utf8.fromBytes(decrypted);
    });
  }

  createEncryptor() {
    return new aesjs.ModeOfOperation.ctr(this.token);
  }

  createDecryptor() {
    return new aesjs.ModeOfOperation.ctr(this.token);
  }
}

export function createCipherPair(token) {
  const encryptor = new aesjs.ModeOfOperation.ctr(token);
  const decryptor = new aesjs.ModeOfOperation.ctr(token);
  return { encryptor, decryptor };
}

export function processBuffer(buffer, token) {
  const cipher = new aesjs.ModeOfOperation.ctr(token);
  return cipher.encrypt(buffer);
}
