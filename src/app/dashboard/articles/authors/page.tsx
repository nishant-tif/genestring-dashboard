import { redirect } from "next/navigation";

export default function AuthorsDashboardPage() {
  redirect("/articles/authors");
}

