import { NextApiRequest, NextApiResponse } from "next";
import AdminController from "@/controllers/admin-auth.controller";
import { TypeLoginAdmin } from "@/types/UI";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Validasi method
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method tidak diperbolehkan",
    });
  }

  try {
    // Ambil body dari request
    const body: TypeLoginAdmin = req.body;

    // Validasi body tidak kosong
    if (!body || !body.identifier || !body.password) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: ["identifier dan password harus diisi"],
      });
    }

    // Gunakan controller untuk logic login
    const result = await AdminController.AdminLogic(body);

    // Cek apakah login berhasil
    if (!result.success) {
      return res.status(401).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat login",
    });
  }
};

export default handler;
