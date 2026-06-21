import ClientController from "@/controllers/admin-client.controller";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case "GET": {
            const result = await ClientController.getClient();

            return res.status(200).json(result);
        }

        case "POST": {
            const result = await ClientController.addClient(req.body);
            
            return res.status(200).json(result)
        }

        default:
            return res.status(400).json({
                success: false,
                message: "Method Not Allowed"
            })
    }
};

export default handler;