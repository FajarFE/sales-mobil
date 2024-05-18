"use client";

import { Toast } from "@/components/toast/toast";
import { useEffect } from "react";

export const ToastHelper = () => {
	useEffect(() => {
		if (error) {
			Toast({
				title: "Sign in error",
				description: error,
				variant: "error",
			});
		}
	});
};
