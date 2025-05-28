"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown, Plus } from "lucide-react"

import { cn } from "@/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "group border-b border-border/60 w-full transition-all hover:border-border",
      "data-[state=open]:border-primary/30",
      className
    )}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    showPlusMinus?: boolean
  }
>(({ className, children, showPlusMinus = false, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 w-full items-center justify-between py-4 font-medium transition-all",
        "text-muted-foreground hover:text-foreground group-hover:text-foreground",
        "group-data-[state=open]:text-primary",
        "[&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      {showPlusMinus ? (
        <Plus className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:hidden" />
      ) : null}
      {showPlusMinus ? (
        <span className="h-4 w-4 shrink-0 text-primary hidden group-data-[state=open]:block">-</span>
      ) : (
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden w-full text-sm transition-all",
      "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      "data-[state=closed]:duration-300 data-[state=open]:duration-500"
    )}
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }