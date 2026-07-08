import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";                         
import { prisma } from "./prisma";
import { sendVerificationEmail } from "./sendVerificationEmail";    
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: { modelName: "User" },
  session: { modelName: "Session" },
  account: { modelName: "Account" },
  verification: { modelName: "Verification" },
 

  plugins: [nextCookies()],

  emailAndPassword: {
    enabled: true,
     requireEmailVerification: true,
    autoSignIn: false,
  },
   emailVerification: {
    sendVerificationEmail: async () => {
    },
  },
});

export type Auth = typeof auth;