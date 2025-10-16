import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const Route = createFileRoute("/auth/callback")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const { origin, searchParams } = new URL(request.url);
				const code = searchParams.get("code");
				let next = searchParams.get("next") ?? "/";

				if (!next.startsWith("/")) {
					next = "/";
				}

				if (code) {
					const supabase = getSupabaseServerClient();
					const { error } = await supabase.auth.exchangeCodeForSession(code);
					if (!error) {
						const forwardedHost = request.headers.get("X-Forwarded-Host");

						const isLocalEnv = process.env.NODE_ENV === "development";
						if (isLocalEnv) {
							throw redirect({
								href: `${origin}${next}`,
							});
						} else if (forwardedHost) {
							throw redirect({
								href: `https://${forwardedHost}${next}`,
							});
						} else {
							throw redirect({
								href: `${origin}${next}`,
							});
						}
					}
				}
				throw redirect({
					to: "/auth/auth-code-error",
				});
			},
		},
	},
});
