import NextAuth from "next-auth";
import { authOptions } from "@/libs/middleware/auth";

export default NextAuth(authOptions);
