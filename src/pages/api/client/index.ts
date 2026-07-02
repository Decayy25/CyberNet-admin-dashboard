import { authOptions } from "./../auth/[...nextauth]";
import ClientController from "@/controllers/admin-client.controller";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET": {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        return res.status(401).json({
          success: false,
          data: null,
          message: "cie mau ngambil data user 😂",
        });
      }

      const searchQuery =
        typeof req.query.search === "string" ? req.query.search : undefined;
      const result = await ClientController.getClient(searchQuery);

      return res.status(200).json(result);
    }

    case "POST": {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        return res.status(401).json({
          success: false,
          data: null,
          message: "cie mau nambahin data client tapi gk ada token 😂",
        });
      }
      const result = await ClientController.addClient(req.body);

      return res.status(200).json(result);
    }

    default:
      return res.status(400).json({
        success: false,
        message: "Method Not Allowed",
      });
  }
};

export default handler;
