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

      if (account && profile) {
        try {
          await apiClient.post("/api/auth/login/google", {
            googleId: account.providerAccountId,
            email: profile.email,
            firstName: profile.given_name || "",
            lastName: profile.family_name || "",
            pictureUrl: profile.picture,
          });

          return true;
        } catch (error) {
          console.error("Error en callback de Google:", error);
          return false;
        }
      }
      
      return true;
    },
  },
})
