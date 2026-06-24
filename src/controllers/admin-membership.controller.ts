import { getMembership } from "@/utils/database";
import { PackageSchema } from "@/models/membership.models";
import { ObjectId } from "mongodb";
import { typeMembership } from "@/types";

const MembershipController = {
  async getMembership() {
    try {
      const membership = await getMembership();
      const result = await membership.find().toArray();

      return {
        status: 200,
        success: true,
        message: "Berhasil mengambil membership",
        data: result,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal mengambil membership";

      return {
        status: 500,
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  },

  async getMembershipById(id: string) {
    try {
      const membership = await getMembership();

      if (!ObjectId.isValid(id)) {
        return {
          status: 400,
          success: false,
          message: "Format ID tidak valid",
          data: null,
        };
      }

      const result = await membership.findOne({
        _id: new ObjectId(id),
      });

      if (!result) {
        return {
          status: 404,
          success: false,
          message: "Paket tidak ditemukan",
          data: null,
        };
      }

      return {
        status: 200,
        success: true,
        message: "Berhasil mengambil paket berdasarkan ID",
        data: result,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Gagal mengambil paket berdasarkan ID";

      return {
        status: 500,
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  },

  async addMembership(body: typeMembership) {
    try {
      const membership = await getMembership();

      const data = await PackageSchema.validate(body);

      const result = await membership.insertOne(data);

      return {
        status: 201,
        success: true,
        message: "Sukses menambahkan paket",
        data: result.insertedId,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal menambahkan membership";

      return {
        status: 500,
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  },

  async updateMembership(id: string, body: typeMembership) {
    try {
      const membership = await getMembership();

      if (!ObjectId.isValid(id)) {
        return {
          status: 400,
          success: false,
          message: "Format ID tidak valid",
          data: null,
        };
      }

      const data = await PackageSchema.validate(body);

      const result = await membership.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: data,
        },
      );

      if (result.matchedCount === 0) {
        return {
          status: 404,
          success: false,
          message: "Paket tidak ditemukan",
          data: null,
        };
      }

      return {
        status: 200,
        success: true,
        message: "Sukses mengedit paket",
        data: result,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal update paket";

      return {
        status: 500,
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  },

  async removeMembershipById(id: string) {
    try {
      const membership = await getMembership();

      if (!ObjectId.isValid(id)) {
        return {
          status: 400,
          success: false,
          message: "Format ID tidak valid",
          data: null,
        };
      }

      const result = await membership.findOneAndDelete({
        _id: new ObjectId(id),
      });

      if (!result) {
        return {
          status: 404,
          success: false,
          message: "Paket tidak ditemukan",
          data: null,
        };
      }

      return {
        status: 200,
        success: true,
        message: "Berhasil menghapus paket",
        data: result,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal menghapus paket";

      return {
        status: 500,
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  },
};

export default MembershipController;
