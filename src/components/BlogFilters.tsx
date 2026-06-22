"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";

interface Category {
  key: string;
  label: string;
}

interface BlogFiltersProps {
  categories: Category[];
  lang?: string;
}

export default function BlogFilters({ categories, lang = "en" }: BlogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "all";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <Tabs
      dir={lang === "fa" ? "rtl" : "ltr"}
      value={selectedCategory}
      onValueChange={handleChange}
    >
      <TabsList className="bg-slate-100 dark:bg-slate-900 flex-wrap h-auto">
        {categories.map((cat) => (
          <TabsTrigger key={cat.key} value={cat.key}>
            {cat.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
