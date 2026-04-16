import avatarImg from "@/assets/avatar.png";
import { cn } from "@/lib/utils";

type AvatarState = "idle" | "thinking" | "done";

interface Props {
  state?: AvatarState;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function DynamicAvatar({ state = "idle", size = "sm", className }: Props) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const badgeSizeClasses = {
    sm: "-top-1.5 -right-1.5 w-5 h-5 text-[10px]",
    md: "-top-2 -right-2 w-6 h-6 text-xs",
    lg: "-top-2 -right-2 w-7 h-7 text-sm",
  };

  return (
    <div className={cn("relative shrink-0", className)}>
      <img
        src={avatarImg}
        alt="Travel Star"
        className={cn(
          sizeClasses[size],
          "rounded-full object-cover",
          state === "thinking" && "animate-avatar-thinking",
          state === "done" && "animate-avatar-done"
        )}
        width={size === "sm" ? 32 : size === "md" ? 48 : 64}
        height={size === "sm" ? 32 : size === "md" ? 48 : 64}
        loading="lazy"
      />

      {/* Question mark badge while thinking */}
      {state === "thinking" && (
        <span
          className={cn(
            "absolute flex items-center justify-center rounded-full bg-secondary text-secondary-foreground font-bold animate-bounce-question shadow-md",
            badgeSizeClasses[size]
          )}
        >
          ?
        </span>
      )}

      {/* Smile badge when done */}
      {state === "done" && (
        <span
          className={cn(
            "absolute flex items-center justify-center rounded-full bg-accent text-accent-foreground animate-pop-in shadow-md",
            badgeSizeClasses[size]
          )}
        >
          😊
        </span>
      )}
    </div>
  );
}
