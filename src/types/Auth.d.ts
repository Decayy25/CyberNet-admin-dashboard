import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

export interface ILogin {
  identifier: string;
  password: string;
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user?: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role?: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user?: {
      id: string;
      role?: string;
    };
  }
}

export interface UserExtended extends User {
  accessToken?: string;
  role?: string;
}

export interface SessionExtended extends Session {
  accessToken?: string;
}

export interface JWTExtended extends JWT {
  user?: UserExtended;
}

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