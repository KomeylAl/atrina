"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

interface BlogSearchProps {
  locale?: string;
}

export default function BlogSearch({ locale = "en" }: BlogSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const placeholder =
    locale === "fa" ? "جستجوی مقالات..." : "Search articles...";

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "") {
      params.delete("q");
    } else {
      params.set("q", value);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="max-w-md">
      <Input
        type="search"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="bg-white dark:bg-slate-900"
      />
    </div>
  );
}
