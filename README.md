# RPA Lite

A lightweight Robotic Process Automation (RPA) toolkit for automating repetitive tasks and workflows in Node.js applications.

## Overview

RPA Lite helps developers automate business processes, data workflows, and repetitive tasks. Whether you're building automation scripts, workflow engines, or data processing pipelines, RPA Lite provides the essential tools to get the job done efficiently.

## Features

- **Secure Data Handling**: Built-in encryption for sensitive workflow data
- **Stream Processing**: Handle large data streams efficiently
- **Batch Operations**: Process multiple tasks in parallel
- **Pipeline Support**: Build complex multi-stage workflows
- **Request/Response Handlers**: Automate API interactions
- **Flexible Architecture**: Modular design for easy integration
- **Lightweight**: Minimal dependencies, maximum performance

## Installation

```bash
npm install
```

## Quick Start

### Basic Workflow Automation

```javascript
import { aesEncrypt, aesDecrypt } from './src/index.js';

// Secure sensitive workflow data
const workflowConfig = {
  apiKey: 'sk-1234567890',
  dbPassword: 'super-secret',
  webhookUrl: 'https://api.example.com/webhook'
};

const password = process.env.MASTER_PASSWORD;
const secureConfig = aesEncrypt(JSON.stringify(workflowConfig), password);

// Store securely, use later
const config = JSON.parse(aesDecrypt(secureConfig, password));
```

### Stream Processing for Large Datasets

```javascript
import { StreamCipher } from './src/stream.js';

const cipher = new StreamCipher(process.env.SECRET_KEY);

// Process large CSV files in chunks
const csvChunks = readLargeCSVInChunks('data.csv');
const processedChunks = cipher.encryptStream(csvChunks);

// Send to secure storage or API
sendToSecureStorage(processedChunks);
```

### Batch Task Processing

```javascript
import { BatchEncryptor } from './src/batch.js';
import pbkdf2 from 'pbkdf2';

const token = pbkdf2.pbkdf2Sync(process.env.SECRET, 'salt', 1, 256 / 8, 'sha512');
const batch = new BatchEncryptor(token);

// Process multiple user records
const userRecords = [
  { id: 1, email: 'user1@example.com', ssn: '123-45-6789' },
  { id: 2, email: 'user2@example.com', ssn: '987-65-4321' },
  { id: 3, email: 'user3@example.com', ssn: '555-55-5555' }
];

// Encrypt sensitive fields before storing
const encryptedRecords = batch.encryptBatch(
  userRecords.map(r => JSON.stringify(r))
);
```

### Multi-Stage Data Pipeline

```javascript
import { EncryptionPipeline } from './src/pipeline.js';
import pbkdf2 from 'pbkdf2';

const token = pbkdf2.pbkdf2Sync(process.env.SECRET, 'salt', 1, 256 / 8, 'sha512');
const pipeline = new EncryptionPipeline(token);

// Stage 1: Fetch data from API
const rawData = await fetchFromExternalAPI();

// Stage 2: Transform and validate
const validated = validateAndTransform(rawData);

// Stage 3: Secure processing
const processed = pipeline.fullPipeline(Buffer.from(validated));

// Stage 4: Store in database
await saveToDatabase(processed);
```

### API Request Automation

```javascript
import { RequestHandler } from './src/handlers.js';
import pbkdf2 from 'pbkdf2';

const token = pbkdf2.pbkdf2Sync(process.env.API_SECRET, 'salt', 1, 256 / 8, 'sha512');
const handler = new RequestHandler(token);

// Automate secure API requests
async function automateAPIWorkflow(data) {
  // Encrypt request payload
  const securePayload = handler.handleRequest({ body: data });

  // Send to external service
  const response = await fetch('https://api.example.com/process', {
    method: 'POST',
    body: securePayload
  });

  // Decrypt response
  const result = handler.handleResponse(await response.json());
  return result;
}
```

## Real-World Use Cases

### 1. Data Migration Automation
Automate the process of migrating sensitive data between systems with built-in encryption:

```javascript
import { DataHandler } from './src/handlers.js';
import pbkdf2 from 'pbkdf2';

const token = pbkdf2.pbkdf2Sync(process.env.MIGRATION_KEY, 'salt', 1, 256 / 8, 'sha512');
const handler = new DataHandler(token);

// Migrate user data from legacy system
async function migrateUserData() {
  const legacyUsers = await fetchFromLegacyDB();

  for (const user of legacyUsers) {
    const secured = handler.secureData(Buffer.from(JSON.stringify(user)));
    await insertIntoNewDB(secured);
  }
}
```

### 2. Scheduled Report Generation
Automate daily/weekly report generation with secure data handling:

