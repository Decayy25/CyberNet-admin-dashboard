import { NextApiRequest, NextApiResponse } from "next";
import {
  setupDatabaseIndexes,
  getCollectionStats,
} from "@/utils/database-setup";
import { removeDuplicates, rebuildSearchKeys } from "@/utils/duplicate-checker";

/**
 * API Endpoint untuk database maintenance & setup
 *
 * Endpoints:
 * POST /api/admin/database/setup-indexes
 * POST /api/admin/database/remove-duplicates
 * POST /api/admin/database/rebuild-search-keys
 * GET /api/admin/database/stats
 *
 * ⚠️ SECURITY WARNING: Endpoint ini sangat powerful!
 * Harus di-protect dengan authentication & authorization
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { action } = req.query;

  // ⚠️ TODO: Add authentication check
  // if (!session || !isAdmin) {
  //   return res.status(401).json({ error: "Unauthorized" });
  // }

  try {
    switch (action) {
      case "setup-indexes":
        return await setupIndexesHandler(req, res);

      case "remove-duplicates":
        return await removeDuplicatesHandler(req, res);

      case "rebuild-search-keys":
        return await rebuildSearchKeysHandler(req, res);

      case "stats":
        return await statsHandler(req, res);

      default:
        return res.status(400).json({
          success: false,
          message: `Unknown action: ${action}`,
          availableActions: [
            "setup-indexes",
            "remove-duplicates",
            "rebuild-search-keys",
            "stats",
          ],
        });
    }
  } catch (error) {
    console.error(`Database maintenance error (${action}):`, error);
    return res.status(500).json({
      success: false,
      message: "Database maintenance error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * Setup database indexes
 * POST /api/admin/database?action=setup-indexes
 */
async function setupIndexesHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  console.log("📋 Setting up database indexes...");

  const result = await setupDatabaseIndexes();

  return res.status(200).json({
    success: result.success,
    message: result.message,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Remove duplicate locations
 * POST /api/admin/database?action=remove-duplicates
 */
async function removeDuplicatesHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  console.log("🧹 Removing duplicates from regions collection...");

  const result = await removeDuplicates();

  return res.status(200).json({
    success: true,
    message: "Duplicate removal completed",
    data: {
      removedCount: result.removedCount,
      keptCount: result.keptCount,
      total: result.removedCount + result.keptCount,
    },
    timestamp: new Date().toISOString(),
  });
}

/**
 * Rebuild search keys untuk semua areas
 * POST /api/admin/database?action=rebuild-search-keys
 */
async function rebuildSearchKeysHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  console.log("🔄 Rebuilding search keys for all areas...");

  const updated = await rebuildSearchKeys();

  return res.status(200).json({
    success: true,
    message: "Search keys rebuilt",
    data: {
      updatedCount: updated,
    },
    timestamp: new Date().toISOString(),
  });
}

/**
 * Get database statistics
 * GET /api/admin/database?action=stats
 */
async function statsHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  console.log("📊 Getting database statistics...");

  const collections = ["regions", "admin", "membership"];

  const stats = await Promise.all(
    collections.map((name) => getCollectionStats(name)),
  );

  return res.status(200).json({
    success: true,
    message: "Database statistics retrieved",
    data: stats,
    timestamp: new Date().toISOString(),
  });
}
