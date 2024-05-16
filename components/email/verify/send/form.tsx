"use client";

// Importing necessary hooks and components
import { useFormState, useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { resendVerificationEmail } from "@/libs/email";

export default function Form() {
	// Accessing search parameters from the URL
	const searchParams = useSearchParams();

	// Extracting email and verification_sent status from search parameters
	const email = searchParams.get("email");
	const verificationSent = Boolean(searchParams.get("verification_sent"));

	// Obtaining form state and action using useFormState hook
	const [formState, action] = useFormState(
		resendVerificationEmail.bind(null, email!),
		undefined
	);
	const { pending } = useFormStatus();
	// Rendering the Email Verification Initiation Form
	return (
		<>
			{/* Displaying formState message if available */}
			{!!formState && <div className='text-blue-500 mb-4'>{formState}</div>}

			{/* Displaying a success message if verification link has been sent */}
			{!!verificationSent && (
				<div className='text-green-500 mb-4'>
					A verification link has been sent to your email.
				</div>
			)}

			{/* Rendering the form with the ResendButton component */}
			<div>
				<form action={action}>
					<button
						type='submit'
						className='bg-white py-2 px-4 rounded disabled:bg-slate-50 disabled:text-slate-500'
						disabled={pending ? true : false}>
						{/* Displaying dynamic text based on pending status */}
						Send verification link {pending ? "..." : ""}
					</button>
				</form>
			</div>
		</>
	);
}
