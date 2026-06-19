import dotenv from "dotenv";

dotenv.config();


export const DATABASE_URL: string = process.env.DATABASE_URL || "";
export const JWT_SECRET: string = process.env.JWT_SECRET || "";
export const EMAIL_USER : string = process.env.EMAIL_USER || "";
export const EMAIL_PASS : string = process.env.EMAIL_PASS || "";
export const NEXTAUTH_SECRET: string = process.env.NEXTAUTH_SECRET || "";
export const NEXT_PUBLIC_API_URL: string = process.env.NEXT_PUBLIC_API_URL || "";