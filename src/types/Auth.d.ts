import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

export interface ILogin {
  identifier: string;
  password: string;
}

export interface IAdmin {
  id: string;
  identifier: string;
  token: string;
}

export type TypeLoginAdmin = {
  identifier: string;
  password: string;
};

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role?: string;
    accessToken?: string;
  }

  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    accessToken?: string;
  }
}

// ✅ HAPUS UserExtended, SessionExtended, JWTExtended
// Mereka sudah terdefinisi di module declaration di atas

// Form & Email Types
export type TypeContactForm = {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  packageId: number;
};

export type TypeEmail = {
  email: string;
  name: string;
  message: string;
};

// Location & Membership Types
export type TypeLocation = {
  area: string;
  status: "tersedia" | "tidak_tersedia";
};

export type TypeMembership = {
  paket: string;
  price: number;
  period: "bulan" | "tahun";
  features: string[]; // ✅ FIX: [] should be string[]
  isPopular?: boolean;
};

// ✅ Optional: API Response wrapper
export interface ApiResponse<T = unknown> {
  status: number;
  success: boolean;
  message: string;
  data: T | null;
}