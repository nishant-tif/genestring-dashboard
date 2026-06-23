"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewArticlePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/articles/new");
  }, [router]);
  return null;
}
