// npx prisma db seed

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');


const seed = new PrismaClient();

async function main() {
    // Change the path to your SQL file as needed
  const sqlPath = path.join(__dirname, '../scripts/seed_database_3.sql');

  const sql = fs.readFileSync(sqlPath, 'utf-8');

  // Split SQL into individual statements
  const statements: string[] = sql
    .split(';')
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 0);

  for (const stmt of statements) {
    try {
      await seed.$executeRawUnsafe(stmt);
    } catch (err) {
      console.error('Failed to execute statement:', stmt, err);
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await seed.$disconnect();
  });