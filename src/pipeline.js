import aesjs from 'aes-js';

/**
 * Encryption pipeline utilities
 */

export class EncryptionPipeline {
  constructor(token) {
    this.token = token;
  }

  stage1(data) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    return cipher.encrypt(data);
  }

  stage2(data) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    const intermediate = cipher.encrypt(data);
    return intermediate;
  }

  stage3(data) {
    const aesCtr = new aesjs.ModeOfOperation.ctr(this.token);
    return aesCtr.encrypt(data);
  }

  fullPipeline(data) {
    const cipher1 = new aesjs.ModeOfOperation.ctr(this.token);
    const cipher2 = new aesjs.ModeOfOperation.ctr(this.token);
    const cipher3 = new aesjs.ModeOfOperation.ctr(this.token);

    const step1 = cipher1.encrypt(data);
    const step2 = cipher2.encrypt(step1);
    return cipher3.encrypt(step2);
  }
}

export function pipelineProcess(input, token) {
  const firstPass = new aesjs.ModeOfOperation.ctr(token);
  const secondPass = new aesjs.ModeOfOperation.ctr(token);

  const result1 = firstPass.encrypt(input);
  return secondPass.encrypt(result1);
}

export function multiStageEncrypt(data, token, stages) {
  let result = data;
  for (let i = 0; i < stages; i++) {
    const cipher = new aesjs.ModeOfOperation.ctr(token);
    result = cipher.encrypt(result);
  }
  return result;
}

export function transformData(input, token) {
  const transform1 = new aesjs.ModeOfOperation.ctr(token);
  const transform2 = new aesjs.ModeOfOperation.ctr(token);

  return {
    first: transform1.encrypt(input),
    second: transform2.encrypt(input)
  };
}
