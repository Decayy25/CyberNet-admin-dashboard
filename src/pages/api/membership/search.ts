import MembershipController from "@/controllers/admin-membership.controller";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  const query = typeof req.query.q === "string" ? req.query.q : "";
  const result = await MembershipController.getMembership(query);

  return res.status(200).json(result);
};

export default handler;
