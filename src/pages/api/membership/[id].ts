import { authOptions } from "./../auth/[...nextauth]";
import getServerSession from "next-auth";
import MembershipController from "@/controllers/admin-membership.controller";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "ID tidak valid",
    });
  }

  switch (req.method) {
    case "GET": {
      const result = await MembershipController.getMembershipById(id)

      return res.status(200).json(result)
    }

    case "PUT": {
      const session =  await getServerSession(req,res, authOptions);

      if(!session) {
         return res.status(401).json({
          success: false,
          data: null,
          message: "cie mau ngedit data paket tapi gk ada token 😂",
        });
      }

      const result = await MembershipController.updateMembership(id, req.body);

      return res.status(200).json(result)
    }

    case "DELETE": {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        return res.status(401).json({
          success: false,
          data: null,
          message: "cie mau ngehapus data lokasi tapi gk ada token 😂",
        });
      }
      const result = await MembershipController.removeMembershipById(id)

      return res.status(200).json(result)
    }
  }
}

export default handler;