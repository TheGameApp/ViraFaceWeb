// src/routes/__root.tsx
/// <reference types="vite/client" />

import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/context/theme/theme-provider";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import appCss from "@/styles/app.css?url";

const fetchUser = createServerFn({ method: "GET" }).handler(async () => {
	const supabase = getSupabaseServerClient();
	const { data, error: _error } = await supabase.auth.getUser();
	if (!data.user?.email) {
		return null;
	}

	return {
		email: data.user.email,
	};
});

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
	{
		beforeLoad: async () => {
			const user = await fetchUser();

			return {
				user,
			};
		},
		head: () => ({
			meta: [
				{
					charSet: "utf-8",
				},
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1",
				},
				{
					title: "TanStack Start Starter",
				},
			],
			links: [
				{
					rel: "stylesheet",
					href: appCss,
				},
			],
		}),

		component: RootComponent,
	},
);

function RootComponent() {
	return (
		<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
			<RootDocument>
				<Outlet />
			</RootDocument>
		</ThemeProvider>
	);
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="es">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
