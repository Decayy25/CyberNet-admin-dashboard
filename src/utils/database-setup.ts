import { db } from "./database";

/**
 * Setup all necessary indexes untuk optimization & duplicate prevention
 * Call this once during app initialization
 */
export async function setupDatabaseIndexes() {
  try {
    const region = db.collection("regions");
    const admin = db.collection("admin");
    const membership = db.collection("membership");

    console.log("🔧 Creating database indexes...");

    // ========== REGIONS COLLECTION ==========
    // 1. Unique index on areaSearchKey (prevent exact duplicates)
    await region.createIndex({ areaSearchKey: 1 }, { unique: true });
    console.log("✅ Created unique index on areaSearchKey");

    // 2. Index on area (for quick search)
    await region.createIndex({ area: 1 });
    console.log("✅ Created index on area");

    // 3. Index on status (for filtering)
    await region.createIndex({ status: 1 });
    console.log("✅ Created index on status");

    // 4. Compound index (status + areaSearchKey)
    await region.createIndex({ status: 1, areaSearchKey: 1 });
    console.log("✅ Created compound index on status + areaSearchKey");

    // 5. Index on createdAt & updatedAt (for sorting)
    await region.createIndex({ createdAt: -1 });
    await region.createIndex({ updatedAt: -1 });
    console.log("✅ Created indexes on createdAt & updatedAt");

    // ========== ADMIN COLLECTION ==========
    // Unique index on identifier (prevent duplicate logins)
    await admin.createIndex({ identifier: 1 }, { unique: true });
    console.log("✅ Created unique index on admin.identifier");

    // Index on createdAt
    await admin.createIndex({ createdAt: -1 });
    console.log("✅ Created index on admin.createdAt");

    // ========== MEMBERSHIP COLLECTION ==========
    // Index on status
    await membership.createIndex({ status: 1 });
    console.log("✅ Created index on membership.status");

    // Index on userId + locationId (prevent duplicate memberships)
    await membership.createIndex(
      { userId: 1, locationId: 1 },
      { unique: true },
    );
    console.log("✅ Created unique compound index on membership");

    // Index on createdAt
    await membership.createIndex({ createdAt: -1 });
    console.log("✅ Created index on membership.createdAt");

    console.log("\n✨ All database indexes created successfully!\n");

    return {
      success: true,
      message: "All indexes created",
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) {
      console.log("⚠️  Indexes already exist (this is OK)");
      return {
        success: true,
        message: "Indexes already exist",
      };
    }

    console.error("❌ Error creating indexes:", error);
    throw error;
  }
}

/**
 * Get all existing indexes untuk diagnostics
 */
export async function getIndexes(collectionName: string) {
  try {
    const collection = db.collection(collectionName);
    const indexes = await collection.listIndexes().toArray();
    return indexes;
  } catch (error) {
    console.error(`Error getting indexes for ${collectionName}:`, error);
    return [];
  }
}

/**
 * Drop specific index (useful untuk troubleshooting)
 * WARNING: Be careful with this!
 */
export async function dropIndex(collectionName: string, indexName: string) {
  try {
    const collection = db.collection(collectionName);
    await collection.dropIndex(indexName);
    console.log(
      `✅ Dropped index '${indexName}' from collection '${collectionName}'`,
    );
    return { success: true };
  } catch (error) {
    console.error(
      `Error dropping index '${indexName}' from '${collectionName}':`,
      error,
    );
    throw error;
  }
}

/**
 * Get collection statistics untuk monitoring
 */
export async function getCollectionStats(collectionName: string) {
  try {
    const collection = db.collection(collectionName);
    const countResult = await collection.countDocuments();

    // Get index information
    const indexes = await collection.listIndexes().toArray();
    const indexSizes: Record<string, number> = {};

    let totalIndexSize = 0;
    for (const index of indexes) {
      // Estimate index size (rough calculation)
      const estimatedSize = countResult * 10; // Rough estimate
      indexSizes[index.name || "_id_"] = estimatedSize;
      totalIndexSize += estimatedSize;
    }

    return {
      name: collectionName,
      documentCount: countResult,
      averageDocumentSize: 200, // Estimated average
      indexCount: indexes.length,
      indexSize: totalIndexSize,
      indexes: indexSizes,
    };
  } catch (error) {
    console.error(`Error getting stats for ${collectionName}:`, error);
    return null;
  }
}

/**
 * Call this in your main server file untuk initialize indexes
 * Example dalam src/pages/api/setup.ts
 */
export default setupDatabaseIndexes;
