// import { BayesClassifier } from "@/utils/bayes-classifier";
// import { getRegion } from "@/utils/database";
// import LocationController from "@/controllers/admin-location.controller";
// import { LocationDocument } from "@/types/location";

// interface PredictionResponse {
//   area?: string;
//   status: string;
//   confidence?: string;
//   isVerified?: boolean;
//   error?: string;
//   matchedArea?: string;
// }

// const cleanTextSpecial = (text: string): string => {
//   return text
//     .toLowerCase()
//     .replace(/\s+/g, "")
//     .replace(/^kampung|^kp\.?|^kmp\.?/g, "kp")
//     .replace(/^desa|^ds\.?/g, "ds")
//     .replace(/^kelurahan|^kel\.?/g, "kel")
//     .trim();
// };

// const calculateLevenshteinDistance = (str1: string, str2: string): number => {
//   const matrix: number[][] = [];

//   for (let i = 0; i <= str2.length; i++) {
//     matrix[i] = [i];
//   }

//   for (let j = 0; j <= str1.length; j++) {
//     matrix[0][j] = j;
//   }

//   for (let i = 1; i <= str2.length; i++) {
//     for (let j = 1; j <= str1.length; j++) {
//       if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
//         matrix[i][j] = matrix[i - 1][j - 1];
//       } else {
//         matrix[i][j] = Math.min(
//           matrix[i - 1][j - 1] + 1, // substitution
//           matrix[i][j - 1] + 1, // insertion
//           matrix[i - 1][j] + 1, // deletion
//         );
//       }
//     }
//   }

//   return matrix[str2.length][str1.length];
// };

// const calculateSimilarity = (str1: string, str2: string): number => {
//   const distance = calculateLevenshteinDistance(str1, str2);
//   const maxLength = Math.max(str1.length, str2.length);
//   return 1 - distance / maxLength;
// };

// const findSimilarArea = (
//   input: string,
//   areas: LocationDocument[],
//   threshold: number = 0.7,
// ): LocationDocument | null => {
//   const normalizedInput = cleanTextSpecial(input);

//   let bestMatch: LocationDocument | null = null;
//   let bestScore = 0;

//   areas.forEach((area) => {
//     const normalizedArea = cleanTextSpecial(area.area);

//     const similarity = calculateSimilarity(normalizedInput, normalizedArea);

//     if (similarity > bestScore) {
//       bestScore = similarity;
//       bestMatch = area;
//     }
//   });

//   if (bestScore >= threshold) {
//     return bestMatch;
//   }

//   return null;
// };

// const predictAvailability = async (body: {
//   area: string;
// }): Promise<PredictionResponse> => {
//   try {
//     const region = await getRegion();
//     const { area } = body;
//     if (!area) return { status: "Input tidak valid" };

//     const dataWilayah = (await region
//       .find({})
//       .toArray()) as unknown as LocationDocument[];

//     if (!dataWilayah || dataWilayah.length === 0) {
//       return { status: "Belum ada data wilayah di database untuk dipelajari" };
//     }

//     const normalizedInput: string = area.toLowerCase().trim();
//     let isKnownArea = dataWilayah.find(
//       (d) => d.area.toLowerCase().trim() === normalizedInput,
//     );

//     let fuzzyMatchedArea: LocationDocument | null = null;
//     if (!isKnownArea) {
//       fuzzyMatchedArea = findSimilarArea(area, dataWilayah, 0.7);
//       if (fuzzyMatchedArea) {
//         isKnownArea = fuzzyMatchedArea;
//       }
//     }

//     const classifier = new BayesClassifier();

//     dataWilayah.forEach((item) => {
//       if (item.area && item.status) {
//         classifier.addDocument(item.area, item.status);
//       }
//     });

//     classifier.train();

//     const label: string = classifier.classify(normalizedInput);
//     const classifications = classifier.getClassifications(normalizedInput);

//     const confidenceScore: number =
//       classifications.find((classification) => classification.label === label)
//         ?.value || 0;

//     const threshold = 0.85;
//     let finalStatus = "tidak_tersedia";
//     let verified = false;
//     let matchedAreaName: string | undefined = undefined;

