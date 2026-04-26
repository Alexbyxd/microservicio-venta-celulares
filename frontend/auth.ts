import NextAuth, { DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"
import { apiClient } from "@/lib/api-client"

// Extend session type to include token and custom user
declare module "next-auth" {
  interface Session extends DefaultSession {
    token?: string;
    user: {
      id: string;
      firstName?: string;
      lastName?: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ account, profile }) {
      if (account && profile?.email) {
        try {
          const response = await apiClient.post("/auth/login/google", {
            googleId: account.providerAccountId,
            email: profile.email,
            firstName: profile.given_name || "",
            lastName: profile.family_name || "",
            pictureUrl: profile.picture || "",
          });

          const { token, user } = response.data;

          if (typeof window !== "undefined") {
            localStorage.setItem("auth_token", token);
            localStorage.setItem("auth_user", JSON.stringify(user));
          }

          return true; 
        } catch (error) {
          console.error("Error en callback de Google:", error);
          return false;
        }
      }
      
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const u = user as any;
        token.user = u.user;
        token.token = u.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = {
          ...session.user,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(token.user as any),
        };
      }
      if (token?.token) {
        session.token = token.token as string;
      }
      return session;
    },
  },
})
