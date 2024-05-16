import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

// Now, let's build our Root Layout component
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// This Root Layout serves as the canvas for our application's visual structure
	return (
		<html lang='en'>
			<body className={inter.className}>
				<main className='flex min-h-screen flex-col items-center justify-between p-24'>
					<div className='z-10 items-center font-mono text-sm lg:flex'>
						{/* Now, let's provide context with our Providers component */}
						<SessionProvider>{children}</SessionProvider>
					</div>
				</main>
			</body>
		</html>
	);
}
