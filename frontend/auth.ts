import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { apiClient } from "@/lib/api-client"
  
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ account, profile }) {
      console.log("=== RESPUESTA DE GOOGLE (SIGN IN) ===");
      console.log("Account (Tokens):", account);
      console.log("Profile (Data del usuario):", profile);
      console.log("====================================");

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

          return { 
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            image: user.pictureUrl,
            token,
            user,
          } as any;
        } catch (error: any) {
          console.error("Error en callback de Google:", error?.response?.data || error?.message || error);
        }
      }
      
      return true;
    },
    async jwt({ token, trigger, user }) {
      if (user) {
        token.user = user.user;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user as any;
      }
      if (token?.token) {
        session.token = token.token as string;
      }
      return session;
    },
  },
})
