import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AdminSchema } from "@/models/admin.models";
import { admin } from "@/utils/database";
import { JWT_SECRET } from "@/utils/environment";
import { ResponseHandler } from "@/utils/response";
import { TypeLoginAdmin } from "@/types";

const AdminController = {
  async register(body: TypeLoginAdmin) {
    try {
      const data = await AdminSchema.validate(body, {
        abortEarly: false,
      });

      const hashed = await bcrypt.hash(data.password, 10);

      const result = await admin.insertOne({
        identifier: data.identifier,
        password: hashed,
      });

      return ResponseHandler.success(result, "Sukses membuat akun");
    } catch (error) {
      if (error instanceof Error && error.message.includes("duplicate key")) {
        return ResponseHandler.validation(["Identifier sudah terdaftar"]);
      }
      return ResponseHandler.error(
        error instanceof Error ? error.message : "Gagal membuat akun",
      );
    }
  },

  async AdminLogic(body: TypeLoginAdmin) {
    try {
      const data = await AdminSchema.validate(body, {
        abortEarly: false,
      });

      const Admin = await admin.findOne({
        identifier: data.identifier,
      });

      if (!Admin) {
        return ResponseHandler.validation(["Identifier atau password salah"]);
      }

      const match = await bcrypt.compare(data.password, Admin.password);

      if (!match) {
        return ResponseHandler.validation(["Identifier atau password salah"]);
      }

      const token = jwt.sign(
        {
          id: Admin._id,
          name: Admin.identifier,
        },
        JWT_SECRET,
        {
          expiresIn: "1d",
        },
      );

      return ResponseHandler.success(
        {
          id: Admin._id.toString(),
          token,
          identifier: Admin.identifier,
        },
        "Login berhasil",
      );
    } catch (error) {
      return ResponseHandler.error(
        error instanceof Error ? error.message : "Terjadi kesalahan saat login",
      );
    }
  },
};

export default AdminController;
