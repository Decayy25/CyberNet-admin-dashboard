import { Collection, ObjectId } from "mongodb";
import { getRegion } from "@/utils/database";
import { locationForm } from "@/models/location.models";

const region = await getRegion()

function normalizeForDuplicateCheck(area: string): string {
  return area
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.,\-_]/g, "");
}

export const checkExactDuplicate = async (
  area: string,
  region?: Collection,
) => {
  if (!region) {
    region = await getRegion();
  }

  const result = await region.findOne({
    area: {
      $regex: `^${area.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
      $options: "i",
    },
  });

  return !!result;
};

export const checkFuzzyDuplicate = async (
  area: string,
  threshold: number,
  region?: Collection,
) => {
  if (!region) {
    const { getRegion } = await import("./database");
    region = await getRegion();
  }

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
};


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


function calculateSimilarity(str1: string, str2: string): number {
  const distance = calculateLevenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  return 1 - distance / maxLength;
}

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
      { upsert: true },
    );

    return result;
  } catch (error) {
    console.error("Error upserting location:", error);
    throw error;
  }
}


export async function getUniqueAreas() {
  try {
    const areas = await region.find({}).toArray();
    return areas;
  } catch (error) {
    console.error("Error getting unique areas:", error);
    return [];
  }
}


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
        _id: { $in: toDelete.map((id) => new ObjectId(id)) },
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
