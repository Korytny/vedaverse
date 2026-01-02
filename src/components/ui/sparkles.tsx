"use client";
import React, { useId } from "react";
import { cn } from "@/lib/utils";

export const SparklesCore = (props: { id?: string; className?: string; background?: string }) => {
  const { id, className, background } = props;
  const generatedId = useId();
  return (
    <div
      id={id || generatedId}
      className={cn(
        "h-full w-full",
        className
      )}
      style={{
        background: background || "linear-gradient(135deg, #0d47a1 0%, #42a5f5 100%)",
      }}
    />
  );
};