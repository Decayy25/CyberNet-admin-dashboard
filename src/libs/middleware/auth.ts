import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { ResponseHandler } from "@/utils/response";

export interface AuthPayload {
  id: string;
  name: string;
  iat?: number;
  exp?: number;
}

/**
 * Verifikasi JWT Token dari Authorization header
 * @param req NextApiRequest
 * @returns AuthPayload | null
 */
export const verifyToken = (req: NextApiRequest): AuthPayload | null => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  try {
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default-secret",
    ) as AuthPayload;

    return decoded;
  } catch {
    return null;
  }
};

/**
 * Middleware untuk protect route dengan autentikasi
 *
 * Cara pakai:
 * ```typescript
 * const handler = async (req, res) => {
 *   // your logic here
 * };
 * export default withAuth(handler);
 * ```
 */
export const withAuth = (handler: any) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // GET dan OPTIONS tidak perlu autentikasi
    if (["GET", "HEAD", "OPTIONS"].includes(req.method!)) {
      return handler(req, res);
    }

    // Verifikasi token untuk POST, PUT, DELETE, PATCH
    const user = verifyToken(req);

    if (!user) {
      return res
        .status(401)
        .json(ResponseHandler.error("Token tidak ditemukan atau tidak valid"));
    }

    // Attach user ke request object
    (req as any).user = user;

    return handler(req, res);
  };
};

/**
 * Middleware untuk protect route dengan admin access
 * Pastikan sudah menggunakan withAuth sebelumnya
 */
export const withAdminAuth = (handler: any) => {
  return withAuth(async (req: NextApiRequest, res: NextApiResponse) => {
    const user = (req as any).user as AuthPayload | undefined;

    if (!user) {
      return res
        .status(403)
        .json(
          ResponseHandler.error(
            "User tidak ditemukan. Silakan login terlebih dahulu",
          ),
        );
    }

    // Jika ada field role di user payload, bisa dicek di sini
    // const hasAdminRole = user.role === 'admin';
    // if (!hasAdminRole) {
    //   return res.status(403).json(
    //     ResponseHandler.error('Anda tidak memiliki akses admin')
    //   );
    // }

    return handler(req, res);
  });
};

/**
 * Middleware untuk CORS (jika diperlukan)
 * Next.js biasanya tidak perlu karena same-server, tapi ini untuk custom header
 */
export const withCORS = (handler: any) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Origin",
      process.env.NEXT_PUBLIC_API_URL || "*",
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
    );

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    return handler(req, res);
  };
};

/**
 * Compose multiple middlewares
 *
 * Cara pakai:
 * ```typescript
 * const handler = async (req, res) => {
 *   // your logic
 * };
 * export default compose(withCORS, withAdminAuth)(handler);
 * ```
 */
export const compose =
  (...middlewares: any[]) =>
  (handler: any) => {
    return middlewares.reduceRight(
      (acc, middleware) => middleware(acc),
      handler,
    );
  };
