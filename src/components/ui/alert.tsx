import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X, AlertCircle, CheckCircle2, Info, Bell } from "lucide-react"

import { cn } from "@/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 pr-8 [&>svg~*]:pl-8 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        destructive:
          "bg-destructive/10 border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success:
          "bg-emerald-50 border-emerald-500/50 text-emerald-700 dark:border-emerald-500 [&>svg]:text-emerald-500",
        warning:
          "bg-amber-50 border-amber-500/50 text-amber-700 dark:border-amber-500 [&>svg]:text-amber-500",
        info: "bg-blue-50 border-blue-500/50 text-blue-700 dark:border-blue-500 [&>svg]:text-blue-500",
      },
      elevation: {
        flat: "shadow-none",
        low: "shadow-sm",
        high: "shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
      elevation: "low",
    },
  }
)

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  closable?: boolean
  onClose?: () => void
  icon?: React.ReactNode
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, elevation, closable, onClose, icon, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(true)

    if (!isOpen) return null

    const handleClose = () => {
      setIsOpen(false)
      onClose?.()
    }

    const getDefaultIcon = () => {
      switch (variant) {
        case "destructive":
          return <AlertCircle className="h-5 w-5" />
        case "success":
          return <CheckCircle2 className="h-5 w-5" />
        case "warning":
          return <Info className="h-5 w-5" />
        case "info":
          return <Bell className="h-5 w-5" />
        default:
          return null
      }
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant, elevation }), className)}
        {...props}
      >
        {icon || getDefaultIcon()}
        {closable && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-3 top-3 rounded-sm p-0.5 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
        {children}
      </div>
    )
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1.5 text-base font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed opacity-90", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }