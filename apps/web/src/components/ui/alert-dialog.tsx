"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

/**
 * AlertDialog Root Component
 *
 * A modal dialog that interrupts the user with important content and expects
 * a response. Unlike Dialog, AlertDialog:
 * - Cannot be closed by clicking outside
 * - Cannot be closed with Escape key
 * - Requires explicit user action (Cancel or Action button)
 *
 * Use AlertDialog for:
 * - Destructive actions (delete, remove)
 * - Critical confirmations
 * - Irreversible operations
 *
 * Radix UI handles:
 * - Focus trap within the dialog
 * - ARIA attributes (role="alertdialog", aria-modal="true")
 * - Body scroll lock when open
 *
 * @see https://www.radix-ui.com/primitives/docs/components/alert-dialog
 */
const AlertDialog = AlertDialogPrimitive.Root;

/**
 * AlertDialog Trigger Component
 *
 * A button that opens the alert dialog when clicked.
 * Automatically manages aria-haspopup and aria-expanded.
 */
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

/**
 * AlertDialog Portal Component
 *
 * Portals the dialog content to document.body to avoid z-index
 * and overflow issues.
 */
const AlertDialogPortal = AlertDialogPrimitive.Portal;

/**
 * AlertDialog Overlay Component
 *
 * Semi-transparent backdrop behind the alert dialog.
 * Includes reduced motion support for accessibility.
 *
 * @note Unlike Dialog, clicking the overlay does NOT close AlertDialog.
 */
const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      // Base styles
      "fixed inset-0 z-50 bg-black/80",
      // Animation with reduced motion support
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      // Respect reduced motion preferences
      "motion-reduce:animate-none",
      className
    )}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

/**
 * AlertDialog Content Component
 *
 * The main content area of the alert dialog. Includes:
 * - Centered positioning with responsive max-width
 * - Smooth enter/exit animations with reduced motion support
 * - Focus is automatically trapped within the content
 *
 * @important AlertDialog cannot be dismissed by clicking outside or pressing Escape.
 * Users must interact with the Cancel or Action buttons.
 *
 * @example
 * ```tsx
 * <AlertDialog>
 *   <AlertDialogTrigger asChild>
 *     <Button variant="destructive">Delete Account</Button>
 *   </AlertDialogTrigger>
 *   <AlertDialogContent>
 *     <AlertDialogHeader>
 *       <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
 *       <AlertDialogDescription>
 *         This action cannot be undone. This will permanently delete your
 *         account and remove your data from our servers.
 *       </AlertDialogDescription>
 *     </AlertDialogHeader>
 *     <AlertDialogFooter>
 *       <AlertDialogCancel>Cancel</AlertDialogCancel>
 *       <AlertDialogAction>Yes, delete account</AlertDialogAction>
 *     </AlertDialogFooter>
 *   </AlertDialogContent>
 * </AlertDialog>
 * ```
 */
const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        // Positioning
        "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
        // Sizing
        "grid w-full max-w-lg gap-4",
        // Visual styles
        "border bg-background p-6 shadow-lg sm:rounded-lg",
        // Animations with reduced motion support
        "duration-200",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        // Respect reduced motion preferences
        "motion-reduce:animate-none motion-reduce:duration-0",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

/**
 * AlertDialog Header Component
 *
 * Container for the alert dialog title and description.
 * Provides consistent spacing and text alignment.
 */
const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

/**
 * AlertDialog Footer Component
 *
 * Container for action buttons at the bottom of the alert dialog.
 * Responsive layout: stacked on mobile, side-by-side on larger screens.
 */
const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

/**
 * AlertDialog Title Component
 *
 * The accessible title for the alert dialog.
 * Radix UI automatically associates this with the dialog via aria-labelledby.
 *
 * @important Every AlertDialog must have an AlertDialogTitle for accessibility.
 */
const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

/**
 * AlertDialog Description Component
 *
 * Description text explaining the alert dialog's purpose.
 * Radix UI automatically associates this with the dialog via aria-describedby.
 *
 * @tip Clearly explain the consequences of both actions (Cancel and Action).
 */
const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName;

/**
 * AlertDialog Action Component
 *
 * The primary action button (confirm/proceed).
 * Clicking this closes the dialog and performs the action.
 *
 * @tip For destructive actions, consider using variant="destructive".
 */
const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

/**
 * AlertDialog Cancel Component
 *
 * The cancel/dismiss button.
 * Clicking this closes the dialog without performing any action.
 * Uses outline variant by default for visual hierarchy.
 */
const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
