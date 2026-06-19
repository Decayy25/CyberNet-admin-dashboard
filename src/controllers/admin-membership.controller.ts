import { membership } from "../utils/database";
import { ResponseHandler } from "../utils/response";
import { PackageSchema } from "../models/membership.models";
import { ObjectId } from "mongodb";
import { typeMembership } from "../types";

const MembershipController = {
  async getMembership() {
    try {
      const result = await membership.find().toArray();

      return ResponseHandler.success(result, "berhasil mengambil membership");
    } catch {
      return ResponseHandler.error("gagal mengambil membership");
    }
  },

  async getMembershipById(id: string) {
    try {
      if (!ObjectId.isValid(id)) {
        return ResponseHandler.error("format ID tidak valid");
      }

      const result = await membership.findOne({
        _id: new ObjectId(id),
      });

      if (!result) {
        return ResponseHandler.error("paket tidak ditemukan");
      }

      return ResponseHandler.success(
        result,
        "berhasil mengambil paket berdasarkan id",
      );
    } catch {
      return ResponseHandler.error("gagal mengambil paket berdasarkan id");
    }
  },

  async addMembership(body: typeMembership) {
    try {
      const data = await PackageSchema.validate(body);

      const result = await membership.insertOne(data);

      return ResponseHandler.success(
        result.insertedId,
        "sukses menambahkan paket",
      );
    } catch {
      return ResponseHandler.error("gagal menambahkan membership");
    }
  },

  async updateMembership(id: string, body: typeMembership) {
    try {
      if (!ObjectId.isValid(id)) {
        return ResponseHandler.error("format ID tidak valid");
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
        return ResponseHandler.error("paket tidak ditemukan");
      }

      return ResponseHandler.success(result, "sukses mengedit paket");
    } catch {
      return ResponseHandler.error("gagal update paket");
    }
  },

  async removeMembershipById(id: string) {
    try {
      if (!ObjectId.isValid(id)) {
        return ResponseHandler.error("format ID tidak valid");
      }

      const result = await membership.findOneAndDelete({
        _id: new ObjectId(id),
      });

      if (!result) {
        return ResponseHandler.error("paket tidak ditemukan");
      }

      return ResponseHandler.success(result, "berhasil menghapus paket");
    } catch {
      return ResponseHandler.error("gagal menghapus paket");
    }
  },
};

export default MembershipController;
