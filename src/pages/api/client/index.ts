import ClientController from "@/controllers/admin-client.controller";
import type { NextApiRequest, NextApiResponse } from "next";
import { NEXTAUTH_SECRET } from "@/utils/environment";
import { getToken } from "next-auth/jwt";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET": {
      const searchQuery =
        typeof req.query.search === "string" ? req.query.search : undefined;

        const session = await getToken({req, secret: NEXTAUTH_SECRET});

        if(!session) {
          return res.status(401).json({
            success: false,
            data: null,
            message: "cie mau liat data client tapi gk ada token 😂",
          });
        }

      const result = await ClientController.getClient(searchQuery);

      return res.status(200).json(result);
    }

    case "POST": {
      const result = await ClientController.addClient(req.body);

      return res.status(200).json(result);
    }

    default:
      return res.status(401).json({
        success: false,
        data: null,
        message: "cie mau liat data client tapi gk ada token 😂",
      });
  }
};

export default handler;