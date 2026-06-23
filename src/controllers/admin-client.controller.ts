import { PackageClient } from "@/models/client.models";
import { Client } from "@/types";
import { clientMember } from "@/utils/database";
import { ObjectId } from "mongodb";
import { ResponseHandler } from "@/utils/response";
import { TypeContactForm } from "@/types/package";

const ClientController = {
  async getClient() {
    try {
      const result = await clientMember.find().toArray();

      if (!result || result.length === 0) {
        return ResponseHandler.error("Tidak ada data client");
      }

      return ResponseHandler.success(result, "Berhasil mengambil client");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal mengambil client";

      return ResponseHandler.error(errorMessage);
    }
  },

  async getClientByFullName(fullName: string) {
    try {
      if (!fullName || fullName.trim().length === 0) {
        return ResponseHandler.validation(["nama harus diisi"]);
      }
      const result = await clientMember.findOne({
        fullName: {
          $regex: `^${fullName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
          $options: "i",
        },
      });

      return ResponseHandler.success(
        result,
        "sukses mengambil client berdasarkan nama",
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "gagal mengambil client berdasarkan nama";

      return ResponseHandler.error(errorMessage);
    }
  },

  async addClient(body: TypeContactForm) {
    try {
      const data = await PackageClient.validate(body);
      const existing = await clientMember.findOne({
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
      });

      if (existing) {
        return ResponseHandler.validation(["Client dengan data ini sudah ada"]);
      }

      const result = await clientMember.insertOne(data);

      return ResponseHandler.success(
        result.insertedId,
        "sukses menambah client",
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "gagal menambah client";

      return ResponseHandler.error(errorMessage);
    }
  },

  async updateClient(id: string, body: Client) {
    try {
      if (!ObjectId.isValid(id)) {
        return ResponseHandler.error("format ID tidak valid");
      }

      const data = await PackageClient.validate(body);

      const result = await clientMember.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            fullName: data.fullName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            address: data.address,
            packageId: data.packageId,
            updatedAt: new Date(),
          },
        },
      );

      if (result.matchedCount === 0) {
        return ResponseHandler.error("client tidak ditemukan");
      }

      return ResponseHandler.success(result, "sukses mengubah data client");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "gagal mengubah data client";

      return ResponseHandler.error(errorMessage);
    }
  },

  async removeById(_id: string) {
    try {
      if (!ObjectId.isValid(_id)) {
        return ResponseHandler.validation(["Format ID tidak valid"]);
      }

      const result = await clientMember.findOneAndDelete({
        _id: new ObjectId(_id),
      });

      if (!result) {
        return ResponseHandler.error("client tidak ditemukan");
      }

      return ResponseHandler.success(result, "Sukses menghapus client");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal menghapus client";

      return ResponseHandler.error(errorMessage);
    }
  },
};

export default ClientController;
