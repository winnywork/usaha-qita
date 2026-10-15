import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export function LoadingSkeleton({ className, count = 1 }: LoadingSkeletonProps) {
  return (
    <div className="w-full flex flex-col gap-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={cn("bg-slate-200/80 animate-pulse rounded-xl", className)}
        />
      ))}
    </div>
  );
}

export function OpportunityCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col gap-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="h-6 w-32 bg-slate-200 rounded-lg"></div>
        <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
      </div>
      <div className="h-5 w-3/4 bg-slate-200 rounded-lg"></div>
      <div className="h-14 w-full bg-slate-100 rounded-xl"></div>
      <div className="flex gap-2 pt-2">
        <div className="h-8 w-20 bg-slate-200 rounded-full"></div>
        <div className="h-8 w-24 bg-slate-200 rounded-full"></div>
      </div>
      <div className="h-11 w-full bg-slate-200 rounded-xl mt-2"></div>
    </div>
  );
}