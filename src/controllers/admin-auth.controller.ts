import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AdminSchema } from "@/models/admin.models";
import { getAdmin } from "@/utils/database";
import { JWT_SECRET } from "@/utils/environment";
import { TypeLoginAdmin } from "@/types";

const AdminController = {
  async register(body: TypeLoginAdmin) {
    try {
      const admin = await getAdmin();
      const data = await AdminSchema.validate(body, {
        abortEarly: false,
      });

      const hashed = await bcrypt.hash(data.password, 10);

      const result = await admin.insertOne({
        identifier: data.identifier,
        password: hashed,
      });

      return {
        status: 200,
        succes: true,
        message: "Berhasil mendaftar",
        data: result,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes("duplicate key")) {
        return {
          status: 300,
          success: false,
          message: "Identifier sudah terdaftar",
        };
      }
      return {
        status: 400,
        success: false,
        message: "gagal membuat akun",
      };
    }
  },

  async AdminLogic(body: TypeLoginAdmin) {
    try {
      const admin = await getAdmin();
      const data = await AdminSchema.validate(body, {
        abortEarly: false,
      });

      const Admin = await admin.findOne({
        identifier: data.identifier,
      });

      if (!Admin) {
        return {
          message: "Identifier atau password salah",
        };
      }

      const match = await bcrypt.compare(data.password, Admin.password);

      if (!match) {
        return {
          message: "Identifier atau password salah",
        };
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

      return {
        id: Admin._id.toString(),
        token,
        identifier: Admin.identifier,
        message: "Login berhasil",
      };
    } catch (error) {
      return {
        status: 400,
        success: false,
        message: "Terjadi kesalahan saat login",
        error
      };
    }
  },
};

export default AdminController;
