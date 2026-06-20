export interface MembershipPlan {
  _id: string;
  paket: string;
  price: number;
  period: string;
  features: string[];
  isPopular: boolean;
}

export interface LocationArea {
  _id: string;
  area: string;
  status: "tersedia" | "tidak tersedia" | string;
}

export interface TypeContactForm {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  packageId: number;
}

export interface TypeEmail {
  email: string;
  name: string;
  message: string;
}

export interface TypeLoginAdmin {
  identifier: string;
  password: string;
}

export interface typeLocation {
  area: string;
  status: "tersedia" | "tidak_tersedia";
}

export interface typeMembership {
  paket: string;
  price: number;
  period: "bulan" | "tahun";
  features: [];
  isPopular?: boolean;
}

export interface AlertProps {
  area: string;
  status: string;
  confidence: string;
  isVerified: boolean;
  matchedArea?: string;
}