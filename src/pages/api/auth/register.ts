import { NextApiRequest, NextApiResponse } from "next";
import AdminController from "@/controllers/admin-auth.controller";
import { TypeLoginAdmin } from "@/types/UI";
import { admin } from "@/utils/database";

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

    // Validasi identifier tidak boleh kosong dan format valid
    if (body.identifier.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: ["identifier minimal 3 karakter"],
      });
    }

    // Validasi password tidak boleh kosong dan minimal 6 karakter
    if (body.password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: ["password minimal 6 karakter"],
      });
    }

    // Cek apakah identifier sudah terdaftar
    const existingAdmin = await admin.findOne({ identifier: body.identifier });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Validation failed",
        errors: ["identifier sudah terdaftar"],
      });
    }

    // Gunakan controller untuk logic register
    const result = await AdminController.register(body);

    // Cek apakah register berhasil
    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat registrasi",
    });
  }
};

export default handler;
