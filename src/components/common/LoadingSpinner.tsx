import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "simple" | "fancy";
}

export function LoadingSpinner({
  size = "md",
  className,
  variant = "fancy",
}: LoadingSpinnerProps) {
  const containerSizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  };

  if (variant === "simple") {
    const sizes = {
      sm: "w-4 h-4 border-2",
      md: "w-8 h-8 border-3",
      lg: "w-12 h-12 border-4",
    };

    return (
      <div className="flex items-center justify-center">
        <div
          className={cn(
            "animate-spin rounded-full border-primary border-t-transparent",
            sizes[size],
            className
          )}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={`relative ${containerSizes[size]}`}>
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
        
        {/* Spinning Ring 1 - Clockwise */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
        
        {/* Spinning Ring 2 - Counter-clockwise */}
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-accent animate-spin-reverse"></div>
        
        {/* Inner Pulsing Dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`${dotSizes[size]} bg-gradient-to-r from-primary to-accent rounded-full animate-pulse`}
          ></div>
        </div>
      </div>
    </div>
  );
}
