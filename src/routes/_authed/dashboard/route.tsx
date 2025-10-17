import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const [isImageToVideoOpen, setIsImageToVideoOpen] = useState(false);

	const handleLogout = () => {
		navigate({ to: "/logout" });
	};

	return (
		<SidebarProvider>
			<AppSidebar onOpenImageToVideo={() => setIsImageToVideoOpen(true)} />
			<SidebarInset
				className={cn(
					// Set content container, so we can use container queries
					"@container/content",

					// If layout is fixed, set the height
					// to 100svh to prevent overflow
					"has-[[data-layout=fixed]]:h-svh",

					// If layout is fixed and sidebar is inset,
					// set the height to 100svh - spacing (total margins) to prevent overflow
					"peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]",
				)}
			>
				<div className="sticky top-0 flex w-full justify-between">
					<SidebarTrigger />
					<Button className="m-1 text-sm" size="sm" onClick={handleLogout}>
						Logout
					</Button>
				</div>
				<Outlet />
			</SidebarInset>
			{/* Imagen a Video Modal */}
			<Dialog open={isImageToVideoOpen} onOpenChange={setIsImageToVideoOpen}>
				<DialogContent className="min-w-4xl" showCloseButton>
					<DialogHeader>
						<DialogTitle>Crear Video con tu Foto</DialogTitle>
					</DialogHeader>
					<div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2">
						{/* Left: upload photo */}
						<div className="flex flex-col items-center justify-center rounded-md border border-dashed p-6 text-center">
							<label className="cursor-pointer">
								<input type="file" accept="image/*" className="hidden" />
								<div className="font-medium text-sm">Arrastra tu foto aquí</div>
								<div className="text-muted-foreground text-xs">
									o haz clic para seleccionar
								</div>
								<div className="mt-2 text-muted-foreground text-xs">
									Formatos: JPEG, PNG, WebP • Máximo 50MB
								</div>
							</label>
						</div>
						{/* Right: form */}
						<div className="flex flex-col gap-3">
							<div>
								<div className="mb-1 font-medium text-sm">Título</div>
								<Input
									className="mt-0.5"
									placeholder="Mi video personalizado"
								/>
							</div>
							<div>
								<div className="mb-1 font-medium text-sm">Guión</div>
								<Textarea placeholder="Escribe aquí el texto que quieres que diga tu avatar..." />
							</div>
							<div>
								<div className="mb-1 font-medium text-sm">
									Prompt de Movimiento
								</div>
								<Textarea placeholder="Describe cómo quieres que se mueva tu avatar..." />
								<p className="mt-1 text-muted-foreground text-xs">
									Opcional: Deja vacío para usar movimientos automáticos
								</p>
							</div>
							<div className="grid grid-cols-2 items-end gap-3">
								<div>
									<div className="mb-1 font-medium text-sm">Voz</div>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder="Selecciona una voz" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="voz-1">Voz 1</SelectItem>
											<SelectItem value="voz-2">Voz 2</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<span>Vertical</span>
								<Switch />
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="ghost"
							onClick={() => setIsImageToVideoOpen(false)}
						>
							Cancelar
						</Button>
						<Button>Generar Video</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</SidebarProvider>
	);
}
