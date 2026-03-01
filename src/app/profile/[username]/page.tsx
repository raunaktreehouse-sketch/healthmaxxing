import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"
import { PostCard } from "@/components/forum/PostCard"
import { formatDate } from "@/lib/utils"
import { Calendar, MessageSquare, TrendingUp, Award } from "lucide-react"

async function getProfile(identifier: string) {
  try {
    const user = await db.user.findFirst({
      where: { OR: [{ username: identifier }, { id: identifier }] },
      include: {
        posts: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            author: { select: { id: true, name: true, image: true, username: true } },
            category: true,
            _count: { select: { comments: true, votes: true } }
          }
        },
        _count: {
          select: { posts: true, comments: true }
        }
      }
    })
    return user
  } catch {
    return null
  }
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const user = await getProfile(params.username)
  if (!user) notFound()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Profile Header */}
      <div className="border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.image ?? ""} />
            <AvatarFallback className="text-xl">{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold">{user.name}</h1>
              {user.role !== 'USER' && (
                <Badge variant="secondary" className="text-xs">
                  {user.role === 'ADMIN' ? '⚡ Admin' : '🛡️ Moderator'}
                </Badge>
              )}
            </div>
            {user.username && (
              <p className="text-muted-foreground text-sm">@{user.username}</p>
            )}
            {user.bio && (
              <p className="text-sm mt-2 leading-relaxed max-w-lg">{user.bio}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Joined {formatDate(user.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                {user._count.posts} posts
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                {user._count.comments} replies
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User Posts */}
      <h2 className="font-bold text-lg mb-4">Recent Posts</h2>
      {user.posts.length > 0 ? (
        <div className="space-y-3">
          {user.posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground border border-border rounded-xl">
          <p>No posts yet</p>
        </div>
      )}
    </div>
  )
}