"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "glass" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", glow = false, ...props }, ref) => {
    const variants = {
      primary: "bg-yellow-500 text-neutral-950 font-black hover:bg-yellow-400 active:scale-95 shadow-[0_0_20px_rgba(234,179,8,0.3)]",
      glass: "glass hover:bg-white/10 text-white",
      outline: "border-2 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold",
      ghost: "hover:bg-white/5 text-white/70 hover:text-white",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    return (
      <motion.button
        initial={false}
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.02 }}
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          glow && "shadow-[0_0_20px_rgba(239,255,0,0.3)] hover:shadow-[0_0_30px_rgba(239,255,0,0.5)]",
          className
        )}
        ref={ref as any}
        {...(props as any)}
      />
    );
  }
);
Button.displayName = "Button";
