import { PackageClient } from "@/models/client.models";
import { Client } from "@/types";
import { getClientMember } from "@/utils/database";
import { ObjectId } from "mongodb";
import { TypeContactForm } from "@/types/package";

const ClientController = {
  async getClient() {
    try {
      const clientMember = await getClientMember();
      const result = await clientMember.find().toArray();

      if (!result || result.length === 0) {
        return {
          message: "Tidak ada data client",
        };
      }

      return {
        status: 200,
        success: true,
        message: "Berhasil mengambil client",
        data: result,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal mengambil client";

      return {
        status: 200,
        succes: false,
        message: errorMessage,
        data: null,
      };
    }
  },

  async getClientByFullName(fullName: string) {
    try {
      const clientMember = await getClientMember();
      if (!fullName || fullName.trim().length === 0) {
        return {
          meesage: "nama harus diisi",
        };
      }
      const result = await clientMember.findOne({
        fullName: {
          $regex: `^${fullName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
          $options: "i",
        },
      });

      return {
        status: 200,
        success: true,
        message: "sukses mengambil client berdasarkan nama",
        data: result,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "gagal mengambil client berdasarkan nama";

      return {
        status: 400,
        message: errorMessage,
        data: null,
      };
    }
  },

  async addClient(body: TypeContactForm) {
    try {
      const clientMember = await getClientMember();
      const data = await PackageClient.validate(body);

      const existing = await clientMember.findOne({
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
      });

      if (existing) {
        return {
          status: 400,
          success: false,
          message: "Client dengan data ini sudah ada",
          data: null,
        };
      }

      const result = await clientMember.insertOne({
        fullName: body.fullName,
        phoneNumber: body.phoneNumber,
        email: body.email,
        address: body.address,
        packageId: body.packageId,
        createdAt: new Date(),
      });

      return {
        status: 201,
        success: true,
        message: "Sukses menambah client",
        data: result.insertedId,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal menambah client";

      return {
        status: 500,
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  },

  async updateClient(id: string, body: Client) {
    try {
      const clientMember = await getClientMember();

      if (!ObjectId.isValid(id)) {
        return {
          status: 400,
          success: false,
          message: "Format ID tidak valid",
          data: null,
        };
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
        return {
          status: 404,
          success: false,
          message: "Client tidak ditemukan",
          data: null,
        };
      }

      return {
        status: 200,
        success: true,
        message: "Sukses mengubah data client",
        data: result,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal mengubah data client";

      return {
        status: 500,
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  },

  async removeById(_id: string) {
    try {
      const clientMember = await getClientMember();

      if (!ObjectId.isValid(_id)) {
        return {
          status: 400,
          success: false,
          message: "Format ID tidak valid",
          data: null,
        };
      }

      const result = await clientMember.findOneAndDelete({
        _id: new ObjectId(_id),
      });

      if (!result) {
        return {
          status: 404,
          success: false,
          message: "Client tidak ditemukan",
          data: null,
        };
      }

      return {
        status: 200,
        success: true,
        message: "Sukses menghapus client",
        data: result,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal menghapus client";

      return {
        status: 500,
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  },
};

export default ClientController;
