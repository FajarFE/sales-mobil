import { signIn, signOut } from "@/libs/auth";
import prisma from "@/libs/db";
import type { User } from "@prisma/client";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { Resend } from "resend";

export class EmailNotVerifiedError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "EmailNotVerifiedError";
	}
}

export const generateEmailVerificationToken = () => {
	// generates a buffer containing 32 random bytes.
	// The 32 indicates the number of bytes to generate, and it is commonly used
	// for creating secure tokens or identifiers.
	return randomBytes(32).toString("hex");
};

export const sendVerificationEmail = async (email: string, token: string) => {
	// nodemailer configuration. make sure to replace this with your native email provider in production.
	// we will use mailtrap in this tutorial, so make sure you have the correct configuration in your .env

	const resend = new Resend(process.env.RESEND_API);

	// the content of the email
	const emailData = {
		from: "Admin <admin@arfix-code.my.id>",
		to: email,
		subject: "Email Verification",
		html: `
        <p>Click the link below to verify your email:</p>
        <a href="http://localhost:3000/email/verify?email=${email}&token=${token}">Verify Email</a>
      `,
	};

	try {
		// send the email
		await resend.emails.send(emailData);
	} catch (error) {
		console.error("Failed to send email:", error);
		throw error;
	}
};

// Function to resend email verification
export const resendVerificationEmail = async (email: string) => {
	const emailVerificationToken = generateEmailVerificationToken();

	try {
		// update email verification token
		await prisma.user.update({
			where: { email },
			data: { emailVerifToken: emailVerificationToken },
		});

		// send the verification link along with the token
		await sendVerificationEmail(email, emailVerificationToken);
	} catch (error) {
		return "Something went wrong.";
	}

	return "Email verification sent.";
};

// Function to verify a user's email
export const verifyEmail = (email: string) => {
	return prisma.user.update({
		where: { email },
		data: {
			emailVerified: new Date(),
			emailVerifToken: null,
		},
	});
};

// Function to check if a user's email is verified
export const isUsersEmailVerified = async (email: string) => {
	const user = await prisma.user.findFirst({
		where: { email },
	});

	// if the user doesn't exist then it's none of the function's business
	if (!user) return true;

	// if the emailVerifiedAt value is null then raise the EmailNotVerifiedError error
	if (!user?.emailVerified)
		throw new EmailNotVerifiedError(`EMAIL_NOT_VERIFIED:${email}`);

	return true;
};

// Function to find a user by email in the database
export const findUserByEmail = async (email: string) => {
	return await prisma.user.findFirst({
		where: {
			email,
		},
	});
};
