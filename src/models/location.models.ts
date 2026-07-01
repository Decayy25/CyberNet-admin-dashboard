import * as Yup from "yup";
import { LocationStatus } from "@/types/location";

const LOCATION_STATUS_VALUES: LocationStatus[] = ["tersedia", "tidak_tersedia"];

export const locationShema = Yup.object({
  area: Yup.string()
    .required("Area lokasi wajib diisi")
    .default("Curug cinulang"),
  status: Yup.string()
    .required("status wajib diisi")
    .oneOf(LOCATION_STATUS_VALUES, "status tidak valid")
    .default("tidak_tersedia"),
});

export type locationForm = Yup.InferType<typeof locationShema>;
