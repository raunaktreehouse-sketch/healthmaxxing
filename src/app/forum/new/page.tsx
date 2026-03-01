import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { NewPostForm } from "@/components/forum/NewPostForm"
import { db } from "@/lib/db"

export default async function NewPostPage() {
  const session = await auth()
  if (!session) redirect("/auth/signin?callbackUrl=/forum/new")

  const categories = await db.category.findMany({
    orderBy: { name: "asc" }
  })

  const defaultCategories = [
    { id: "skincare", name: "Skincare & Appearance", slug: "skincare", icon: "✨", description: null, color: "#e11d48" },
    { id: "fitness", name: "Fitness & Training", slug: "fitness", icon: "💪", description: null, color: "#2563eb" },
    { id: "nutrition", name: "Nutrition & Diet", slug: "nutrition", icon: "🥗", description: null, color: "#16a34a" },
    { id: "sleep", name: "Sleep & Recovery", slug: "sleep", icon: "😴", description: null, color: "#7c3aed" },
    { id: "longevity", name: "Longevity", slug: "longevity", icon: "🧬", description: null, color: "#0891b2" },
    { id: "mental", name: "Mental Performance", slug: "mental", icon: "🧠", description: null, color: "#d97706" },
    { id: "supplements", name: "Supplements", slug: "supplements", icon: "💊", description: null, color: "#db2777" },
    { id: "general", name: "General Discussion", slug: "general", icon: "💬", description: null, color: "#64748b" },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Discussion</h1>
        <p className="text-muted-foreground text-sm mt-1">Share your thoughts, experiences, or questions with the community</p>
      </div>
      <NewPostForm categories={categories.length > 0 ? categories : defaultCategories} />
    </div>
  )
}