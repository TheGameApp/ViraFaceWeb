import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const loginFn = createServerFn().handler(async () => {
	const supabase = getSupabaseServerClient();
	const isLocalEnv = process.env.NODE_ENV === "development";

	const { error, data } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: isLocalEnv
				? "http://localhost:3000/auth/callback/"
				: "https://vira-face-web.thegameapp00.workers.dev/auth/callback",
		},
	});

	if (error) {
		console.log(error);
		return { error: true, message: error.message };
	}
	return { data };
});

export const logoutFn = createServerFn().handler(async () => {
	const supabase = getSupabaseServerClient();
	const { error } = await supabase.auth.signOut();

	console.log("logout");

	if (error) {
		return {
			error: true,
			message: error.message,
		};
	}

	throw redirect({
		href: "/",
	});
});
