import { initDatabase } from '../connection.js';
import { runSeedEngine } from './seedEngine.js';

async function main() {
  try {
    console.log('[Seed Runner] Initializing database...');
    await initDatabase();
    console.log('[Seed Runner] Executing seed...');
    await runSeedEngine();
    console.log('[Seed Runner] SUCCESS: Database seeded with all 19 tables and 2026 dataset!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Runner ERROR]', error);
    process.exit(1);
  }
}

main();
