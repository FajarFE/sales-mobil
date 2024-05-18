import { auth, signIn } from "@/libs/auth";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Toast from "@/components/toast/toast";
import Form from "@/components/signIn.tsx";

export default async function SignIn() {
	return (
		<>
			<Form />
		</>
	);
}
