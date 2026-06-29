import { getRegion } from "@/utils/database";
import { normalizeAreaName } from "@/controllers/location-predict.controller";
import { locationShema } from "@/models/location.models";
import {
  checkExactDuplicate,
  checkFuzzyDuplicate,
} from "@/utils/duplicate-checker";
import { ObjectId } from "mongodb";
import { typeLocation } from "@/types";

const LocationController = {
  async getLocation() {
    try {
      const region = await getRegion();
      const result = await region.find().toArray();

      if (!result || result.length === 0) {
        return {
          status: 200,
          success: true,
          message: "Belum ada data lokasi",
          data: [],
        };
      }

      return {
        status: 200,
        success: true,
        message: "Berhasil mengambil lokasi",
        data: result,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Kesalahan mencari lokasi";

      return {
        status: 500,
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  },

  async getLocationByArea(area: string) {
    try {
      if (!area || area.length === 0) {
        return {
          status: 400,
          success: false,
          message: "Area harus diisi",
          data: null,
        };
      }

      const region = await getRegion();

      const result = await region.findOne({
        area: {
          $regex: `^${area.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
          $options: "i",
        },
      });

      if (!result) {
        return {
          status: 404,
          success: false,
          message: "Lokasi tidak ditemukan",
          data: null,
        };
      }

      return {
        status: 200,
        success: true,
        message: "Berhasil mengambil lokasi berdasarkan area",
        data: result,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Gagal menemukan lokasi berdasarkan area";

      return {
        status: 500,
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  },

  async addLocation(body: typeLocation) {
    try {
      const region = await getRegion();

      const data = await locationShema.validate({
        area: normalizeAreaName(body.area),
        status: body.status,
      });

      const isExactDuplicate = await checkExactDuplicate(data.area, region);

      if (isExactDuplicate) {
        return {
          status: 400,
          success: false,
          message: "Lokasi dengan nama ini sudah ada",
          data: null,
        };
      }

      const fuzzyCheck = await checkFuzzyDuplicate(data.area, 0.8, region);

      if (fuzzyCheck.isDuplicate) {
        return {
          status: 400,
          success: false,
          message: `Lokasi ini mirip dengan "${fuzzyCheck.similarArea}" yang sudah ada.`,
          data: null,
        };
      }

      const result = await region.insertOne({
        area: data.area,
        status: data.status,
        areaSearchKey: data.area
          .toLowerCase()
          .replace(/\s+/g, "")
          .replace(/[.,\-_]/g, ""),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return {
        status: 201,
        success: true,
        message: "Sukses menambahkan lokasi",
        data: result.insertedId,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal menambahkan lokasi";

      return {
        status: 500,
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  },

  async updateLocation(id: string, body: typeLocation) {
    try {
      const region = await getRegion();

      if (!ObjectId.isValid(id)) {
        return {
          status: 400,
          success: false,
          message: "Format ID tidak valid",
          data: null,
        };
      }

      // Validasi input
      if (!body.area || body.area.trim() === "") {
        return {
          status: 400,
          success: false,
          message: "Area tidak boleh kosong",
          data: null,
        };
      }

      const data = await locationShema.validate({
        area: normalizeAreaName(body.area.trim()),
        status: body.status,
      });

      const currentDoc = await region.findOne({
        _id: new ObjectId(id),
      });

      if (!currentDoc) {
        return {
          status: 404,
          success: false,
          message: "Lokasi tidak ditemukan",
          data: null,
        };
      }

      const result = await region.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            area: data.area,
            status: data.status,
            areaSearchKey: data.area
              .toLowerCase()
              .replace(/\s+/g, "")
              .replace(/[.,\-_]/g, ""),
            updatedAt: new Date(),
          },
        },
      );

      if (result.matchedCount === 0) {
        return {
          status: 404,
          success: false,
          message: "Lokasi tidak ditemukan",
          data: null,
        };
      }

      return {
        status: 200,
        success: true,
        message: "Sukses mengedit lokasi",
        data: result,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal update lokasi";

      return {
        status: 500,
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  },

  async removeLocationById(id: string) {
    try {
      if (!ObjectId.isValid(id)) {
        return {
          status: 400,
          success: false,
          message: "Format ID tidak valid",
          data: null,
        };
      }

      const region = await getRegion();

      const result = await region.findOneAndDelete({
        _id: new ObjectId(id),
      });

      if (!result) {
        return {
          status: 404,
          success: false,
          message: "Lokasi tidak ditemukan",
          data: null,
        };
      }

      return {
        status: 200,
        success: true,
        message: "Sukses menghapus lokasi",
        data: result,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal menghapus lokasi";

      return {
        status: 500,
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  },
};

export default LocationController;
