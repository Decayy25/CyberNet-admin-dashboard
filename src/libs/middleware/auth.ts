import { NextAuthOptions } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT_SECRET } from "@/utils/environment";
import AdminController from "@/controllers/admin-auth.controller";
import { ILogin, IAdmin, ApiResponse } from "@/types/Auth";

export interface AuthPayload {
  id: string;
  name: string;
  iat?: number;
  exp?: number;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Identifier", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Identifier dan password harus diisi");
        }

        try {
          const payload: ILogin = {
            identifier: credentials.identifier,
            password: credentials.password,
          };

          // Type the result properly
          const result: ApiResponse<IAdmin> =
            await AdminController.AdminLogic(payload);

          if (!result.success || !result.data) {
            throw new Error(result.message || "Login gagal");
          }

          const admin = result.data;

          return {
            id: admin.id,
            name: admin.identifier,
            email: admin.identifier,
            accessToken: admin.token,
          };
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : "Login gagal",
          );
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session as any).accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  jwt: {
    secret: JWT_SECRET,
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
};

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
    if (["GET", "HEAD", "OPTIONS"].includes(req.method!)) {
      return handler(req, res);
    }

    // Verifikasi token untuk POST, PUT, DELETE, PATCH
    const user = verifyToken(req);

    if (!user) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Token tidak ditemukan atau tidak valid",
        data: null,
      });
    }

    // Attach user ke request object
    (req as any).user = user;

    return handler(req, res);
  };
};

export const withAdminAuth = (handler: any) => {
  return withAuth(async (req: NextApiRequest, res: NextApiResponse) => {
    const user = (req as any).user as AuthPayload | undefined;

    if (!user) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "User tidak ditemukan. Silakan login terlebih dahulu",
        data: null,
      });
    }

    // Jika ada field role di user payload, bisa dicek di sini
    // const hasAdminRole = user.role === 'admin';
    // if (!hasAdminRole) {
    //   return res.status(403).json({
    //      status: 403,
    //       success: false,
    //       message: "Anda tidak memiliki akses admin",
    //       data: null,
    //});
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
