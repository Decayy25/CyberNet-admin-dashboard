import LocationController from "@/controllers/admin-location.controller";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if(typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "ID tidak valid"
    })
  }


  switch (req.method) {
    case "PUT": {
      const result = await LocationController.updateLocation(id, req.body);

      return res.status(200).json(result);
    }

    case "DELETE": {
      const result = await LocationController.removeLocationById(req.body);

      return res.status(200).json(result);
    }
    default:
      return res.status(405).json({
        success: false,
        message: "Method Not Allowed",
      });
  }
};

export default handler;