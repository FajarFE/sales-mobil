"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/libs/auth";
import { loginUserSchema } from "@/zod/signin";
import prisma from "@/libs/db";
import { getUserFromDb } from "@/libs/credentials";

const defaultValues = {
	email: "",
	password: "",
};

export async function login(prevState: any, formData: FormData) {
	try {
		const email = formData.get("email");
		const password = formData.get("password");

		const validatedFields = loginUserSchema.safeParse({
			email: email,
			password: password,
		});

		if (!validatedFields.success) {
			return {
				message: "validation error",
				errors: validatedFields.error.flatten().fieldErrors,
			};
		}

		await signIn("credentials", formData);
		const checkVerifyEmail = await getUserFromDb(email as string);
		console.log(checkVerifyEmail);
		return {
			message: "success",
			errors: {},
		};
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return {
						message: "credentials error",
						errors: {
							...defaultValues,
							credentials: "incorrect email or password",
						},
					};
				default:
					return {
						message: "unknown error",
						errors: {
							...defaultValues,
							unknown: "unknown error",
						},
					};
			}
		}
		throw error;
	}
}

export async function logout() {
	await signOut();
}
