import dotenv from "dotenv";

dotenv.config();

export const DATABASE_URL: string = process.env.DATABASE_URL || "";
export const JWT_SECRET: string = process.env.JWT_SECRET || "";
export const NEXTAUTH_SECRET: string = process.env.NEXTAUTH_SECRET || "";
export const EMAIL_PASS: string =
  process.env.EMAIL_PASS || "brgl rfif dedf puoi";
export const EMAIL_USER: string =
  process.env.EMAIL_USER || "mochrizqihermawan615@gmail.com";