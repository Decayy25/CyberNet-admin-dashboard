import sendEmail from "@/controllers/contact-email.controller";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ success: false, message: "Method not allowed" });
    }

    const result = await sendEmail(req.body);

    return res.status(200).json({
      success: true,
      message: "Email berhasil dikirim",
      data: result,
    });
  } catch (error: any) {
    console.error("Detail Error Backend:", error);
    return res.status(400).json({
      success: false,
      message: error?.message || "terjadi kesalahan",
    });
  }
};

export default handler;
