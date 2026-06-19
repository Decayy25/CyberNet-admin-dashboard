import MembershipController from "@/controllers/admin-membership.controller";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET": {
      const result = await MembershipController.getMembership();

      return res.status(200).json(result);
    }

    case "POST": {
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
