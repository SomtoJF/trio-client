import { SenderTypeEnum } from "@/types";
import { GiArtificialHive } from "react-icons/gi";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
interface Props {
	senderType: SenderTypeEnum;
	messageContent: string;
	senderName?: string;
}

const tagStyles = "text-blue-500";

export function OptimalMessage({
	senderType,
	messageContent,
	senderName,
}: Props) {
	return (
		<div className="text-black rounded-xl p-2 max-w-full sm:max-w-[80%] shadow-md border-[1px] border-slate-600 bg-slate-900 space-y-4 relative ">
			<div className="flex w-full justify-between items-center gap-2">
				<p
					className={`${
						senderType === SenderTypeEnum.USER
							? ""
							: "text-xs flex gap-1 items-center"
					} text-xs font-semibold mb-1 text-gray-200`}
				>
					<GiArtificialHive className="text-base" />
					{senderName}
				</p>
				<HoverBorderGradient
					containerClassName="rounded-full"
					as="button"
					className="bg-gray-900 text-gray-200 flex items-center py-1 px-4 space-x-2 text-xs font-semibold group"
				>
					<p>optimal response</p>
				</HoverBorderGradient>
			</div>
			<p className="text-sm text-gray-100">
				{messageContent.split(/(@\w+)/g).map((part, index) =>
					part.startsWith("@") ? (
						<span key={index} className={tagStyles}>
							{part}
						</span>
					) : (
						part
					)
				)}
			</p>
			<ShootingStars maxSpeed={15} minSpeed={5} />
			<StarsBackground starDensity={0.0003} />
		</div>
	);
}
