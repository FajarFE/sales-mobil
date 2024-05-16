"use server";
import { signIn } from "@/libs/auth";

export default async function SignIn() {
	return (
		<>
			<form
				action={async (formData) => {
					"use server";
					try {
						await signIn("credentials", formData);
					} catch (error) {
						console.log(error);
					}
				}}>
				<label>
					Email
					<input name='email' type='email' />
				</label>
				<label>
					Password
					<input name='password' type='password' />
				</label>
				<button>Sign In</button>
			</form>
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
