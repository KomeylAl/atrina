"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BilingualTabsProps {
  faContent: React.ReactNode;
  enContent: React.ReactNode;
  defaultValue?: "fa" | "en";
}

export default function BilingualTabs({
  faContent,
  enContent,
  defaultValue = "fa",
}: BilingualTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} dir="rtl">
      <TabsList className="mb-4">
        <TabsTrigger value="fa">فارسی</TabsTrigger>
        <TabsTrigger value="en">English</TabsTrigger>
      </TabsList>
      <TabsContent value="fa">{faContent}</TabsContent>
      <TabsContent value="en">{enContent}</TabsContent>
    </Tabs>
  );
}
