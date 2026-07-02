import { authOptions } from "@/libs/middleware/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import LocationController from "@/controllers/admin-location.controller";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET": {
      const searchQuery =
        typeof req.query.search === "string" ? req.query.search : undefined;
      const result = await LocationController.getLocation(searchQuery);

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
