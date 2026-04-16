import { cn } from "@/lib/utils";

function Skeleton({ className, variant = "light", ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: "light" | "dark" }) {
  return (
    <div
      className={cn("skeleton-shimmer", variant === "dark" ? "skeleton-dark" : "skeleton-light", className)}
      {...props}
    />
  );
}

function SkeletonText({ className, width = "100%", variant = "light", ...props }: React.HTMLAttributes<HTMLDivElement> & { width?: string; variant?: "light" | "dark" }) {
  return <Skeleton variant={variant} className={cn("h-4", className)} style={{ width, ...props.style }} {...props} />;
}

function SkeletonBlock({ className, variant = "light", ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: "light" | "dark" }) {
  return <Skeleton variant={variant} className={className} {...props} />;
}

function SkeletonCard() {
  return (
    <div style={{ borderLeft: "2px solid #5a7a5a" }}>
      <Skeleton className="w-full" style={{ aspectRatio: "4/3" }} />
      <div className="p-6 space-y-3">
        <SkeletonText width="70%" className="h-5" />
        <SkeletonText width="40%" className="h-3" />
        <SkeletonText width="90%" />
        <SkeletonText width="60%" />
        <SkeletonText width="30%" className="h-5" />
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", margin: "12px 0" }} />
        <SkeletonText width="50%" className="h-3" />
      </div>
    </div>
  );
}

function SkeletonFAQRow() {
  return (
    <div className="flex items-center justify-between py-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
      <SkeletonText width="60%" className="h-5" />
      <Skeleton className="w-6 h-6 shrink-0" />
    </div>
  );
}

export { Skeleton, SkeletonText, SkeletonBlock, SkeletonCard, SkeletonFAQRow };
