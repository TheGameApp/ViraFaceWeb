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
							console.log(`${origin}${next}`);
							throw redirect({
								href: `${origin}${next}dashboard`,
							});
						} else if (forwardedHost) {
							throw redirect({
								href: `https://${forwardedHost}${next}dashboard`,
							});
						} else {
							throw redirect({
								href: `${origin}${next}dashboard`,
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
