import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        message: `Method ${req.method} tidak diizinkan. Gunakan POST.`,
      });
    }

  try {
    const { default: predictAvailability} = await import("@/services/location-predict.service")
    const result = await predictAvailability(req.body);

    return res.status(200).json(result);
  } catch (error){
    return res.status(500).json({
      success: false,
      message: "gagal prediksi lokasi",
      detail: error instanceof Error ? error.message : String(error)
    });
  }
};

export default handler;
