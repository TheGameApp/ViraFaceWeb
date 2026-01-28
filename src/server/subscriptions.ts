import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { createServerFn } from "@tanstack/react-start";
import {
	configureLemonSqueezy,
	getLemonSqueezyStoreId,
} from "@/lib/lemonsqueezy/config";
import type { UserSubscriptionStatus } from "@/lib/lemonsqueezy/types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// Get user's current subscription and usage status
export const getUserSubscriptionStatus = createServerFn({
	method: "GET",
}).handler(async (): Promise<UserSubscriptionStatus | null> => {
	const supabase = getSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return null;
	}

	// Get active subscription for the user
	const { data: subscription } = await supabase
		.from("subscriptions")
		.select(
			`
			*,
			plans (
				name,
				max_videos
			)
		`,
		)
		.eq("user_id", user.id)
		.in("status", ["active", "on_trial"])
		.order("created_at", { ascending: false })
		.limit(1)
		.single();

	// Count videos this month
	const startOfMonth = new Date();
	startOfMonth.setDate(1);
	startOfMonth.setHours(0, 0, 0, 0);

	const { count: videosThisMonth } = await supabase
		.from("video_generations")
		.select("*", { count: "exact", head: true })
		.eq("user_id", user.id)
		.eq("status", "completed")
		.gte("created_at", startOfMonth.toISOString());

	return {
		userId: user.id,
		email: user.email ?? "",
		maxVideos: subscription?.plans?.max_videos ?? 0,
		planName: subscription?.plans?.name ?? "Gratis",
		subscriptionStatus: subscription?.status ?? null,
		renewsAt: subscription?.renews_at ?? null,
		endsAt: subscription?.ends_at ?? null,
		videosThisMonth: videosThisMonth ?? 0,
	};
});

// Create a checkout session for a plan
export const createCheckoutSession = createServerFn({ method: "POST" })
	.validator((data: { variantId: string }) => data)
	.handler(async ({ data }) => {
		configureLemonSqueezy();

		const supabase = getSupabaseServerClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error("Not authenticated");
		}

		const appUrl =
			process.env.APP_URL ?? "https://vira-face-web.thegameapp00.workers.dev";

		const checkout = await createCheckout(
			getLemonSqueezyStoreId(),
			data.variantId,
			{
				checkoutOptions: {
					embed: false,
					media: false,
					logo: true,
				},
				checkoutData: {
					email: user.email ?? "",
					custom: {
						user_id: user.id,
					},
				},
				productOptions: {
					enabledVariants: [data.variantId],
					redirectUrl: `${appUrl}/dashboard?subscription=success`,
					receiptButtonText: "Ir al Dashboard",
					receiptThankYouNote:
						"¡Gracias por suscribirte a ViraFace! Ya puedes crear videos.",
				},
			},
		);

		return checkout.data?.data.attributes.url ?? null;
	});

// Check if user can generate videos
export const canGenerateVideo = createServerFn({ method: "GET" }).handler(
	async (): Promise<{ allowed: boolean; message: string }> => {
		const status = await getUserSubscriptionStatus();

		if (!status) {
			return { allowed: false, message: "Debes iniciar sesión" };
		}

		// Free users cannot generate
		if (status.maxVideos === 0) {
			return {
				allowed: false,
				message: "Actualiza tu plan para crear videos",
			};
		}

		// Unlimited plan
		if (status.maxVideos === null) {
			return { allowed: true, message: "Videos ilimitados disponibles" };
		}

		// Check limit
		if (status.videosThisMonth >= status.maxVideos) {
			return {
				allowed: false,
				message: `Has alcanzado tu límite de ${status.maxVideos} videos este mes`,
			};
		}

		const remaining = status.maxVideos - status.videosThisMonth;
		return {
			allowed: true,
			message: `${remaining} videos restantes este mes`,
		};
	},
);
