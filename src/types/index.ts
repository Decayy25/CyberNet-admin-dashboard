export type TypeEmail = {
  email: string;
  name: string;
  message: string;
};

export type TypeLoginAdmin = {
  identifier: string;
  password: string;
};

export type typeLocation = {
  area: string;
  status: "tersedia" | "tidak_tersedia";
};

export type typeMembership = {
  paket: string;
  price: number;
  period: "bulan" | "tahun";
  features: [];
  isPopular?: boolean;
};
