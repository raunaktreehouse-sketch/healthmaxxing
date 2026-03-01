import { notFound } from "next/navigation"
import Link from "next/link"
import { Plus, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { PostCard } from "@/components/forum/PostCard"
import { CategorySidebar } from "@/components/forum/CategorySidebar"
import { auth } from "@/auth"

const DEFAULT_CATEGORIES: Record<string, { name: string; description: string; icon: string; color: string }> = {
  skincare: { name: "Skincare & Appearance", description: "Evidence-based skincare routines, ingredients, and treatments", icon: "✨", color: "#e11d48" },
  fitness: { name: "Fitness & Training", description: "Optimize your physique with science-backed training methods", icon: "💪", color: "#2563eb" },
  nutrition: { name: "Nutrition & Diet", description: "Dietary strategies for health, performance, and longevity", icon: "🥗", color: "#16a34a" },
  sleep: { name: "Sleep & Recovery", description: "Science of sleep optimization and recovery", icon: "😴", color: "#7c3aed" },
  longevity: { name: "Longevity", description: "Research-backed approaches to living longer and healthier", icon: "🧬", color: "#0891b2" },
  mental: { name: "Mental Performance", description: "Cognitive enhancement, focus, and mental health", icon: "🧠", color: "#d97706" },
  supplements: { name: "Supplements", description: "Evidence-based supplement reviews and stacks", icon: "💊", color: "#db2777" },
  general: { name: "General Discussion", description: "Open discussion about all things health optimization", icon: "💬", color: "#64748b" },
}

async function getCategoryData(slug: string) {
  try {
    const category = await db.category.findUnique({
      where: { slug },
      include: {
        posts: {
          take: 30,
          orderBy: { createdAt: "desc" },
          include: {
            author: { select: { id: true, name: true, image: true, username: true } },
            category: true,
            _count: { select: { comments: true, votes: true } },
          }
        },
        _count: { select: { posts: true } }
      }
    })
    return category
  } catch {
    return null
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const session = await auth()
  const { slug } = params
  
  const dbCategory = await getCategoryData(slug)
  const defaultCat = DEFAULT_CATEGORIES[slug]
  
  if (!dbCategory && !defaultCat) notFound()

  const category = dbCategory || {
    id: slug, name: defaultCat!.name, slug, description: defaultCat!.description,
    icon: defaultCat!.icon, color: defaultCat!.color, posts: [], _count: { posts: 0 }
  }

  const allCategories = await db.category.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { posts: { _count: "desc" } }
  }).catch(() => [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-6">
            <Link href="/forum" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Forum
            </Link>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{(category as any).icon}</div>
                <div>
                  <h1 className="text-2xl font-bold">{category.name}</h1>
                  <p className="text-muted-foreground text-sm mt-0.5">{category.description}</p>
                </div>
              </div>
              {session && (
                <Button asChild className="rounded-full">
                  <Link href="/forum/new"><Plus className="w-4 h-4 mr-1.5" /> New Post</Link>
                </Button>
              )}
            </div>
          </div>

          {/* Posts */}
          {category.posts.length > 0 ? (
            <div className="space-y-3">
              {category.posts.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-border rounded-xl text-muted-foreground">
              <div className="text-4xl mb-3">{(category as any).icon}</div>
              <p className="text-lg font-medium">No posts in {category.name} yet</p>
              <p className="text-sm mt-1">Start the conversation!</p>
              {session && (
                <Button asChild className="mt-4 rounded-full">
                  <Link href="/forum/new">Create First Post</Link>
                </Button>
              )}
            </div>
          )}
        </div>
        <CategorySidebar categories={allCategories} />
      </div>
    </div>
  )
}