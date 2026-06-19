import { NextApiRequest, NextApiResponse } from "next";
import predictAvailability from "@/services/location-predict.service";


const handler = async ( req: NextApiRequest, res: NextApiResponse) => {
    try{
        const result = await predictAvailability(req.body);

    return res.status(200).json(result);
    } catch {
        return res.status(400).json({
            success: false,
            message: "gagal prediksi lokasi"
        })
    }
    

}

export default handler;












