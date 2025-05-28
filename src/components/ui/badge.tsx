import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-transparent hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/70",
        destructive:
          "bg-destructive text-destructive-foreground border-transparent hover:bg-destructive/70",
        outline:
          "border border-foreground/20 text-foreground bg-background hover:bg-muted/40",
        glow:
          "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md shadow-pink-500/30 hover:shadow-lg",
      },
      size: {
        sm: "text-[10px] px-2 py-0.5",
        md: "text-xs px-3 py-0.5",
        lg: "text-sm px-4 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {icon && <span className="text-[1rem]">{icon}</span>}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };