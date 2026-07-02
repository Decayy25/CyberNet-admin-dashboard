import dotenv from "dotenv";

dotenv.config();

export const NEXTAUTH_URL: string = process.env.NEXTAUTH_URL || "";
export const DATABASE_URL: string = process.env.DATABASE_URL || "";
export const JWT_SECRET: string = process.env.JWT_SECRET || "";
export const NEXTAUTH_SECRET: string = process.env.NEXTAUTH_SECRET || "";
export const USER_PASS: string =
  process.env.USER_PASS || "";
export const USER_EMAIL: string = process.env.USER_EMAIL || "";