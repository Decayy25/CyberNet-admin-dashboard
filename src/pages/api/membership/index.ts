import MembershipController from "@/controllers/admin-membership.controller";
import { NEXTAUTH_SECRET } from "@/utils/environment";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET": {
      const searchQuery =
        typeof req.query.search === "string" ? req.query.search : undefined;
      const result = await MembershipController.getMembership(searchQuery);

      return res.status(200).json(result);
    }

    case "POST": {
      const session = await getToken({ req, secret: NEXTAUTH_SECRET})

      if (!session) {
        return res.status(401).json({
          success: false,
          data: null,
          message: "cie mau nambahin data membership tapi gk ada token 😂",
        });
      }
      const result = await MembershipController.addMembership(req.body);

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
