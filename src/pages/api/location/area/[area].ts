import LocationController from "@/controllers/admin-location.controller";
import { NextApiRequest, NextApiResponse } from "next";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { area } = req.query;

  if (typeof area !== "string") {
    return res.status(400).json({
      success: false,
      message: "Area tidak valid",
    });
  }

  switch (req.method) {
    case "GET": {
      const result = await LocationController.getLocationByArea(area);

      return res.status(200).json(result)
    }
  }
}

export default handler;