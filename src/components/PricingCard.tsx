import { Check, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import type { PlanTier } from "@/lib/lemonsqueezy/types";
import { cn } from "@/lib/utils";
import { createCheckoutSession } from "@/server/subscriptions";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";

interface PricingCardProps {
	plan: PlanTier;
	currentPlanSlug?: string | null;
	isLoggedIn?: boolean;
}

export function PricingCard({
	plan,
	currentPlanSlug,
	isLoggedIn = true,
}: PricingCardProps) {
	const [isLoading, setIsLoading] = useState(false);
	const isCurrentPlan = currentPlanSlug === plan.slug;
	const isFree = plan.price === 0;

	const handleSubscribe = async () => {
		if (isFree || !plan.variantId) return;

		setIsLoading(true);
		try {
			const checkoutUrl = await createCheckoutSession({
				data: { variantId: plan.variantId },
			});
			if (checkoutUrl) {
				window.location.href = checkoutUrl;
			}
		} catch (error) {
			console.error("Error creating checkout:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card
			className={cn(
				"relative flex flex-col",
				plan.isPopular && "border-primary shadow-lg",
			)}
		>
			{plan.isPopular && (
				<div className="-top-3 -translate-x-1/2 absolute left-1/2">
					<span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 font-medium text-primary-foreground text-xs">
						<Sparkles className="size-3" />
						Más Popular
					</span>
				</div>
			)}

			<CardHeader className="text-center">
				<CardTitle className="text-xl">{plan.name}</CardTitle>
				<CardDescription>{plan.description}</CardDescription>
			</CardHeader>

			<CardContent className="flex flex-1 flex-col gap-6">
				{/* Price */}
				<div className="text-center">
					<span className="font-bold text-4xl">
						{isFree ? "Gratis" : `$${plan.price}`}
					</span>
					{!isFree && (
						<span className="text-muted-foreground text-sm">
							/{plan.interval === "month" ? "mes" : "año"}
						</span>
					)}
				</div>

				{/* Video limit */}
				<div className="text-center text-muted-foreground text-sm">
					{plan.maxVideos === null
						? "Videos ilimitados"
						: plan.maxVideos === 0
							? "0 videos incluidos"
							: `${plan.maxVideos} videos/mes`}
				</div>

				{/* Features */}
				<ul className="flex-1 space-y-3">
					{plan.features.map((feature) => (
						<li key={feature} className="flex items-start gap-2 text-sm">
							<Check className="mt-0.5 size-4 shrink-0 text-primary" />
							<span>{feature}</span>
						</li>
					))}
				</ul>
			</CardContent>

			<CardFooter>
				<Button
					className="w-full"
					variant={plan.isPopular ? "default" : "outline"}
					disabled={isCurrentPlan || isLoading || (isFree && isLoggedIn)}
					onClick={handleSubscribe}
				>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 size-4 animate-spin" />
							Procesando...
						</>
					) : isCurrentPlan ? (
						"Plan Actual"
					) : isFree ? (
						"Plan Actual"
					) : (
						"Suscribirse"
					)}
				</Button>
			</CardFooter>
		</Card>
	);
}
