import Form from "@/components/signUp.tsx";
import { signIn } from "@/libs/auth";

export default function SignIn() {
	return (
		<>
			<Form />
			<form
				action={async () => {
					"use server";
					await signIn("google", { redirectTo: "/dashboard" });
				}}>
				<button type='submit'>Signin with Google</button>
			</form>
		</>
	);
}
