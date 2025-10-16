import { createBrowserClient } from "@supabase/ssr";

export function getSupabaseBrowserClient() {
	return createBrowserClient(
		import.meta.env.VITE_SUPABASE_URL!,
		import.meta.env.VITE_SUPABASE_ANON_KEY!,
		{
			auth: {
				flowType: "pkce",
				detectSessionInUrl: true, // This detects the code automatically
				persistSession: true,
				autoRefreshToken: true,
			},
		},
	);
}
