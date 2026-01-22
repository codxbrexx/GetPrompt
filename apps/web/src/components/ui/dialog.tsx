"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Dialog Root Component
 *
 * The root component that provides context for all dialog parts.
 * Radix UI handles:
 * - Focus trap within the dialog
 * - Escape key to close
 * - Body scroll lock when open
 * - ARIA attributes (role="dialog", aria-modal="true")
 *
 * @see https://www.radix-ui.com/primitives/docs/components/dialog
 */
const Dialog = DialogPrimitive.Root;

/**
 * Dialog Trigger Component
 *
 * A button that opens the dialog when clicked.
 * Radix UI automatically:
 * - Sets aria-haspopup="dialog"
 * - Sets aria-expanded based on open state
 * - Manages aria-controls
 */
const DialogTrigger = DialogPrimitive.Trigger;

/**
 * Dialog Portal Component
 *
 * Portals the dialog content to document.body to avoid z-index and
 * overflow issues. Ensures proper stacking context.
 */
const DialogPortal = DialogPrimitive.Portal;

/**
 * Dialog Close Component
 *
 * A button that closes the dialog. Can be used for custom close buttons
 * beyond the default X in the corner.
 */
const DialogClose = DialogPrimitive.Close;

/**
 * Dialog Overlay Component
 *
 * Semi-transparent backdrop behind the dialog.
 * Includes reduced motion support for accessibility.
 */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
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
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

/**
 * Extended props for DialogContent
 */
interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /**
   * Whether to show the close button (X) in the top-right corner.
   * @default true
   */
  showCloseButton?: boolean;
  /**
   * Custom accessible label for the close button.
   * @default "Close dialog"
   */
  closeButtonLabel?: string;
  /**
   * Callback when clicking outside the dialog (on overlay).
   * Useful for preventing close on important actions.
   */
  onOverlayClick?: (event: React.MouseEvent) => void;
}

/**
 * Dialog Content Component
 *
 * The main content area of the dialog. Includes:
 * - Centered positioning with responsive max-width
 * - Smooth enter/exit animations with reduced motion support
 * - Optional close button with customizable label
 * - Focus is automatically trapped within the content
 * - Escape key closes the dialog (handled by Radix)
 *
 * @example
 * ```tsx
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button>Open Dialog</Button>
 *   </DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Title</DialogTitle>
 *       <DialogDescription>Description text</DialogDescription>
 *     </DialogHeader>
 *     <p>Main content here</p>
 *     <DialogFooter>
 *       <Button>Save</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      className,
      children,
      showCloseButton = true,
      closeButtonLabel = "Close dialog",
      onOverlayClick,
      onPointerDownOutside,
      ...props
    },
    ref
  ) => (
    <DialogPortal>
      <DialogOverlay onClick={onOverlayClick} />
      <DialogPrimitive.Content
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
        onPointerDownOutside={onPointerDownOutside}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            className={cn(
              // Positioning
              "absolute right-4 top-4",
              // Visual styles
              "rounded-sm opacity-70",
              "ring-offset-background",
              // State styles
              "transition-opacity",
              "hover:opacity-100",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:pointer-events-none",
              "data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            )}
            aria-label={closeButtonLabel}
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">{closeButtonLabel}</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

/**
 * Dialog Header Component
 *
 * Container for the dialog title and description.
 * Provides consistent spacing and text alignment.
 */
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

/**
 * Dialog Footer Component
 *
 * Container for action buttons at the bottom of the dialog.
 * Responsive layout: stacked on mobile, side-by-side on larger screens.
 */
const DialogFooter = ({
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
DialogFooter.displayName = "DialogFooter";

/**
 * Dialog Title Component
 *
 * The accessible title for the dialog.
 * Radix UI automatically associates this with the dialog via aria-labelledby.
 *
 * @important Every dialog should have a DialogTitle for accessibility.
 * If you need to hide the title visually, use sr-only class.
 */
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

/**
 * Dialog Description Component
 *
 * Optional description text for the dialog.
 * Radix UI automatically associates this with the dialog via aria-describedby.
 *
 * @tip Use this to provide additional context about the dialog's purpose.
 */
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

export type { DialogContentProps };
