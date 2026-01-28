import { createServerClient } from "@supabase/ssr";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/webhooks/lemonsqueezy")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const rawBody = await request.text();
					const signature = request.headers.get("X-Signature");

					if (!signature) {
						return new Response("Missing signature", { status: 401 });
					}

					// Verify webhook signature using Web Crypto API (Cloudflare Workers compatible)
					const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
					if (!secret) {
						console.error("LEMONSQUEEZY_WEBHOOK_SECRET is not set");
						return new Response("Server configuration error", { status: 500 });
					}
					const encoder = new TextEncoder();
					const key = await crypto.subtle.importKey(
						"raw",
						encoder.encode(secret),
						{ name: "HMAC", hash: "SHA-256" },
						false,
						["sign"],
					);

					const signatureBuffer = await crypto.subtle.sign(
						"HMAC",
						key,
						encoder.encode(rawBody),
					);

					const digest = Array.from(new Uint8Array(signatureBuffer))
						.map((b) => b.toString(16).padStart(2, "0"))
						.join("");

					if (signature !== digest) {
						return new Response("Invalid signature", { status: 401 });
					}

					const payload = JSON.parse(rawBody);

					// Create Supabase client with service role for admin operations
					const supabaseUrl = process.env.VITE_SUPABASE_URL;
					const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

					if (!supabaseUrl || !supabaseServiceKey) {
						console.error("Supabase configuration missing");
						return new Response("Server configuration error", { status: 500 });
					}

					const supabase = createServerClient(supabaseUrl, supabaseServiceKey, {
						cookies: {
							getAll: () => [],
							setAll: () => {},
						},
					});

					// Store webhook event for debugging/audit
					await supabase.from("webhook_events").insert({
						event_name: payload.meta.event_name,
						body: payload,
					});

					// Process subscription events
					const eventName = payload.meta.event_name as string;

					if (eventName.startsWith("subscription_")) {
						await processSubscriptionWebhook(supabase, payload);
					}

					return new Response("OK", { status: 200 });
				} catch (error) {
					console.error("Webhook error:", error);
					return new Response("Internal error", { status: 500 });
				}
			},
		},
	},
});

async function processSubscriptionWebhook(
	supabase: ReturnType<typeof createServerClient>,
	payload: Record<string, unknown>,
) {
	const data = payload.data as Record<string, unknown>;
	const attributes = data.attributes as Record<string, unknown>;
	const meta = payload.meta as Record<string, unknown>;
	const customData = meta.custom_data as Record<string, string>;
	const userId = customData?.user_id;

	if (!userId) {
		console.error("No user_id in webhook custom_data");
		return;
	}

	// Get plan from variant_id
	const variantId = String(attributes.variant_id);
	const { data: plan } = await supabase
		.from("plans")
		.select("id")
		.eq("variant_id", variantId)
		.single();

	const firstItem = attributes.first_subscription_item as Record<
		string,
		unknown
	> | null;

	const subscriptionData = {
		lemon_squeezy_id: String(data.id),
		order_id: attributes.order_id ? String(attributes.order_id) : null,
		user_id: userId,
		plan_id: plan?.id ?? null,
		status: String(attributes.status),
		status_formatted: attributes.status_formatted
			? String(attributes.status_formatted)
			: null,
		customer_email: attributes.user_email
			? String(attributes.user_email)
			: null,
		customer_name: attributes.user_name ? String(attributes.user_name) : null,
		renews_at: attributes.renews_at ? String(attributes.renews_at) : null,
		ends_at: attributes.ends_at ? String(attributes.ends_at) : null,
		trial_ends_at: attributes.trial_ends_at
			? String(attributes.trial_ends_at)
			: null,
		price: firstItem?.price ? String(firstItem.price) : null,
		is_paused: attributes.pause !== null,
		is_usage_based: firstItem?.is_usage_based === true,
		subscription_item_id: firstItem?.id ? String(firstItem.id) : null,
		updated_at: new Date().toISOString(),
	};

	// Upsert subscription (insert or update on conflict)
	const { error } = await supabase
		.from("subscriptions")
		.upsert(subscriptionData, {
			onConflict: "lemon_squeezy_id",
		});

	if (error) {
		console.error("Error upserting subscription:", error);
	}

	// Mark webhook as processed
	await supabase
		.from("webhook_events")
		.update({ processed: true })
		.eq("body->>id", payload.meta?.webhook_id);
}
