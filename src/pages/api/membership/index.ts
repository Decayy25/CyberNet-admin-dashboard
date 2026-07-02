import { authOptions } from "./../auth/[...nextauth]";
import getServerSession from "next-auth";
import MembershipController from "@/controllers/admin-membership.controller";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET": {
      const searchQuery =
        typeof req.query.search === "string" ? req.query.search : undefined;
      const result = await MembershipController.getMembership(searchQuery);

      return res.status(200).json(result);
    }

    case "POST": {
      const session =  await getServerSession(req,res, authOptions);

      if(!session) {
         return res.status(401).json({
          success: false,
          data: null,
          message: "cie mau nambahin data lokasi tapi gk ada token 😂",
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
