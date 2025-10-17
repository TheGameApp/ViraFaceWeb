import { createFileRoute } from "@tanstack/react-router";
import { ThemeSwitch } from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const navigate = Route.useNavigate();

	const handleDashboard = () => {
		navigate({ to: "/dashboard" });
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
			{/* Header */}
			<header className="flex items-center justify-between px-6 py-4 md:px-12 md:py-6">
				<div className="flex items-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70">
						<span className="font-bold text-lg text-primary-foreground">V</span>
					</div>
					<span className="font-bold text-slate-900 text-xl dark:text-white">
						ViraFace
					</span>
				</div>

				<div className="flex items-center gap-4">
					<Button variant="default" size="sm" onClick={handleDashboard}>
						Dashboard
						<span className="ml-1">→</span>
					</Button>
					<ThemeSwitch />
				</div>
			</header>

			{/* Hero Section */}
			<main className="flex flex-col items-center justify-center px-6 py-20 md:py-32">
				<div className="max-w-3xl text-center">
					{/* Main Heading */}
					<h1 className="mb-6 font-bold text-4xl text-slate-900 leading-tight md:text-5xl lg:text-6xl dark:text-white">
						Crea contenido para educación en segundos
					</h1>

					{/* Subheading */}
					<p className="mb-12 text-lg text-slate-600 md:text-xl dark:text-slate-300">
						Potenciamos tus ideas mientras creamos los videos más atractivos que
						harán crecer tu negocio con ViraFace AI.
					</p>

					{/* CTA Buttons */}
					<div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
						<Button variant="default" size="lg" onClick={handleDashboard}>
							Dashboard
							<span className="ml-2">→</span>
						</Button>
					</div>
				</div>
			</main>
		</div>
	);
}
