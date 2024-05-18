import Form from "@/components/email/verify/send/form";
import { signOut } from "@/libs/auth";
import Image from "next/image";

export default async function Home() {
	return (
		<form
			action={async (formData) => {
				"use server";
				await signOut({ redirectTo: "/login" });
			}}>
			<button type='submit'>Sign out</button>
		</form>
	);
}
