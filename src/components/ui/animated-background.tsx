"use client";

import { cn } from "@/utils";
import { motion, useReducedMotion, type Variant } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";

interface Square {
  id: number;
  pos: [number, number];
  size?: number;
  opacity?: number;
  delay?: number;
}

interface PatternConfig {
  width?: number;
  height?: number;
  strokeWidth?: number;
  strokeColor?: string;
  strokeDasharray?: string;
  fill?: string;
}

interface AnimationConfig {
  duration?: number;
  repeatDelay?: number;
  easing?: string;
  stagger?: number;
  type?: "fade" | "slide" | "pulse";
}

interface Props extends PatternConfig, AnimationConfig {
  numSquares?: number;
  className?: string;
  maxOpacity?: number;
  squareVariance?: number;
  reduceMotion?: boolean;
  interactive?: boolean;
  pattern?: boolean;
  squareColor?: string;
}

const defaultAnimation: Variant = {
  opacity: 0,
  transition: { duration: 0.5 }
};

const animateIn: Variant = {
  opacity: 1,
  transition: { duration: 1.5, ease: "easeInOut" }
};

export function AnimatedBackground({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeWidth = 1,
  strokeColor = "currentColor",
  strokeDasharray = "0",
  fill = "rgba(0,0,0,0.01)",
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  repeatDelay = 0.5,
  easing = "easeInOut",
  stagger = 0.1,
  type = "fade",
  squareVariance = 0.3,
  reduceMotion = false,
  interactive = false,
  pattern = true,
  squareColor = "currentColor",
  ...props
}: Props) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [squares, setSquares] = useState<Square[]>([]);
  const shouldReduceMotion = useReducedMotion() || reduceMotion;

  // Generate squares with variance in size and opacity
  const generateSquares = (count: number): Square[] => {
    return Array.from({ length: count }, (_, i) => {
      const sizeVariance = 1 + (Math.random() * squareVariance * 2 - squareVariance);
      const opacityVariance = maxOpacity * (0.8 + Math.random() * 0.4);
      const delayVariance = Math.random() * stagger * 2;
      
      return {
        id: i,
        pos: getPos(),
        size: Math.max(5, width * sizeVariance),
        opacity: shouldReduceMotion ? maxOpacity : opacityVariance,
        delay: shouldReduceMotion ? 0 : delayVariance,
      };
    });
  };

  const getPos = (): [number, number] => {
    const cols = Math.floor(dimensions.width / width);
    const rows = Math.floor(dimensions.height / height);
    return [
      Math.floor(Math.random() * cols),
      Math.floor(Math.random() * rows),
    ];
  };

  const updateSquarePosition = (id: number) => {
    if (shouldReduceMotion) return;
    
    setSquares(currentSquares =>
      currentSquares.map(sq =>
        sq.id === id ? { ...sq, pos: getPos() } : sq
      )
    );
  };

  // Initialize and update squares when dimensions change
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      setSquares(generateSquares(numSquares));
    }
  }, [dimensions, numSquares, shouldReduceMotion]);

  // Handle container resize
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);

    // Initial measurement
    updateDimensions();

    return () => resizeObserver.disconnect();
  }, []);

  // Animation variants based on type
  const getAnimationVariant = (): Variant => {
    if (shouldReduceMotion) {
      return {
        opacity: maxOpacity,
        transition: { duration: 0 }
      };
    }

    switch (type) {
      case "slide":
        return {
          opacity: [0, maxOpacity, 0],
          x: [-10, 0, 10],
          y: [-10, 0, 10],
          transition: {
            duration,
            repeatDelay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: easing
          }
        };
      case "pulse":
        return {
          opacity: [maxOpacity * 0.3, maxOpacity, maxOpacity * 0.3],
          scale: [0.9, 1, 0.9],
          transition: {
            duration,
            repeatDelay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: easing
          }
        };
      default: // fade
        return {
          opacity: [0, maxOpacity, 0],
          transition: {
            duration,
            repeatDelay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: easing
          }
        };
    }
  };

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        interactive ? "pointer-events-auto" : "pointer-events-none",
        className
      )}
      {...props}
    >
      {pattern && (
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
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
            />
          </pattern>
        </defs>
      )}
      
      {pattern && (
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      )}

      <svg x={x} y={y} className="overflow-visible">
        {squares.map(({ pos: [xPos, yPos], id, size = width, opacity = maxOpacity, delay = 0 }) => (
          <motion.rect
            key={`${id}-${xPos}-${yPos}`}
            initial={shouldReduceMotion ? undefined : defaultAnimation}
            animate={getAnimationVariant()}
            onAnimationComplete={() => updateSquarePosition(id)}
            custom={delay}
            width={size - strokeWidth}
            height={size - strokeWidth}
            x={xPos * width + strokeWidth / 2}
            y={yPos * height + strokeWidth / 2}
            fill={squareColor}
            strokeWidth="0"
          />
        ))}
      </svg>
    </svg>
  );
}

export default AnimatedBackground;