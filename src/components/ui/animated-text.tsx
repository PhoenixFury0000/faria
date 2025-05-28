import { cn } from "@/utils";
import { CSSProperties, FC, ReactNode } from "react";

interface Props {
    children: ReactNode;
    className?: string;
    shimmerWidth?: number;
}

const AnimatedText: FC<Props> = ({
    children,
    className,
    shimmerWidth = 100,
}) => {
    return (
        <p
            style={
                {
                    "--shimmer-width": `${shimmerWidth}px`,
                    "--shimmer-color": "rgba(0, 0, 0, 0.8)",
                    "--shimmer-speed": "1.8s",
                } as CSSProperties
            }
            className={cn(
                "mx-auto max-w-xl text-center text-muted-foreground font-semibold tracking-wide",

                // Shimmer animation
                "animate-shimmer bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shimmer-width)_100%]",
                
                // Gradient shimmer
                "bg-gradient-to-r from-transparent via-[var(--shimmer-color)] via-50% to-transparent",

                // Performance optimization
                "motion-safe:will-change-[background-position]",

                className,
            )}
        >
            {children}
        </p>
    );
};

export default AnimatedText;