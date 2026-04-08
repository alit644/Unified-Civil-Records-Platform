import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { adminAc, userAc } from "better-auth/plugins/admin/access";
import prisma from "./db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    modelName: "Employee",
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "OFFICER",
      },
      isActive: {
        type: "boolean",
        required: true,
        defaultValue: true,
      },
    },
    fields: {
      email: "email",
      name: "name",
      emailVerified: "emailVerified",
      image: "image",
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  plugins: [
    admin({
      adminRoles: ["ADMIN"],
      defaultRole: "OFFICER",
      roles: {
        ADMIN: adminAc,
        OFFICER: userAc,
        AUDITOR: userAc,
      },
    }),
  ],
});
