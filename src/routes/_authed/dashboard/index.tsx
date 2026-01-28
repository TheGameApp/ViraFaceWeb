import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { PricingCard } from "@/components/PricingCard";
import { PLAN_TIERS } from "@/lib/lemonsqueezy/types";
import { getUserSubscriptionStatus } from "@/server/subscriptions";

export const Route = createFileRoute("/_authed/dashboard/")({
	component: DashboardIndex,
});

function DashboardIndex() {
	const { data: subscriptionStatus, isLoading } = useQuery({
		queryKey: ["subscription-status"],
		queryFn: () => getUserSubscriptionStatus(),
	});

	const currentPlanSlug = subscriptionStatus?.planName?.toLowerCase() ?? "free";

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-12 text-center">
				<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary text-sm">
					<Zap className="size-4" />
					<span>Planes de Suscripción</span>
				</div>
				<h1 className="mb-4 font-bold text-3xl md:text-4xl">
					Elige tu plan perfecto
				</h1>
				<p className="mx-auto max-w-2xl text-muted-foreground">
					Desbloquea el poder de la creación de videos con IA. Todos los planes
					incluyen acceso a nuestra tecnología de última generación.
				</p>
			</div>

			{/* Current Plan Info */}
			{subscriptionStatus && subscriptionStatus.planName !== "Gratis" && (
				<div className="mx-auto mb-8 max-w-md rounded-lg border bg-muted/30 p-4 text-center">
					<p className="font-medium text-sm">
						Plan actual:{" "}
						<span className="text-primary">{subscriptionStatus.planName}</span>
					</p>
					<p className="mt-1 text-muted-foreground text-xs">
						{subscriptionStatus.maxVideos === null
							? "Videos ilimitados"
							: `${subscriptionStatus.videosThisMonth} de ${subscriptionStatus.maxVideos} videos usados este mes`}
					</p>
				</div>
			)}

			{/* Pricing Cards Grid */}
			<div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
				{PLAN_TIERS.map((plan) => (
					<PricingCard
						key={plan.id}
						plan={plan}
						currentPlanSlug={isLoading ? undefined : currentPlanSlug}
						isLoggedIn
					/>
				))}
			</div>

			{/* FAQ or additional info */}
			<div className="mt-12 text-center">
				<p className="text-muted-foreground text-sm">
					¿Tienes preguntas?{" "}
					<a
						href="mailto:soporte@viraface.com"
						className="text-primary underline hover:no-underline"
					>
						Contáctanos
					</a>
				</p>
				<p className="mt-2 text-muted-foreground text-xs">
					Cancela en cualquier momento. Sin compromisos.
				</p>
			</div>
		</div>
	);
}
