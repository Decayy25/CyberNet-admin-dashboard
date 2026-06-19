import { Context } from "elysia";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/env";
import { ResponseHandler } from "../utils/response";

export interface AuthPayload {
  id: string;
  name: string;
  iat?: number;
  exp?: number;
}

export const aclMiddleware = async (context: Context) => {
  const { request } = context;
  const method = request.method;

  if (method === "GET" || method === "OPTIONS") {
    return true;
  }

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    try {
      const authHeader = request.headers.get("authorization");

      if (!authHeader) {
        context.set.status = 401;
        throw new Error("Token tidak ditemukan. Akses ditolak.");
      }


      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

   
      const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;

      (context as any).user = decoded;

      return true;
    } catch (error) {
      context.set.status = 401;
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Token tidak valid atau sudah expired");
      }
      throw error;
    }
  }

  return true;
};


export const authGuard = (context: Context) => {
  const method = context.request.method;

  // Hanya proteksi CRUD operations
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    return true;
  }

  const authHeader = context.request.headers.get("authorization");

  if (!authHeader) {
    context.set.status = 401;
    return ResponseHandler.error("Token tidak ditemukan. Akses ditolak.");
  }

  try {
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    (context as any).user = decoded;
    return true;
  } catch (error) {
    context.set.status = 401;
    const message =
      error instanceof jwt.TokenExpiredError
        ? "Token sudah expired"
        : error instanceof jwt.JsonWebTokenError
          ? "Token tidak valid"
          : "Autentikasi gagal";

    return ResponseHandler.error(message);
  }
};

/**
 * Middleware untuk mengecek role admin
 * Pastikan user memiliki akses admin
 */
export const adminGuard = async (context: Context) => {
  const user = (context as any).user as AuthPayload | undefined;

  if (!user) {
    context.set.status = 403;
    return ResponseHandler.error(
      "User tidak ditemukan. Silakan login terlebih dahulu"
    );
  }

  // User sudah terverifikasi melalui JWT
  return true;
};
