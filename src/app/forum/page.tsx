import Link from "next/link"
import { Plus, TrendingUp, Clock, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { PostCard } from "@/components/forum/PostCard"
import { CategorySidebar } from "@/components/forum/CategorySidebar"
import { auth } from "@/auth"

async function getForumData(sort = "recent") {
  try {
    const orderBy = sort === "top" 
      ? [{ votes: { _count: "desc" as const } }]
      : sort === "hot"
      ? [{ comments: { _count: "desc" as const } }, { createdAt: "desc" as const }]
      : [{ createdAt: "desc" as const }]

    const [posts, categories] = await Promise.all([
      db.post.findMany({
        take: 20,
        orderBy,
        include: {
          author: { select: { id: true, name: true, image: true, username: true } },
          category: true,
          _count: { select: { comments: true, votes: true } },
        },
      }),
      db.category.findMany({
        include: { _count: { select: { posts: true } } },
        orderBy: { posts: { _count: "desc" } }
      })
    ])
    return { posts, categories }
  } catch {
    return { posts: [], categories: [] }
  }
}

export default async function ForumPage({
  searchParams,
}: {
  searchParams: { sort?: string }
}) {
  const session = await auth()
  const sort = searchParams.sort || "recent"
  const { posts, categories } = await getForumData(sort)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Forum</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {posts.length} discussion{posts.length !== 1 ? 's' : ''}
              </p>
            </div>
            {session && (
              <Button asChild className="rounded-full">
                <Link href="/forum/new">
                  <Plus className="w-4 h-4 mr-1.5" /> New Post
                </Link>
              </Button>
            )}
          </div>

          {/* Sort Tabs */}
          <div className="flex gap-1 mb-4 border border-border rounded-lg p-1 w-fit">
            {[
              { value: "recent", label: "Recent", icon: Clock },
              { value: "hot", label: "Hot", icon: Flame },
              { value: "top", label: "Top", icon: TrendingUp },
            ].map(({ value, label, icon: Icon }) => (
              <Link key={value} href={`/forum?sort=${value}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  sort === value 
                    ? 'bg-foreground text-background' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}>
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            ))}
          </div>

          {/* Posts */}
          {posts.length > 0 ? (
            <div className="space-y-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground border border-border rounded-xl">
              <p className="text-lg font-medium">No posts yet</p>
              <p className="text-sm mt-1">Be the first to start a discussion!</p>
              {session && (
                <Button asChild className="mt-4">
                  <Link href="/forum/new">Create First Post</Link>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <CategorySidebar categories={categories} />
      </div>
    </div>
  )
}