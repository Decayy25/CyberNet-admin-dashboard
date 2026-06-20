import natural from "natural";
import { region } from "@/utils/database";
import LocationController from "@/controllers/admin-location.controller"

interface LocationDoc {
  _id?: string;
  area: string;
  status: string;
}

interface PredictionResponse {
  area?: string;
  status: string;
  confidence?: string;
  isVerified?: boolean;
  error?: string;
  matchedArea?: string;
}

const cleanTextSpecial = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/^kampung|^kp\.?|^kmp\.?/g, "kp")
    .replace(/^desa|^ds\.?/g, "ds")
    .replace(/^kelurahan|^kel\.?/g, "kel")
    .trim();
}

const calculateLevenshteinDistance = (str1: string, str2: string): number => {
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
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
};


const calculateSimilarity = (str1: string, str2: string): number => {
  const distance = calculateLevenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  return 1 - distance / maxLength;
};

const findSimilarArea = (
  input: string,
  areas: LocationDoc[],
  threshold: number = 0.7,
): LocationDoc | null => {
  const normalizedInput = cleanTextSpecial(input);

  let bestMatch: LocationDoc | null = null;
  let bestScore = 0;

  areas.forEach((area) => {
    const normalizedArea = cleanTextSpecial(area.area);

    const similarity = calculateSimilarity(normalizedInput, normalizedArea);

    if (similarity > bestScore) {
      bestScore = similarity;
      bestMatch = area;
    }
  });

  if (bestScore >= threshold) {
    return bestMatch;
  }

  return null;
};

const predictAvailability = async (body: {
  area: string;
}): Promise<PredictionResponse> => {
  try {
    const { area } = body;
    if (!area) return { status: "Input tidak valid" };

    const dataWilayah = (await region
      .find({})
      .toArray()) as unknown as LocationDoc[];

    if (!dataWilayah || dataWilayah.length === 0) {
      return { status: "Belum ada data wilayah di database untuk dipelajari" };
    }

    
    const normalizedInput: string = area.toLowerCase().trim();
    let isKnownArea = dataWilayah.find(
      (d) => d.area.toLowerCase().trim() === normalizedInput
    );


    let fuzzyMatchedArea: LocationDoc | null = null;
    if (!isKnownArea) {
      fuzzyMatchedArea = findSimilarArea(area, dataWilayah, 0.70);
      if (fuzzyMatchedArea) {
        isKnownArea = fuzzyMatchedArea;
      }
    }


    const classifier = new natural.BayesClassifier();


    dataWilayah.forEach((item) => {
      if (item.area && item.status) {
        classifier.addDocument(item.area, item.status);
      }
    });


    classifier.train();


    const label: string = classifier.classify(normalizedInput);
    const classifications = classifier.getClassifications(normalizedInput);


    const confidenceScore: number =
      classifications.find((c) => c.label === label)?.value || 0;


    const threshold = 0.85;
    let finalStatus = "Belum Tersedia";
    let verified = false;
    let matchedAreaName: string | undefined = undefined;


    if (isKnownArea) {
      verified = true;
      matchedAreaName = isKnownArea.area;
      finalStatus =
        isKnownArea.status === "tersedia"
          ? "Tersedia Layanan Jaringan CyberNet (Verified)"
          : "Tidak Tersedia Layanan Jaringan CyberNet (Verified)";
    } else {
      await LocationController.addLocation({
        area: area.trim(),
        status: "tidak_tersedia",
      });

      if (label === "tersedia" && confidenceScore > threshold) {
        finalStatus = "Tersedia Layanan Jaringan CyberNet (Predicted)";
      }
    }

    return {
      area,
      status: finalStatus,
      confidence: `${(confidenceScore * 100).toFixed(2)}%`,
      isVerified: verified,
      matchedArea: matchedAreaName,
    };
  } catch (error) {
    console.error("Gagal melakukan prediksi ML:", error);
    return {
      status: "Terjadi kesalahan sistem saat melakukan klasifikasi",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};


export const normalizeAreaName = (area: string): string => {
  return (
    area
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
};

export default predictAvailability;