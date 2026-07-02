import LocationController from "@/controllers/admin-location.controller";
import { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "@/libs/middleware/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "ID tidak valid",
    });
  }

  switch (req.method) {
    case "PUT": {
      const result = await LocationController.updateLocation(id, req.body);

      return res.status(200).json(result);
    }

    case "DELETE": {
      const result = await LocationController.removeLocationById(id);

      return res.status(200).json(result);
    }
    default:
      return res.status(401).json({
        success: false,
        data: null,
        message: "cie mau ngehapus/edit data lokasi tapi gk ada token 😂",
      });
  }
};

export default withAuth(handler);
