import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type IconProps = { className?: string };

export function BackArrow({ className }: IconProps) {
  return <ArrowLeft className={cn("h-4 w-4 shrink-0 rtl:rotate-180", className)} />;
}

export function ForwardArrow({ className }: IconProps) {
  return (
    <ArrowRight
      className={cn(
        "h-4 w-4 shrink-0 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform",
        className,
      )}
    />
  );
}

export function ChevronPrev({ className }: IconProps) {
  return <ChevronLeft className={cn("h-5 w-5 shrink-0 rtl:rotate-180", className)} />;
}

export function ChevronNext({ className }: IconProps) {
  return <ChevronRight className={cn("h-5 w-5 shrink-0 rtl:rotate-180", className)} />;
}
