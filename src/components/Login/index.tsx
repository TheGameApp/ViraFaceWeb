import { useNavigate } from "@tanstack/react-router";
import { Loader2, LogIn } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loginFn } from "@/server/auth";
import { Button } from "../ui/button";

export default function Login() {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async () => {
		try {
			setIsLoading(true);
			const { data, error, message } = await loginFn();
			if (error) return alert(message);
			if (data?.url) navigate({ href: data.url });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-[100svh] items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 dark:from-slate-950 dark:to-slate-900">
			<Card className="mx-auto w-full max-w-sm shadow-sm">
				<CardHeader className="space-y-2">
					<div className="flex items-center justify-center">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 font-bold text-primary-foreground">
							V
						</div>
					</div>
					<CardTitle className="text-center">Bienvenido</CardTitle>
					<p className="text-center text-muted-foreground text-sm">
						Inicia sesión para continuar
					</p>
				</CardHeader>
				<CardContent className="space-y-3">
					<Button
						variant="outline"
						type="button"
						onClick={handleLogin}
						className="w-full"
						disabled={isLoading}
					>
						{isLoading ? (
							<Loader2 className="mr-2 size-4 animate-spin" />
						) : (
							<LogIn className="mr-2 size-4" />
						)}
						Continuar con Google
					</Button>
					<p className="text-center text-muted-foreground text-xs">
						Usamos Google para autenticarte de forma segura.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
