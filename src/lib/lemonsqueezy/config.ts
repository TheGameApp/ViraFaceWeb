import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

export function configureLemonSqueezy() {
	const requiredVars = [
		"LEMONSQUEEZY_API_KEY",
		"LEMONSQUEEZY_STORE_ID",
		"LEMONSQUEEZY_WEBHOOK_SECRET",
	];

	const missing = requiredVars.filter((varName) => !process.env[varName]);

	if (missing.length > 0) {
		throw new Error(
			`Missing required LEMONSQUEEZY env variables: ${missing.join(", ")}`,
		);
	}

	const apiKey = process.env.LEMONSQUEEZY_API_KEY;
	if (!apiKey) {
		throw new Error("LEMONSQUEEZY_API_KEY is required");
	}

	lemonSqueezySetup({
		apiKey,
		onError: (error) => console.error("Lemon Squeezy Error:", error),
	});
}

export function getLemonSqueezyStoreId(): string {
	const storeId = process.env.LEMONSQUEEZY_STORE_ID;
	if (!storeId) {
		throw new Error("LEMONSQUEEZY_STORE_ID is required");
	}
	return storeId;
}
