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
  _id?: string;
  area: string;
  status: "tersedia" | "tidak_tersedia" | string;
};

export type typeMembership = {
  paket: string;
  price: number;
  period: "bulan" | "tahun";
  features: string[];
  isPopular?: boolean;
};

export interface TotalClientResponse {
  success: boolean;
  data: {
    totalMembers: number;
  };
}

export interface Client {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  packageId: string;
  createdAt: string;
}
