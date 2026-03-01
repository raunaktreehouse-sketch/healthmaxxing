import Link from "next/link"

interface CategoryCardProps {
  category: {
    id: string; name: string; slug: string
    description: string | null; icon: string | null; color: string | null
    _count: { posts: number }
  }
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/forum/${category.slug}`}
      className="group p-4 rounded-xl border border-border hover:border-foreground/20 hover:bg-muted/50 transition-all">
      <div className="text-2xl mb-2">{category.icon || "📌"}</div>
      <div className="font-medium text-sm">{category.name}</div>
      {category.description && <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{category.description}</div>}
      <div className="text-xs text-muted-foreground mt-2">{category._count.posts} posts</div>
    </Link>
  )
}