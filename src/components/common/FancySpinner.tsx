export interface FancySpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  subtext?: string;
}

export function FancySpinner({
  size = "md",
  text = "Loading",
  subtext,
}: FancySpinnerProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
    xl: "w-24 h-24",
  };

  const dotSizes = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
    xl: "w-4 h-4",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  };

  return (
    <div className="text-center space-y-6">
      {/* Fancy Multi-Circle Spinner */}
      <div className={`relative ${sizeClasses[size]} mx-auto`}>
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

      {/* Loading Text with Animated Dots */}
      {text && (
        <div className="space-y-2">
          <p
            className={`${textSizes[size]} font-medium bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse`}
          >
            {text}
            <span className="inline-flex ml-0.5">
              <span className="animate-bounce" style={{ animationDelay: "0ms" }}>
                .
              </span>
              <span
                className="animate-bounce"
                style={{ animationDelay: "150ms" }}
              >
                .
              </span>
              <span
                className="animate-bounce"
                style={{ animationDelay: "300ms" }}
              >
                .
              </span>
            </span>
          </p>
          {subtext && (
            <p className="text-sm text-muted-foreground">{subtext}</p>
          )}
        </div>
      )}
    </div>
  );
}

// Full-screen loading overlay
export function FancySpinnerOverlay({
  size = "lg",
  text = "Loading",
  subtext = "Please wait a moment",
}: FancySpinnerProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <FancySpinner size={size} text={text} subtext={subtext} />
    </div>
  );
}

