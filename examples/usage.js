import { aesEncrypt, aesDecrypt, isEncrypted, encryptIfNeeded, decryptIfNeeded } from '../src/index.js';

console.log('=== RPA Lite - AES-CTR Encryption Examples ===\n');

const password = 'my-secret-password';
const sensitiveData = 'This is sensitive information';

// Basic encryption
console.log('1. Basic Encryption:');
console.log('Original:', sensitiveData);
const encrypted = aesEncrypt(sensitiveData, password);
console.log('Encrypted:', encrypted);
console.log('Is Encrypted?', isEncrypted(encrypted));
console.log();

// Basic decryption
console.log('2. Basic Decryption:');
const decrypted = aesDecrypt(encrypted, password);
console.log('Decrypted:', decrypted);
console.log('Match:', sensitiveData === decrypted);
console.log();

// Conditional encryption
console.log('3. Conditional Encryption (encryptIfNeeded):');
const plainText = 'Not encrypted yet';
const firstEncrypt = encryptIfNeeded(plainText, password);
console.log('First call (plain):', firstEncrypt);
const secondEncrypt = encryptIfNeeded(firstEncrypt, password);
console.log('Second call (already encrypted):', secondEncrypt);
console.log('Same result:', firstEncrypt === secondEncrypt);
console.log();

// Conditional decryption
console.log('4. Conditional Decryption (decryptIfNeeded):');
const encryptedText = aesEncrypt('Secret data', password);
const firstDecrypt = decryptIfNeeded(encryptedText, password);
console.log('First call (encrypted):', firstDecrypt);
const secondDecrypt = decryptIfNeeded(firstDecrypt, password);
console.log('Second call (already plain):', secondDecrypt);
console.log('Same result:', firstDecrypt === secondDecrypt);
console.log();

// Wrong password handling
console.log('5. Wrong Password Handling:');
try {
  const wrongDecrypt = aesDecrypt(encrypted, 'wrong-password');
  console.log('Decrypted:', wrongDecrypt);
} catch (error) {
  console.log('Error caught:', error.message);
}
console.log();

// Multiple encryptions
console.log('6. Multiple Values:');
const values = ['user123', 'pass456', 'api-key-789'];
const encryptedValues = values.map(v => aesEncrypt(v, password));
console.log('Original:', values);
console.log('Encrypted:', encryptedValues);
const decryptedValues = encryptedValues.map(v => aesDecrypt(v, password));
console.log('Decrypted:', decryptedValues);
console.log('All match:', JSON.stringify(values) === JSON.stringify(decryptedValues));
