export {}

declare module "next-auth" {
  /**
   * The user object returned from the authorize callback or from the database
   */
  interface User {
    id: string;
    token?: string;
    user?: unknown; // Use unknown instead of any
  }
}
