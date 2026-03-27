import NextAuth, { DefaultSession } from "next-auth"
import { User } from "@/types/auth"

declare module "next-auth" {
  interface Session {
    user: User
    token: string
  }

  interface User {
    token?: string
    user?: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: User
    token?: string
  }
}