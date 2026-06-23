import { redirect } from "next/navigation";

export const metadata = {
  title: "Articles | Genestring Lab",
  description: "Manage your articles and blog posts",
};

export default function Page() {
  redirect("/dashboard/articles");
}