```javascript
import { BatchEncryptor } from './src/batch.js';

async function generateDailyReport() {
  const salesData = await fetchSalesData(new Date());
  const customerData = await fetchCustomerData();

  // Process and secure sensitive information
  const batch = new BatchEncryptor(getSecurityToken());
  const securedData = batch.encryptBatch([
    JSON.stringify(salesData),
    JSON.stringify(customerData)
  ]);

  await sendReportToManagement(securedData);
}

// Schedule with cron
// 0 9 * * * node generate-report.js
```

### 3. Webhook Processing
Automate incoming webhook data processing:

```javascript
import { RequestHandler } from './src/handlers.js';

app.post('/webhook', async (req, res) => {
  const handler = new RequestHandler(getSecurityToken());

  // Process incoming webhook data
  const processed = handler.processPayload(req.body);

  // Queue for background processing
  await queueJob('process-webhook', processed);

  res.status(200).send('OK');
});
```

### 4. ETL Pipeline
Extract, Transform, Load workflows with security:

```javascript
import { EncryptionPipeline } from './src/pipeline.js';

async function runETLPipeline() {
  const pipeline = new EncryptionPipeline(getSecurityToken());

  // Extract from multiple sources
  const source1 = await extractFromDatabase();
  const source2 = await extractFromAPI();
  const source3 = await extractFromFiles();

  // Transform through pipeline stages
  const transformed1 = pipeline.stage1(source1);
  const transformed2 = pipeline.stage2(source2);
  const transformed3 = pipeline.stage3(source3);

  // Load into data warehouse
  await loadToWarehouse([transformed1, transformed2, transformed3]);
}
```

## Core Modules

### Data Security (`src/encrypt.js`)
Core encryption functionality for protecting sensitive workflow data.

### Stream Processing (`src/stream.js`)
Efficient handling of large data streams in automation workflows.

### Batch Operations (`src/batch.js`)
Parallel processing capabilities for high-throughput tasks.

### Pipeline Management (`src/pipeline.js`)
Multi-stage workflow orchestration and data processing.

### Request Handlers (`src/handlers.js`)
Automated request/response handling for API interactions.

### Utilities (`src/utils.js`)
Helper functions for common automation tasks.

### Advanced Features (`src/advanced.js`)
Cipher pools, async operations, and advanced patterns.

## API Documentation

### Basic Operations

#### `aesEncrypt(text, password)`
Securely encrypt sensitive data in your workflows.

#### `aesDecrypt(encryptedText, password)`
Decrypt data when needed in your automation.

#### `isEncrypted(text)`
Check if data is already secured.

#### `encryptIfNeeded(text, password)`
Safely encrypt data, preventing double-encryption.

#### `decryptIfNeeded(text, password)`
Safely decrypt data, handling both encrypted and plain states.

### Advanced Classes

- **`StreamCipher`**: Process large data streams efficiently
- **`BatchEncryptor`**: Handle multiple tasks in parallel
- **`EncryptionPipeline`**: Build multi-stage workflows
- **`CipherPool`**: Optimize performance with reusable instances
- **`AsyncCipher`**: Promise-based async operations
- **`RequestHandler`**: Automate API request/response cycles
- **`DataHandler`**: Transform and secure data flows

## Running Examples

```bash
npm run example
```

## Configuration

Set up your environment variables:

```bash
# .env
MASTER_PASSWORD=your-secure-password
API_SECRET=your-api-secret
MIGRATION_KEY=your-migration-key
```

## Best Practices

1. **Environment Variables**: Always use environment variables for sensitive configuration
2. **Error Handling**: Implement proper error handling in automation workflows
3. **Logging**: Log workflow execution for debugging and monitoring
4. **Testing**: Test automation scripts thoroughly before production
5. **Monitoring**: Set up monitoring for long-running automation tasks
6. **Idempotency**: Design workflows to be safely re-runnable

## Integration Examples

### With Express.js
```javascript
import express from 'express';
import { RequestHandler } from './src/handlers.js';

const app = express();
app.use(express.json());

const handler = new RequestHandler(getToken());

app.post('/process', async (req, res) => {
  const result = handler.handleRequest(req);
  res.json({ success: true, data: result });
});
```

### With Cron Jobs
```javascript
import cron from 'node-cron';
import { BatchEncryptor } from './src/batch.js';

// Run every day at 2 AM
cron.schedule('0 2 * * *', async () => {
  console.log('Running daily automation...');
  await runDailyAutomation();
});
```

### With Database
```javascript
import { DataHandler } from './src/handlers.js';
import mysql from 'mysql2/promise';

const handler = new DataHandler(getToken());
const connection = await mysql.createConnection(config);

async function secureInsert(data) {
  const secured = handler.secureData(Buffer.from(JSON.stringify(data)));
  await connection.execute('INSERT INTO secure_data VALUES (?)', [secured]);
}
```

## Dependencies

- `aes-js`: Encryption functionality
- `pbkdf2`: Key derivation

## License

MIT

## Contributing

We welcome contributions! Please open issues or submit pull requests.

## Support

For questions and support, please open an issue on GitHub.
