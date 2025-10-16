import { useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "../ui/button";

const loginFn = createServerFn().handler(async () => {
	const supabase = getSupabaseServerClient();

	const { error, data } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: "http://localhost:3000/auth/callback/",
		},
	});

	if (error) {
		console.log(error);
		return { error: true, message: error.message };
	}
	return { data };
});

export default function Login() {
	const navigate = useNavigate();

	const handleLogin = async () => {
		const { data, error, message } = await loginFn();

		if (error) alert(message);

		navigate({ href: data?.url });
	};

	return (
		<div className="container w-full">
			<Card className="mx-auto max-w-sm">
				<CardHeader>
					<CardTitle>Inicia sesion</CardTitle>
				</CardHeader>
				<CardContent>
					<Button type="button" onClick={handleLogin}>
						Login
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
