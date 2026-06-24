import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT_SECRET } from "@/utils/environment";
import AdminController from "@/controllers/admin-auth.controller";
import { ILogin, IAdmin, ApiResponse } from "@/types/Auth";

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

export default NextAuth(authOptions);
