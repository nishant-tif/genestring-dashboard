"use client";

import AddArticle from "@/components/article/AddArticle";
import { useRouter } from "next/navigation";

export default function NewDashboardArticlePage() {
  const router = useRouter();
  return <AddArticle onCancel={() => router.push("/dashboard/articles")} />;
}

