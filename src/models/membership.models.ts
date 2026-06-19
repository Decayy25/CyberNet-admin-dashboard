import * as Yup from "yup";

export const PackageSchema = Yup.object({
  paket: Yup.string().required("Paket wajib diisi"),
  price: Yup.number().required("Harga wajib diisi").min(0),
  period: Yup.string().required("Periode wajib diisi"),
  features: Yup.array().of(Yup.string().required()).required(),
  isPopular: Yup.boolean().default(false),
});

export type PackageForm = Yup.InferType<typeof PackageSchema>;
