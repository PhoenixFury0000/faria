import { cn } from "@/utils";
import { useId } from "react";

interface Props {
    children: React.ReactNode;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    squares?: Array<[x: number, y: number]>;
    strokeDasharray?: string | number;
    className?: string;
    animateSquares?: boolean;
    [key: string]: any;
}

export function Background({
    children,
    width = 40,
    height = 40,
    x = -1,
    y = -1,
    strokeDasharray = "4 2",
    squares,
    className,
    animateSquares = false,
    ...props
}: Props) {
    const id = useId();

    return (
        <div className="relative flex min-h-screen w-full flex-col">
            {/* Radial mask fade effect */}
            <div className="[mask-image:radial-gradient(600px_circle_at_center,white,transparent)] absolute inset-0 h-full w-full z-10 pointer-events-none" />

            {/* Grid layer */}
            <div className="absolute inset-0 min-h-screen w-full">
                <svg
                    aria-hidden="true"
                    className={cn(
                        "pointer-events-none h-full w-full fill-neutral-400/20 stroke-neutral-400/20",
                        className
                    )}
                    {...props}
                >
                    <defs>
                        <pattern
                            id={id}
                            width={width}
                            height={height}
                            patternUnits="userSpaceOnUse"
                            x={x}
                            y={y}
                        >
                            <path
                                d={`M.5 ${height}V.5H${width}`}
                                fill="none"
                                strokeDasharray={strokeDasharray}
                            />
                        </pattern>
                    </defs>
                    <rect
                        width="100%"
                        height="100%"
                        strokeWidth={0}
                        fill={`url(#${id})`}
                    />

                    {/* Highlighted squares */}
                    {squares?.length && (
                        <svg x={x} y={y} className="overflow-visible">
                            {squares.map(([x, y]) => (
                                <rect
                                    key={`${x}-${y}`}
                                    x={x * width + 1}
                                    y={y * height + 1}
                                    width={width - 2}
                                    height={height - 2}
                                    className={cn(
                                        "fill-neutral-300/30",
                                        animateSquares &&
                                            "animate-ping duration-[2000ms] ease-in-out"
                                    )}
                                />
                            ))}
                        </svg>
                    )}
                </svg>
            </div>

            {/* Content */}
            <div className="relative z-20">{children}</div>
        </div>
    );
}

export default Background;