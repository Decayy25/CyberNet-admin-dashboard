import { getRegion, getAdmin, getMembership, getCollection } from "./database";

export const setupDatabaseIndexes = async () => {
  try {
    const region = await getRegion();
    const admin = await getAdmin();
    const membership = await getMembership();

    console.log("Creating database indexes...");

    await region.createIndex({ areaSearchKey: 1 }, { unique: true });
    console.log("✅ Created unique index on areaSearchKey");

    await region.createIndex({ area: 1 });
    console.log("✅ Created index on area");

    await region.createIndex({ status: 1 });
    console.log("✅ Created index on status");

    await region.createIndex({ status: 1, areaSearchKey: 1 });
    console.log("✅ Created compound index on status + areaSearchKey");

    await region.createIndex({ createdAt: -1 });
    await region.createIndex({ updatedAt: -1 });
    console.log("✅ Created indexes on createdAt & updatedAt");

    await admin.createIndex({ identifier: 1 }, { unique: true });
    console.log("✅ Created unique index on admin.identifier");

    await admin.createIndex({ createdAt: -1 });
    console.log("✅ Created index on admin.createdAt");

    await membership.createIndex({ status: 1 });
    console.log("✅ Created index on membership.status");

    await membership.createIndex(
      { userId: 1, locationId: 1 },
      { unique: true },
    );
    console.log("✅ Created unique compound index on membership");

    await membership.createIndex({ createdAt: -1 });
    console.log("✅ Created index on membership.createdAt");

    console.log("\n✨ All database indexes created successfully!\n");

    return {
      success: true,
      message: "All indexes created",
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) {
      console.log("⚠️ Indexes already exist (this is OK)");
      return {
        success: true,
        message: "Indexes already exist",
      };
    }

    console.error("❌ Error creating indexes:", error);
    throw error;
  }
};


export const getIndexes = async (collectionName: string) => {
  try {
    const collection = await getCollection(collectionName);
    const indexes = await collection.listIndexes().toArray();
    return indexes;
  } catch (error) {
    console.error(`Error getting indexes for ${collectionName}:`, error);
    return [];
  }
};


export const dropIndex = async (collectionName: string, indexName: string) => {
  try {
    const collection = await getCollection(collectionName);
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
};


export const getCollectionStats = async (collectionName: string) => {
  try {
    const collection = await getCollection(collectionName);


    const [stats] = await collection
      .aggregate([{ $collStats: { storageStats: {} } }])
      .toArray();

    const storageStats = stats?.storageStats || {};

    return {
      name: collectionName,
      documentCount: storageStats.count || 0,
      averageDocumentSize: storageStats.avgObjSize || 0,
      indexCount: storageStats.nindexes || 0,
      indexSize: storageStats.totalIndexSize || 0,
      indexes: storageStats.indexSizes || {},
    };
  } catch (error) {
    console.error(`Error getting stats for ${collectionName}:`, error);
    return null;
  }
};

export default setupDatabaseIndexes;
