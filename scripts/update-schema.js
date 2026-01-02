/* eslint-disable */
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

if (process.env.VERCEL) {
  console.log('Detected Vercel environment. Switching Prisma provider to PostgreSQL...');
  let schema = fs.readFileSync(schemaPath, 'utf8');
  schema = schema.replace('provider = "sqlite"', 'provider = "postgresql"');
  fs.writeFileSync(schemaPath, schema);
  console.log('Updated prisma/schema.prisma to use PostgreSQL.');
} else {
  console.log('Not on Vercel. Keeping existing Prisma provider (likely SQLite).');
}
