import { cn } from "@/lib/utils";

export function SkweepLogo({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-500 text-white shadow-sm",
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-4 w-4"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 18 L10 12 L14 16 L20 8" />
        <path d="M14 8 H20 V14" />
      </svg>
    </span>
  );
}
