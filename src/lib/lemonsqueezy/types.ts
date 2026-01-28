export type SubscriptionStatus =
	| "active"
	| "cancelled"
	| "expired"
	| "paused"
	| "past_due"
	| "on_trial"
	| "unpaid";

export type PlanInterval = "month" | "year";

export interface Plan {
	id: string;
	productId: string;
	productName: string;
	variantId: string;
	name: string;
	description: string | null;
	price: string;
	interval: PlanInterval | null;
	intervalCount: number | null;
	maxVideos: number | null; // null means unlimited
	isActive: boolean;
	sort: number;
}

export interface Subscription {
	id: string;
	lemonSqueezyId: string;
	orderId: string | null;
	userId: string;
	planId: string | null;
	status: SubscriptionStatus;
	statusFormatted: string | null;
	customerEmail: string | null;
	customerName: string | null;
	renewsAt: string | null;
	endsAt: string | null;
	trialEndsAt: string | null;
	price: string | null;
	isPaused: boolean;
	isUsageBased: boolean;
	subscriptionItemId: string | null;
}

export interface UserSubscriptionStatus {
	userId: string;
	email: string;
	maxVideos: number | null;
	planName: string;
	subscriptionStatus: SubscriptionStatus | null;
	renewsAt: string | null;
	endsAt: string | null;
	videosThisMonth: number;
}

export interface WebhookEvent {
	id: string;
	eventName: string;
	processed: boolean;
	body: Record<string, unknown>;
	processingError: string | null;
	createdAt: string;
}

// Plan tier definitions for UI
export interface PlanTier {
	id: string;
	name: string;
	slug: string;
	description: string;
	price: number;
	interval: PlanInterval;
	maxVideos: number | null;
	features: string[];
	isPopular?: boolean;
	variantId: string; // Lemon Squeezy variant ID
}

// Default plan tiers configuration
export const PLAN_TIERS: PlanTier[] = [
	{
		id: "free",
		name: "Gratis",
		slug: "free",
		description: "Para explorar la plataforma",
		price: 0,
		interval: "month",
		maxVideos: 0,
		features: [
			"Acceso a la plataforma",
			"Vista previa de funciones",
			"Soporte por email",
		],
		variantId: "", // No variant needed for free
	},
	{
		id: "starter",
		name: "Creador",
		slug: "starter",
		description: "Para quienes quieren comenzar a crear contenido",
		price: 9.99,
		interval: "month",
		maxVideos: 50,
		features: [
			"50 videos al mes",
			"Todas las voces disponibles",
			"Resolución HD",
			"Soporte prioritario",
		],
		variantId: "", // TODO: Replace with actual Lemon Squeezy variant ID
	},
	{
		id: "professional",
		name: "Profesional",
		slug: "professional",
		description: "Para equipos que ya crean contenido de alta calidad",
		price: 29.99,
		interval: "month",
		maxVideos: 200,
		features: [
			"200 videos al mes",
			"Todas las voces disponibles",
			"Resolución 4K",
			"API access",
			"Soporte premium 24/7",
		],
		isPopular: true,
		variantId: "", // TODO: Replace with actual Lemon Squeezy variant ID
	},
	{
		id: "enterprise",
		name: "Empresarial",
		slug: "enterprise",
		description: "Para contenido personalizado a gran escala",
		price: 99.99,
		interval: "month",
		maxVideos: null, // Unlimited
		features: [
			"Videos ilimitados",
			"Voces personalizadas",
			"Resolución 4K",
			"API access ilimitado",
			"Soporte dedicado",
			"Integraciones personalizadas",
		],
		variantId: "", // TODO: Replace with actual Lemon Squeezy variant ID
	},
];

