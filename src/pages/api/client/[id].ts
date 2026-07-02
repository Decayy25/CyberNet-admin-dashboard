import { withAuth } from "@/libs/middleware/auth";
import ClientController from "@/controllers/admin-client.controller";
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
    case "PUT": {
      const result = await ClientController.updateClient(id, req.body);

      return res.status(200).json(result);
    }

    case "DELETE": {
      const result = await ClientController.removeById(id);

      return res.status(200).json(result);
    }

    default:
      return res.status(401).json({
        success: false,
        data: null,
        message: "cie mau edit/hapus data client tapi gk ada token 😂",
      });
  }
};

export default withAuth(handler);
