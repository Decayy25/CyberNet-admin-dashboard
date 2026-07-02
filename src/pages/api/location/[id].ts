import getServerSession  from "next-auth";
import LocationController from "@/controllers/admin-location.controller";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "@/libs/middleware/auth";

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
      const session =  await getServerSession(req,res, authOptions);

      if(!session) {
         return res.status(401).json({
          success: false,
          data: null,
          message: "cie mau edit data lokasi tapi gk ada token 😂",
        });
      }

      const result = await LocationController.updateLocation(id, req.body);

      return res.status(200).json(result);
    }

    case "DELETE": {
      const session =  await getServerSession(req,res, authOptions);

      if(!session) {
         return res.status(401).json({
          success: false,
          data: null,
          message: "cie mau ngehapus data lokasi tapi gk ada token 😂",
        });
      }

      const result = await LocationController.removeLocationById(id);

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