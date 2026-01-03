/* eslint-disable */
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

if (process.env.VERCEL) {
  console.log('Detected Vercel environment. Switching Prisma provider to PostgreSQL...');
  let schema = fs.readFileSync(schemaPath, 'utf8');

  // Switch provider
  schema = schema.replace('provider = "sqlite"', 'provider = "postgresql"');

  // Handle DATABASE_URL if missing
  // We prefer POSTGRES_PRISMA_URL (pooling) with directUrl, but if not available or strictly replacing,
  // we can fall back to available vars.

  // Check available env vars (simulated check since we can't see them at runtime here easily without actually running)
  // But we can blindly replace if we are sure.

  // If DATABASE_URL is not set, we try to use POSTGRES_PRISMA_URL or POSTGRES_URL_NON_POOLING
  // Since we are doing string replacement, we can't check process.env values if this script runs before env vars are fully loaded
  // (though usually they are).

  // Simple heuristic: If DATABASE_URL is referenced but we know it's missing, swap it.

  // We will try to use POSTGRES_URL_NON_POOLING as the main URL if DATABASE_URL is intended to be replaced.
  // Ideally: url = env("POSTGRES_PRISMA_URL") and directUrl = env("POSTGRES_URL_NON_POOLING")
  // But to keep it simple and working:

  if (process.env.POSTGRES_PRISMA_URL && process.env.POSTGRES_URL_NON_POOLING) {
      console.log('Using POSTGRES_PRISMA_URL and POSTGRES_URL_NON_POOLING');
      // We need to inject directUrl as well
      const newDatasource = `datasource db {
  provider = "postgresql"
  url = env("POSTGRES_PRISMA_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}`;
      // Regex to replace the whole datasource block could be risky, let's just replace the lines.
      schema = schema.replace(/datasource db \{[\s\S]*?\}/, newDatasource);

  } else if (process.env.POSTGRES_URL_NON_POOLING) {
      console.log('Using POSTGRES_URL_NON_POOLING');
      schema = schema.replace('env("DATABASE_URL")', 'env("POSTGRES_URL_NON_POOLING")');
  } else {
      console.log('No specific Postgres env vars detected in process.env, assuming DATABASE_URL is set or falling back.');
  }

  fs.writeFileSync(schemaPath, schema);
  console.log('Updated prisma/schema.prisma to use PostgreSQL.');
} else {
  console.log('Not on Vercel. Keeping existing Prisma provider (likely SQLite).');
}