//     if (isKnownArea) {
//       matchedAreaName = isKnownArea.area;
//       if (isKnownArea.status === "akan_tersedia") {
//         verified = true;
//         finalStatus = "Akan Tersedia Jaringan CyberNet (Verified)";
//       } else if (isKnownArea.status === "tidak_tersedia") {
//         verified = false;
//         finalStatus = "Belum Tersedia Layanan Jaringan CyberNet";
//       } else if (isKnownArea.status === "tersedia") {
//         verified = true;
//         finalStatus = "Tersedia Layanan Jaringan CyberNet (Predicted)";
//       }
//     } else {
//       await LocationController.addLocation({
//         area: area.trim(),
//         status: "tidak_tersedia",
//       });

//       if (label === "tersedia" && confidenceScore > threshold) {
//         finalStatus = "Tersedia Layanan Jaringan CyberNet (Predicted)";
//       }
//     }

//     return {
//       area,
//       status: finalStatus,
//       confidence: `${(confidenceScore * 100).toFixed(2)}%`,
//       isVerified: verified,
//       matchedArea: matchedAreaName,
//     };
//   } catch (error) {
//     console.error("Gagal melakukan prediksi ML:", error);
//     return {
//       status: "Terjadi kesalahan sistem saat melakukan klasifikasi",
//       error: error instanceof Error ? error.message : String(error),
//     };
//   }
// };

// export const normalizeAreaName = (area: string): string => {
//   return area
//     .trim()
//     .toLowerCase()
//     .replace(/\s+/g, " ")
//     .split(" ")
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ");
// };

// export default predictAvailability;

import { BayesClassifier } from "@/utils/bayes-classifier";
import { getRegion } from "@/utils/database";
import LocationController from "@/controllers/admin-location.controller";
import { LocationDocument } from "@/types/location";

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
};

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
          matrix[i - 1][j] + 1, // deletion
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
  areas: LocationDocument[],
  threshold: number = 0.7,
): LocationDocument | null => {
  const normalizedInput = cleanTextSpecial(input);

  let bestMatch: LocationDocument | null = null;
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
    const region = await getRegion();
    const { area } = body;
    if (!area) return { status: "Input tidak valid" };

    const dataWilayah = (await region
      .find({})
      .toArray()) as unknown as LocationDocument[];

    if (!dataWilayah || dataWilayah.length === 0) {
      return { status: "Belum ada data wilayah di database untuk dipelajari" };
    }

    const normalizedInput: string = area.toLowerCase().trim();
    let isKnownArea = dataWilayah.find(
      (d) => d.area.toLowerCase().trim() === normalizedInput,
    );

    let fuzzyMatchedArea: LocationDocument | null = null;
    if (!isKnownArea) {
      fuzzyMatchedArea = findSimilarArea(area, dataWilayah, 0.7);
      if (fuzzyMatchedArea) {
        isKnownArea = fuzzyMatchedArea;
      }
    }

    const classifier = new BayesClassifier();

    dataWilayah.forEach((item) => {
      if (item.area && item.status) {
        classifier.addDocument(item.area, item.status);
      }
    });

    classifier.train();

    const label: string = classifier.classify(normalizedInput);
    const classifications = classifier.getClassifications(normalizedInput);

    const confidenceScore: number =
      classifications.find((classification) => classification.label === label)
        ?.value || 0;

    const threshold = 0.85;
    let finalStatus = "Belum Tersedia";
    let verified = false;
    let matchedAreaName: string | undefined = undefined;

    if (isKnownArea) {
      matchedAreaName = isKnownArea.area;
      const normalizedStatus = isKnownArea.status.toLowerCase().trim();

      if (
        normalizedStatus === "akan tersedia" ||
        normalizedStatus === "akan_tersedia"
      ) {
        verified = true;
        finalStatus = "Akan Tersedia Jaringan CyberNet (Verified)";
      } else if (
        normalizedStatus === "tidak_tersedia" ||
        normalizedStatus === "tidak tersedia"
      ) {
        verified = false;
        finalStatus = "Belum Tersedia Layanan Jaringan CyberNet";
      } else if (normalizedStatus === "tersedia") {
        verified = true;
        finalStatus = "Tersedia Layanan Jaringan CyberNet (Verified)";
      }
    } else {
      await LocationController.addLocation({
        area: area.trim(),
        status: "tidak_tersedia",
      });

      const normalizedLabel = label.toLowerCase().trim();
      if (normalizedLabel === "tersedia" && confidenceScore > threshold) {
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
  return area
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default predictAvailability;