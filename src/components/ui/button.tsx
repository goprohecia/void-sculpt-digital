import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#22c55e] text-white font-semibold rounded-[var(--radius-full,9999px)] shadow-[0_4px_14px_rgba(34,197,94,0.40)] hover:bg-[#16a34a] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(34,197,94,0.45)] active:translate-y-0 active:shadow-sm",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-[var(--radius-full,9999px)]",
        outline: "border-[1.5px] border-[#e4e8df] bg-white text-[#4a5e46] font-medium rounded-[var(--radius-full,9999px)] hover:bg-[#f0fdf4] hover:border-[#22c55e] hover:text-[#22c55e]",
        secondary: "bg-white text-[#4a5e46] border border-[#e4e8df] hover:bg-[#f0fdf4] rounded-[var(--radius-full,9999px)]",
        ghost: "hover:bg-[#f0fdf4] hover:text-[#16a34a] rounded-[var(--radius-sm)]",
        link: "text-[#22c55e] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
