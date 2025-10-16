import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const navigate = Route.useNavigate();
	const _goMain = () => {
		navigate({ to: "/home" });
	};

	return (
		<Button type="button" onClick={_goMain}>
			GO MAIN
		</Button>
	);
}
