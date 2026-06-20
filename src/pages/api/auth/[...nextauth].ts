import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT_SECRET } from "@/utils/environment";
import AdminController from "@/controllers/admin-auth.controller";
import { ILogin } from "@/types/Auth";

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
          // Gunakan controller untuk validasi login
          const payload: ILogin = {
            identifier: credentials.identifier,
            password: credentials.password,
          };

          const result = await AdminController.AdminLogic(payload);

          if (!result.success) {
            throw new Error(
              result.errors?.[0] || result.message || "Login gagal",
            );
          }

          // Return user dengan token
          return {
            id: result.data.id,
            name: result.data.identifier,
            email: result.data.identifier,
            accessToken: result.data.token,
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
        token.accessToken = user.accessToken;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  jwt: {
    secret: JWT_SECRET,
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 jam
  },
};

export default NextAuth(authOptions);
