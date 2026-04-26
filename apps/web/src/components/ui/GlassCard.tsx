"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  hover?: boolean;
}

export const GlassCard = ({ className, children, hover = true, ...props }: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : undefined}
      className={cn(
        "glass p-6 rounded-3xl overflow-hidden relative",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
