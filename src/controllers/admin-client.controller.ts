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

      return ResponseHandler.success(result, "berhasil mengambil client");
    } catch {
      return ResponseHandler.error("gagal mengambil client");
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
    } catch {
      return ResponseHandler.error("gagal mengambil client berdasarkan nama");
    }
  },

  async getTotalClient() {
    try {
      const result = await clientMember.countDocuments();

      return ResponseHandler.success(result, "berhasil mengambil total client")
    } catch {
      return ResponseHandler.error("gagal mengambil total client")
    }
  },

  async addClient(body: TypeContactForm) {
    try {
      const data = await PackageClient.validate(body);
      const result = await clientMember.insertOne(data);

      const existing = await clientMember.findOne(data);
      if (existing) {
        return ResponseHandler.validation(["Client dengan data ini sudah ada"]);
      }

      return ResponseHandler.success(
        result.insertedId,
        "sukses menambah client",
      );
    } catch {
      return ResponseHandler.error("gagal menambah client");
    }
  },

  async updateClient(body: Client) {
    const { _id } = body;
    try {
      const data = await PackageClient.validate(body);

      const result = await clientMember.updateOne(
        { _id: new ObjectId(_id) },
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
    } catch {
      return ResponseHandler.error("gagal mengubah data client");
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
    } catch {
        return ResponseHandler.error("Gagal menghapus client");
    }
  }
};

export default ClientController;