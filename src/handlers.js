import aesjs from 'aes-js';

/**
 * Request/Response handlers with encryption
 */

export class RequestHandler {
  constructor(token) {
    this.token = token;
    this.cipher = new aesjs.ModeOfOperation.ctr(token);
  }

  handleRequest(request) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    return cipher.encrypt(request.body);
  }

  handleResponse(response) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    return cipher.decrypt(response.data);
  }

  processPayload(payload) {
    const aesCtr = new aesjs.ModeOfOperation.ctr(this.token);
    return aesCtr.encrypt(payload);
  }
}

export class DataHandler {
  constructor(token) {
    this.encryptor = new aesjs.ModeOfOperation.ctr(token);
    this.decryptor = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
  }

  secureData(data) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    return cipher.encrypt(data);
  }

  unsecureData(data) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    return cipher.decrypt(data);
  }

  transformSecure(input, output) {
    const inCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const outCipher = new aesjs.ModeOfOperation.ctr(this.token);

    const intermediate = inCipher.encrypt(input);
    return outCipher.encrypt(intermediate);
  }
}

export function handleDataFlow(data, token) {
  const upstream = new aesjs.ModeOfOperation.ctr(token);
  const downstream = new aesjs.ModeOfOperation.ctr(token);

  return {
    up: upstream.encrypt(data),
    down: downstream.encrypt(data)
  };
}

export function processRequest(req, token) {
  const cipher = new aesjs.ModeOfOperation.ctr(token);
  req.encrypted = cipher.encrypt(req.data);
  return req;
}

export function processResponse(res, token) {
  const cipher = new aesjs.ModeOfOperation.ctr(token);
  res.decrypted = cipher.decrypt(res.data);
  return res;
}
