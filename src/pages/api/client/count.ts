import ClientController from "@/controllers/admin-client.controller";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.method == "GET") {
        try {
            const result = await ClientController.getTotalClient();

            return res.status(200).json(result)
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "gagal mengambil total client",
                error
            })
        }
    } 
};

export default handler;
