"use client";

import { cn } from "@/utils";
import { motion, useReducedMotion, type Variant } from "framer-motion";
import { RefObject, useEffect, useId, useState } from "react";

export interface AnimatedBeamProps {
  className?: string;
  containerRef: RefObject<HTMLElement>;
  fromRef: RefObject<HTMLElement>;
  toRef: RefObject<HTMLElement>;
  curvature?: number;
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  delay?: number;
  duration?: number;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
  dashArray?: string;
  dashOffset?: string;
  animateDash?: boolean;
  strokeLinecap?: "butt" | "round" | "square";
  gradientMidColor?: string;
  gradientMidOffset?: string;
  reduceMotion?: boolean;
  onAnimationComplete?: () => void;
  debug?: boolean;
}

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 4,
  delay = 0,
  pathColor = "gray",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#ffaa40",
  gradientStopColor = "#9c40ff",
  gradientMidColor,
  gradientMidOffset = "50%",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
  dashArray = "0",
  dashOffset = "0",
  animateDash = false,
  strokeLinecap = "round",
  reduceMotion = false,
  onAnimationComplete,
  debug = false,
}) => {
  const id = useId();
  const [pathD, setPathD] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const shouldReduceMotion = useReducedMotion() || reduceMotion;

  // Enhanced gradient coordinates with motion reduction support
  const gradientCoordinates = shouldReduceMotion
    ? {
        x1: reverse ? "90%" : "10%",
        x2: reverse ? "100%" : "0%",
        y1: "0%",
        y2: "0%",
      }
    : {
        x1: reverse ? ["90%", "-10%"] : ["10%", "110%"],
        x2: reverse ? ["100%", "0%"] : ["0%", "100%"],
        y1: ["0%", "0%"],
        y2: ["0%", "0%"],
      };

  // Calculate path with curvature and offsets
  const calculatePath = () => {
    if (!containerRef.current || !fromRef.current || !toRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const rectA = fromRef.current.getBoundingClientRect();
    const rectB = toRef.current.getBoundingClientRect();

    const svgWidth = containerRect.width;
    const svgHeight = containerRect.height;
    setSvgDimensions({ width: svgWidth, height: svgHeight });

    const startX = rectA.left - containerRect.left + rectA.width / 2 + startXOffset;
    const startY = rectA.top - containerRect.top + rectA.height / 2 + startYOffset;
    const endX = rectB.left - containerRect.left + rectB.width / 2 + endXOffset;
    const endY = rectB.top - containerRect.top + rectB.height / 2 + endYOffset;

    // Calculate control points based on curvature
    const controlX = (startX + endX) / 2;
    const controlY = (startY + endY) / 2 - curvature;

    // Create either a quadratic or cubic bezier based on curvature
    const d = curvature !== 0
      ? `M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`
      : `M ${startX},${startY} L ${endX},${endY}`;

    setPathD(d);
  };

  // Setup resize and mutation observers
  useEffect(() => {
    if (!containerRef.current || !fromRef.current || !toRef.current) return;

    const update = () => calculatePath();
    update();

    // Use ResizeObserver for container and elements
    const resizeObserver = new ResizeObserver(update);
    [containerRef.current, fromRef.current, toRef.current].forEach(el => {
      if (el) resizeObserver.observe(el);
    });

    // Use MutationObserver for more subtle changes
    const mutationObserver = new MutationObserver(update);
    [fromRef.current, toRef.current].forEach(el => {
      if (el) mutationObserver.observe(el, { attributes: true });
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
  ]);

  // Animation variants for dash array if enabled
  const dashAnimation = animateDash
    ? {
        pathLength: [0, 1],
        pathSpacing: [0, 0.5],
        pathOffset: [0, 1],
        transition: {
          duration: shouldReduceMotion ? 0 : duration,
          delay: shouldReduceMotion ? 0 : delay,
          ease: [0.16, 1, 0.3, 1],
          repeat: Infinity,
          repeatType: "loop",
        },
      }
    : {};

  return (
    <svg
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "pointer-events-none absolute left-0 top-0 transform-gpu",
        debug ? "outline outline-1 outline-red-500" : "",
        className
      )}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
    >
      {/* Base path with static color */}
      {pathD && (
        <motion.path
          d={pathD}
          stroke={pathColor}
          strokeWidth={pathWidth}
          strokeOpacity={pathOpacity}
          strokeLinecap={strokeLinecap}
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
          initial={dashAnimation}
          animate={dashAnimation}
          onAnimationComplete={onAnimationComplete}
        />
      )}

      {/* Animated gradient path */}
      {pathD && (
        <motion.path
          d={pathD}
          strokeWidth={pathWidth}
          stroke={`url(#${id})`}
          strokeOpacity="1"
          strokeLinecap={strokeLinecap}
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
          initial={dashAnimation}
          animate={dashAnimation}
        />
      )}

      <defs>
        <motion.linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          initial={shouldReduceMotion ? gradientCoordinates : undefined}
          animate={gradientCoordinates}
          transition={{
            delay: shouldReduceMotion ? 0 : delay,
            duration: shouldReduceMotion ? 0 : duration,
            ease: [0.16, 1, 0.3, 1],
            repeat: Infinity,
            repeatDelay: 0,
          }}
        >
          <stop stopColor={gradientStartColor} stopOpacity="0" />
          <stop offset="10%" stopColor={gradientStartColor} />
          {gradientMidColor && (
            <stop offset={gradientMidOffset} stopColor={gradientMidColor} />
          )}
          <stop offset="90%" stopColor={gradientStopColor} />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </motion.linearGradient>
      </defs>

      {/* Debug elements */}
      {debug && pathD && (
        <>
          <circle cx={pathD.split(" ")[1]} cy={pathD.split(" ")[2]} r="5" fill="red" />
          <circle cx={pathD.split(" ").slice(-2)[0]} cy={pathD.split(" ").slice(-1)[0]} r="5" fill="blue" />
        </>
      )}
    </svg>
  );
};