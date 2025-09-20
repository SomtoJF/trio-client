import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Github,
	LogOut,
	MessageCircleHeart,
	Plus,
	Settings,
	User,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export function NavDropdown({
	children,
	side,
}: {
	children: ReactNode;
	side?: "top" | "right" | "bottom" | "left";
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" side={side}>
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem disabled>
						<User className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</DropdownMenuItem>
					<DropdownMenuItem disabled>
						<Settings className="mr-2 h-4 w-4" />
						<span>Settings</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<Link
						href={"https://github.com/somtojf/trio"}
						target="_blank"
						className="space-x-2 flex items-center"
					>
						<Github className=" h-4 w-4" />
						<span>GitHub</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Link
						href="mailto:somtochukwujf@gmail.com"
						target="_blank"
						className="space-x-2 flex items-center"
					>
						<MessageCircleHeart className="h-4 w-4" />
						<span>Feedback</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<Link
						href="/signout"
						className="space-x-2 flex items-center text-red-500"
					>
						<LogOut className=" h-4 w-4" />
						<span>Log out</span>
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
