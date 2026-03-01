import Link from "next/link"
import { MessageSquare, ArrowUp, Eye, Pin, Lock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatRelativeTime } from "@/lib/utils"

interface PostCardProps {
  post: {
    id: string
    title: string
    content: string
    slug: string
    isPinned: boolean
    isLocked: boolean
    viewCount: number
    createdAt: Date
    images: string[]
    author: {
      id: string
      name: string | null
      image: string | null
      username: string | null
    }
    category: {
      id: string
      name: string
      slug: string
      color: string | null
    }
    _count: {
      comments: number
      votes: number
    }
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group bg-card border border-border rounded-xl p-4 hover:border-foreground/20 transition-all duration-200 hover:shadow-sm">
      <div className="flex gap-3">
        {/* Left: Votes */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
          <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
            <ArrowUp className="w-4 h-4" />
            <span>{post._count.votes}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {post.isPinned && (
              <Badge variant="secondary" className="text-xs py-0">
                <Pin className="w-2.5 h-2.5 mr-1" /> Pinned
              </Badge>
            )}
            {post.isLocked && (
              <Badge variant="outline" className="text-xs py-0">
                <Lock className="w-2.5 h-2.5 mr-1" /> Locked
              </Badge>
            )}
            <Link href={`/forum/${post.category.slug}`}>
              <Badge style={{ backgroundColor: post.category.color + '20', borderColor: post.category.color + '40', color: post.category.color || undefined }}
                className="text-xs py-0 hover:opacity-80 transition-opacity">
                {post.category.name}
              </Badge>
            </Link>
          </div>

          <Link href={`/forum/post/${post.slug}`}>
            <h2 className="font-semibold text-base leading-snug group-hover:text-foreground/80 transition-colors line-clamp-2 mb-2">
              {post.title}
            </h2>
          </Link>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
            {post.content.replace(/[#*`]/g, '').slice(0, 150)}
          </p>

          {/* Images preview */}
          {post.images.length > 0 && (
            <div className="flex gap-2 mb-3">
              {post.images.slice(0, 3).map((img, i) => (
                <img key={i} src={img} alt="" className="w-16 h-16 object-cover rounded-lg border border-border" />
              ))}
              {post.images.length > 3 && (
                <div className="w-16 h-16 rounded-lg border border-border bg-muted flex items-center justify-center text-xs text-muted-foreground">
                  +{post.images.length - 3}
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="w-5 h-5">
                <AvatarImage src={post.author.image ?? ""} />
                <AvatarFallback className="text-[9px]">
                  {post.author.name?.slice(0, 2).toUpperCase() ?? "HM"}
                </AvatarFallback>
              </Avatar>
              <Link href={`/profile/${post.author.username || post.author.id}`}
                className="text-xs font-medium hover:underline text-muted-foreground">
                {post.author.name || post.author.username || "Anonymous"}
              </Link>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{formatRelativeTime(post.createdAt)}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                {post._count.comments}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {post.viewCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}