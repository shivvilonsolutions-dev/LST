import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const ATLAS_URI = process.env.ATLAS_MONGO_URI || 'mongodb+srv://shivvilonsolutions_db_user:SLPyWcPpOYg6Jysx@cluster0.bt8izdt.mongodb.net/lst?retryWrites=true&w=majority';

const usersToMigrate = [
  { userId: 'ADMIN001', dbName: 'lst_local_ADMIN001' },
  { userId: 'ARJUN001', dbName: 'lst_local_ARJUN001' },
  { userId: 'DHRUVIL001', dbName: 'lst_local_DHRUVIL001' }
];

const collectionTypes = ['users', 'clients', 'quotations', 'inventories', 'settings'];

const getCollectionName = (userId, type) => {
  return `${type}_${userId}`;
};

async function migrateCollection(localConn, atlasConn, localDbName, userId, type) {
  const localCollectionName = type;
  const atlasCollectionName = getCollectionName(userId, type);

  console.log(`  Migrating ${localCollectionName} -> ${atlasCollectionName}...`);

  const localDb = localConn.useDb(localDbName);
  const atlasDb = atlasConn.useDb('lst');

  try {
    const localColl = localDb.collection(localCollectionName);
    const atlasColl = atlasDb.collection(atlasCollectionName);

    const docs = await localColl.find({}).toArray();
    console.log(`    Found ${docs.length} documents`);

    if (docs.length === 0) {
      console.log(`    No documents to migrate`);
      return { migrated: 0, skipped: 0 };
    }

    // Add sync metadata
    const docsToInsert = docs.map(doc => ({
      ...doc,
      isSynced: true,
      lastSyncedAt: new Date(),
      source: 'local_migration'
    }));

    // Drop existing collection in Atlas if it exists
    const existingCount = await atlasColl.countDocuments();
    if (existingCount > 0) {
      console.log(`    Clearing ${existingCount} existing documents in Atlas`);
      await atlasColl.deleteMany({});
    }

    // Insert documents
    const result = await atlasColl.insertMany(docsToInsert);
    console.log(`    Successfully migrated ${result.insertedCount} documents`);

    return { migrated: result.insertedCount, skipped: 0 };
  } catch (error) {
    console.error(`    Error migrating ${type}:`, error.message);
    return { migrated: 0, skipped: 0, error: error.message };
  }
}

async function migrateUser(userConfig) {
  const { userId, dbName } = userConfig;
  console.log(`\n=== Migrating user: ${userId} from ${dbName} ===`);

  let localConn, atlasConn;
  let migrationResults = {};

  try {
    // Connect to local MongoDB
    console.log('Connecting to local MongoDB...');
    localConn = await mongoose.createConnection(`mongodb://127.0.0.1:27017/${dbName}`);
    console.log('Local connection successful');

    // Connect to Atlas
    console.log('Connecting to Atlas...');
    atlasConn = await mongoose.createConnection(ATLAS_URI);
    console.log('Atlas connection successful');

    // Migrate each collection
    for (const type of collectionTypes) {
      const result = await migrateCollection(localConn, atlasConn, dbName, userId, type);
      migrationResults[type] = result;
    }

    // Generate summary
    console.log(`\n--- Migration Summary for ${userId} ---`);
    let totalMigrated = 0;
    for (const [type, result] of Object.entries(migrationResults)) {
      console.log(`  ${type}: ${result.migrated} migrated, ${result.skipped} skipped`);
      totalMigrated += result.migrated;
    }
    console.log(`  Total: ${totalMigrated} documents migrated`);

    return { success: true, userId, migrationResults, totalMigrated };

  } catch (error) {
    console.error(`Migration failed for ${userId}:`, error.message);
    return { success: false, userId, error: error.message };
  } finally {
    if (localConn) await localConn.close();
    if (atlasConn) await atlasConn.close();
  }
}

async function main() {
  console.log('=== Starting Migration from Local MongoDB to Atlas ===\n');

  const results = [];

  for (const userConfig of usersToMigrate) {
    const result = await migrateUser(userConfig);
    results.push(result);
  }

  // Final summary
  console.log('\n=== Final Migration Summary ===');
  let totalSuccess = 0;
  let totalFailed = 0;
  let totalDocuments = 0;

  for (const result of results) {
    if (result.success) {
      totalSuccess++;
      totalDocuments += result.totalMigrated;
      console.log(`✓ ${result.userId}: ${result.totalMigrated} documents`);
    } else {
      totalFailed++;
      console.log(`✗ ${result.userId}: ${result.error}`);
    }
  }

  console.log(`\nTotal users: ${results.length}`);
  console.log(`Successful: ${totalSuccess}`);
  console.log(`Failed: ${totalFailed}`);
  console.log(`Total documents migrated: ${totalDocuments}`);

  // Save report
  const reportPath = path.join(process.cwd(), 'migration-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({ results, summary: { totalSuccess, totalFailed, totalDocuments } }, null, 2));
  console.log(`\nMigration report saved to: ${reportPath}`);

  process.exit(totalFailed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
