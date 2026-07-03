import type { NextApiRequest, NextApiResponse } from "next";
import { NEXTAUTH_SECRET } from "@/utils/environment";
import { getToken } from "next-auth/jwt";
import LocationController from "@/controllers/admin-location.controller";

const handler = async(
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  switch (req.method) {
    case "GET": {
      const searchQuery =
        typeof req.query.search === "string" ? req.query.search : undefined;
      const result = await LocationController.getLocation(searchQuery);

      const session = await getToken({ req, secret: NEXTAUTH_SECRET});

      if(!session) {
        return res.status(401).json({
          success: false,
          data: null,
          message: "cie mau liat semua data lokasi tapi gk ada token 😂",
        });
      }

      return res.status(200).json(result);
    }

    case "POST": {
      const result = await LocationController.addLocation(req.body);

      return res.status(201).json(result);
    }

    default:
      return res.status(405).json({
        success: false,
        message: "Method Not Allowed",
      });
  }
}

export default handler;