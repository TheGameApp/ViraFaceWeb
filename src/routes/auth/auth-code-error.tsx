import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/auth-code-error")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>INSTRUCCIONES</div>;
}
