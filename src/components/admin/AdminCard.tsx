import { cn } from "@/lib/utils";

export function AdminCard({
  className,
  children,
  title,
  actions,
}: {
  className?: string;
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900",
        className,
      )}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          {title && (
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {title}
            </h3>
          )}
          {actions}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

export function AdminLoading() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      <div className="h-64 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}
