import * as Yup from "yup";
import { LOCATION_STATUS_VALUES } from "@/constant/location.constant";
import { LocationStatus } from "@/types";

export const locationShema = Yup.object({
  area: Yup.string()
    .required("Area lokasi wajib diisi")
    .default("Curug cinulang"),
  status: Yup.string()
    .required("status wajib diisi")
    .oneOf(LOCATION_STATUS_VALUES as LocationStatus[], "status tidak valid")
    .default("tidak_tersedia"),
});

export type locationForm = Yup.InferType<typeof locationShema>;
