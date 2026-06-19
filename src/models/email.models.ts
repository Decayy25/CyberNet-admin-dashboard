import * as Yup from "yup";

export const registrationSchema = Yup.object({
  fullName: Yup.string()
    .required("Nama lengkap wajib diisi")
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  whatsapp: Yup.string()
    .required("Nomor whatsapp wajib diisi")
    .matches(/^(\+62|62|08)[0-9]{8,13}$/, "Format nomor Whatsapp tidak valid"),
  package: Yup.string()
    .required("Paket wajib dipilih")
    .oneOf(
      ["PAKET 10 Mbps", "PAKET 20 Mbps", "PAKET 30 Mbps", "PAKET 50 Mbps"],
      "Paket tidak valid",
    )
    .default("PAKET 10 Mbps"),
  email: Yup.string()
    .required("Email wajib diisi")
    .email("Format email tidak valid"),

  address: Yup.string()
    .min(10, "Alamat terlalu pendek")
    .max(500, "Alamat terlalu panjang"),
});

export type registrationForm = Yup.InferType<typeof registrationSchema>;