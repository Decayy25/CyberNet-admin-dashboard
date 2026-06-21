import * as Yup from "yup";

export const PackageClient = Yup.object({
  fullName: Yup.string()
    .required("Nama lengkap wajib diisi")
    .min(3, "Nama minimal 3 karakter"),

  phoneNumber: Yup.string()
    .required("Nomor telepon wajib diisi")
    .matches(/^(\+62|62|0)[0-9]{9,13}$/, "Format nomor telepon tidak valid"),

  email: Yup.string()
    .required("Email wajib diisi")
    .email("Format email tidak valid"),

  address: Yup.string()
    .required("Alamat wajib diisi")
    .min(5, "Alamat terlalu pendek"),

  packageId: Yup.string().required("Paket wajib dipilih"),
});

export type PackageClient = Yup.InferType<typeof PackageClient>