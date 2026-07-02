import { NextAuthOptions } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt"; // Gunakan getToken bawaan NextAuth
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";
import { JWT_SECRET, NEXTAUTH_URL } from "@/utils/environment";
import AdminController from "@/controllers/admin-auth.controller";
import { ILogin, IAdmin, ApiResponse } from "@/types/Auth";

export interface AuthPayload {
  id: string;
  name: string;
  email?: string;
  accessToken?: string;
  iat?: number;
  exp?: number;
}

export const authOptions: NextAuthOptions = {
  // ... (Bagian authOptions tidak ada yang salah, biarkan persis seperti aslinya)
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
  jwt: { secret: JWT_SECRET },
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
};


/**
 * Middleware untuk protect route dengan autentikasi (HYBRID METHOD)
 */
export const withAuth = (handler: any) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Lewati preflight dan pengecekan head
    if (["HEAD", "OPTIONS"].includes(req.method!)) {
      return handler(req, res);
    }

    try {
      let userPayload: any = null;

      // 1. CARA PERTAMA: Cek Header Authorization (Seperti kode asli Anda)
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.startsWith("Bearer ")
          ? authHeader.slice(7)
          : authHeader;
        try {
          // Decode menggunakan secret JWT kustom Anda
          userPayload = jwt.verify(
            token,
            process.env.JWT_SECRET || "default-secret"
          );
        } catch (e) {
          // Jika header gagal divalidasi, biarkan lanjut ke Cara Kedua
        }
      }

      // 2. CARA KEDUA: Jika tidak ada di header, baca dari Cookie (NextAuth)
      if (!userPayload) {
        userPayload = await getToken({
          req,
          // PENTING: Gunakan NEXTAUTH_SECRET sesuai dengan yang ada di src/middleware.ts Anda
          secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
        });
      }

      // Jika kedua cara di atas gagal, tolak request
      if (!userPayload) {
        return res.status(401).json({
          status: 401,
          success: false,
          message: "Token tidak ditemukan, tidak valid, atau sesi berakhir",
          data: null,
        });
      }

      // Attach user ke request object agar bisa dibaca oleh API Handler
      (req as any).user = userPayload;

      return handler(req, res);
    } catch (error) {
      console.error("Middleware Error:", error);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Terjadi kesalahan pada server saat memvalidasi autentikasi",
      });
    }
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
    return handler(req, res);
  });
};

/**
 * Middleware untuk CORS
 */
export const withCORS = (handler: any) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const allowedOrigin =
      NEXTAUTH_URL && NEXTAUTH_URL !== "*"
        ? NEXTAUTH_URL
        : "http://localhost:3000";

    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, OPTIONS, PATCH, DELETE, POST, PUT",
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

export const compose =
  (...middlewares: any[]) =>
  (handler: any) => {
    return middlewares.reduceRight(
      (acc, middleware) => middleware(acc),
      handler,
    );
  };
