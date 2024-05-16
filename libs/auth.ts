import NextAuth, { type Session, type User } from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import prisma from "./db";
import bcrypt from "bcryptjs";
import { z, ZodError } from "zod";
import { generatePasswordHash, getUserFromDb } from "./credentials";
import { redirect } from "next/dist/server/api-utils";
import { loginUserSchema } from "@/zod/signin";

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		Google({
			clientId: process.env.AUTH_GOOGLE_ID,
			clientSecret: process.env.AUTH_GOOGLE_SECRET,
		}),
		Credentials({
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			credentials: {
				email: {},
				password: {},
			},
			authorize: async (credentials) => {
				try {
					const { email, password } = await loginUserSchema.parseAsync(
						credentials
					);
					const user = await getUserFromDb(email);
					if (!user) {
						throw new Error("User not found.");
					}

					const isPasswordValid = await bcrypt.compare(password, user.password);
					if (!isPasswordValid) {
						throw new Error("Invalid password");
					}

					return user;
				} catch (error) {
					console.error("Error during authentication:", error);
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			return { ...token, ...user };
		},
		async session({ session, user }: { session: Session; user?: User }) {
			return { ...session, ...user };
		},
	},
});
