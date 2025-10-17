import {
	AudioLines,
	Camera,
	Clapperboard,
	LayoutGrid,
	PersonStanding,
} from "lucide-react";
import { ThemeSwitch } from "@/components/ThemeSwitcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/components/ui/sidebar";

export type AppSidebarProps = Readonly<{ onOpenImageToVideo?: () => void }>;

export function AppSidebar({ onOpenImageToVideo }: AppSidebarProps) {
	return (
		<Sidebar>
			<SidebarHeader>
				<div className="flex items-center justify-between gap-2 px-2 py-1">
					{/* Brand */}
					<div className="flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
							<span className="font-bold text-sm">VF</span>
						</div>
						<span className="font-semibold">ViraFace</span>
					</div>
					{/* Quick actions */}
					<div className="flex items-center gap-1">
						<ThemeSwitch />
						<button
							type="button"
							className="inline-flex size-8 items-center justify-center rounded-full text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
						>
							<LayoutGrid className="size-4" />
						</button>
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent className="overflow-x-hidden">
				{/* Main menu */}
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton className="h-12">
									<span className="flex size-10 items-center justify-center rounded-full bg-muted/60 text-foreground/80">
										<Clapperboard className="size-5" />
									</span>
									<span className="font-medium">Generar Contenido</span>
								</SidebarMenuButton>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarMenuButton
									className="h-12"
									onClick={onOpenImageToVideo}
								>
									<span className="flex size-10 items-center justify-center rounded-full bg-muted/60 text-foreground/80">
										<Camera className="size-5" />
									</span>
									<span className="font-medium">Imagen a Video</span>
								</SidebarMenuButton>
								<SidebarMenuBadge className="bg-primary px-2 text-primary-foreground">
									Nuevo
								</SidebarMenuBadge>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarMenuButton className="h-12">
									<span className="flex size-10 items-center justify-center rounded-full bg-muted/60 text-foreground/80">
										<PersonStanding className="size-5" />
									</span>
									<span className="font-medium">Galería de Avatares</span>
								</SidebarMenuButton>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarMenuButton className="h-12">
									<span className="flex size-10 items-center justify-center rounded-full bg-muted/60 text-foreground/80">
										<AudioLines className="size-5" />
									</span>
									<span className="font-medium">Galería de Voces</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarSeparator className="my-2" />
			</SidebarContent>
			<SidebarFooter />
		</Sidebar>
	);
}
