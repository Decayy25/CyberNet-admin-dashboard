import { getRegion, } from "@/utils/database";
import { ResponseHandler } from "@/utils/response";
import { normalizeAreaName} from '@/services/location-predict.service';
import { locationForm, locationShema } from "@/models/location.models";
import {
  checkExactDuplicate,
  checkFuzzyDuplicate,
} from "@/utils/duplicate-checker";
import { ObjectId} from "mongodb";

const LocationController = {
  async getLocation() {
    try {
      const region = await getRegion();
      const result = await region.find().toArray();

      if (!result || result.length === 0) {
        return ResponseHandler.success([], "Belum ada data lokasi");
      }

      return ResponseHandler.success(result, "Berhasil mengambil lokasi");
    } catch (error) {
      console.error("getLocation error:", error);
      if (error instanceof Error) {
        return ResponseHandler.error(error.message);
      }
      return ResponseHandler.error("Kesalahan mencari lokasi");
    }
  },

  async getLocationByArea(area: string) {
    try {
      if (!area || area.trim().length === 0) {
        return ResponseHandler.validation(["Area harus diisi"]);
      }

      const region = await getRegion(); // ✅ Await collection

      const result = await region.findOne({
        area: {
          $regex: `^${area.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
          $options: "i",
        },
      });

      if (!result) {
        return ResponseHandler.error("Lokasi tidak ditemukan");
      }

      return ResponseHandler.success(
        result,
        "Berhasil mengambil lokasi berdasarkan area",
      );
    } catch (error) {
      console.error("getLocationByArea error:", error);
      if (error instanceof Error) {
        return ResponseHandler.error(error.message);
      }
      return ResponseHandler.error("Gagal menemukan lokasi berdasarkan area");
    }
  },

  async addLocation(body: locationForm) {
    try {
      const region = await getRegion();

      const data = await locationShema.validate({
        area: normalizeAreaName(body.area),
        status: body.status,
      });

      const isExactDuplicate = await checkExactDuplicate(data.area, region);
      if (isExactDuplicate) {
        return ResponseHandler.validation(["Lokasi dengan nama ini sudah ada"]);
      }

      const fuzzyCheck = await checkFuzzyDuplicate(data.area, 0.8, region);
      if (fuzzyCheck.isDuplicate) {
        return ResponseHandler.validation([
          `Lokasi ini mirip dengan "${fuzzyCheck.similarArea}" yang sudah ada.`,
        ]);
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

      return ResponseHandler.success(
        result.insertedId,
        "Sukses menambahkan lokasi",
      );
    } catch (error) {
      console.error("addLocation error:", error);
      if (error instanceof Error) {
        if (error.message.includes("duplicate key")) {
          return ResponseHandler.validation(["Lokasi sudah ada di database"]);
        }
        return ResponseHandler.error(error.message);
      }
      return ResponseHandler.error("Gagal menambahkan lokasi");
    }
  },



  async updateLocation(id: string, body: locationForm) {
    try {
      const region = await getRegion();
      if (!ObjectId.isValid(id)) {
        return ResponseHandler.validation(["Format ID tidak valid"]);
      }

      const data = await locationShema.validate({
        area: normalizeAreaName(body.area),
        status: body.status,
      });


      const currentDoc = await region.findOne({
        _id: new ObjectId(id),
      });

      if (!currentDoc) {
        return ResponseHandler.error("Lokasi tidak ditemukan");
      }


      if (currentDoc.area.toLowerCase() !== data.area.toLowerCase()) {
        const isExactDuplicate = await checkExactDuplicate(data.area);
        if (isExactDuplicate) {
          return ResponseHandler.validation([
            "Lokasi dengan nama ini sudah ada. Gunakan nama yang berbeda.",
          ]);
        }
      }

        const fuzzyCheck = await checkFuzzyDuplicate(data.area, 0.8);
        if (fuzzyCheck.isDuplicate) {
          return ResponseHandler.validation([
            `Lokasi ini mirip dengan "${fuzzyCheck.similarArea}" yang sudah ada.`,
          ]);
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
        return ResponseHandler.error("Lokasi tidak ditemukan");
      }

      return ResponseHandler.success(result, "Sukses mengedit lokasi");
    } catch (error) {
      if (error instanceof Error) {
        return ResponseHandler.error(error.message);
      }
      return ResponseHandler.error("Gagal update lokasi");
    }
  },

  async removeLocationById(id: string) {
    try {
      if (!ObjectId.isValid(id)) {
        return ResponseHandler.validation(["Format ID tidak valid"]);
      }

      const region = await getRegion();

      const result = await region.findOneAndDelete({
        _id: new ObjectId(id),
      });

      if (!result) {
        return ResponseHandler.error("Lokasi tidak ditemukan");
      }

      return ResponseHandler.success(result, "Sukses menghapus lokasi");
    } catch (error) {
      console.error("removeLocationById error:", error);
      if (error instanceof Error) {
        return ResponseHandler.error(error.message);
      }
      return ResponseHandler.error("Gagal menghapus lokasi");
    }
  }
};

export default LocationController;