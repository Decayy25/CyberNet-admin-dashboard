import * as Yup from "yup";

export const locationShema = Yup.object({
  area: Yup.string()
    .required("Area lokasi wajib diisi")
    .default("Curug cinulang"),
  status: Yup.string()
    .required("status wajib diisi")
    .oneOf(["tersedia", "tidak_tersedia"], "status tidak valid")
    .default("tidak_tersedia"),
});

export type locationForm = Yup.InferType<typeof locationShema>;
