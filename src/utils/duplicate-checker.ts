import { region } from "@/utils/database";
import { locationForm } from "@/models/location.models";

/**
 * Hapus extra spasi dan normalisasi untuk perbandingan duplikasi
 */
function normalizeForDuplicateCheck(area: string): string {
  return area
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.,\-_]/g, ""); // Hapus special chars
}

/**
 * Cek apakah area sudah ada di database (exact match)
 */
export async function checkExactDuplicate(area: string): Promise<boolean> {
  try {
    const normalized = normalizeForDuplicateCheck(area);
    const existing = await region.findOne({
      areaSearchKey: normalized, // Field ini untuk search/duplicate check
    });
    return !!existing;
  } catch (error) {
    console.error("Error checking exact duplicate:", error);
    return false;
  }
}

/**
 * Cek apakah area mirip dengan yang sudah ada (fuzzy matching)
 * Threshold: 0.75 = 75% sama dianggap duplikasi
 */
export async function checkFuzzyDuplicate(
  area: string,
  threshold: number = 0.75,
): Promise<{ isDuplicate: boolean; similarArea?: string }> {
  try {
    const normalized = normalizeForDuplicateCheck(area);
    const allAreas = await region.find({}).toArray();

    for (const doc of allAreas) {
      const existingNormalized = normalizeForDuplicateCheck(doc.area);
      const similarity = calculateSimilarity(normalized, existingNormalized);

      if (similarity >= threshold) {
        return {
          isDuplicate: true,
          similarArea: doc.area,
        };
      }
    }

    return { isDuplicate: false };
  } catch (error) {
    console.error("Error checking fuzzy duplicate:", error);
    return { isDuplicate: false };
  }
}

/**
 * Hitung Levenshtein distance antara dua string
 */
function calculateLevenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1, // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Hitung similarity score (0-1)
 * 1 = identik, 0 = sangat berbeda
 */
function calculateSimilarity(str1: string, str2: string): number {
  const distance = calculateLevenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  return 1 - distance / maxLength;
}

/**
 * Update area (upsert: update jika ada, insert jika tidak)
 * Ini menghindari duplikasi otomatis
 */
export async function upsertLocation(
  areaSearchKey: string,
  data: locationForm,
) {
  try {
    const result = await region.updateOne(
      { areaSearchKey },
      {
        $set: {
          area: data.area,
          status: data.status,
          updatedAt: new Date(),
        },
      },
      { upsert: true }, // Create jika tidak ada, update jika ada
    );

    return result;
  } catch (error) {
    console.error("Error upserting location:", error);
    throw error;
  }
}

/**
 * Get all unique areas (untuk deduplikasi)
 */
export async function getUniqueAreas() {
  try {
    const areas = await region.find({}).toArray();
    return areas;
  } catch (error) {
    console.error("Error getting unique areas:", error);
    return [];
  }
}

/**
 * Hapus duplikasi dari database (cleanup)
 * HATI-HATI: Operasi ini menukar database!
 */
export async function removeDuplicates(): Promise<{
  removedCount: number;
  keptCount: number;
}> {
  try {
    const allAreas = await region.find({}).toArray();
    const seen = new Set<string>();
    const toDelete: string[] = [];

    for (const doc of allAreas) {
      const normalized = normalizeForDuplicateCheck(doc.area);

      if (seen.has(normalized)) {
        toDelete.push(doc._id.toString());
      } else {
        seen.add(normalized);
      }
    }

    // Delete duplikasi
    if (toDelete.length > 0) {
      const { deletedCount } = await region.deleteMany({
        _id: { $in: toDelete.map((id) => require("mongodb").ObjectId(id)) },
      });

      return {
        removedCount: deletedCount || 0,
        keptCount: allAreas.length - (deletedCount || 0),
      };
    }

    return { removedCount: 0, keptCount: allAreas.length };
  } catch (error) {
    console.error("Error removing duplicates:", error);
    throw error;
  }
}

/**
 * Rebuild search keys untuk semua area (untuk migration)
 */
export async function rebuildSearchKeys() {
  try {
    const allAreas = await region.find({}).toArray();
    let updated = 0;

    for (const doc of allAreas) {
      const areaSearchKey = normalizeForDuplicateCheck(doc.area);
      await region.updateOne({ _id: doc._id }, { $set: { areaSearchKey } });
      updated++;
    }

    return updated;
  } catch (error) {
    console.error("Error rebuilding search keys:", error);
    throw error;
  }
}
