"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowUp, ArrowDown, MessageSquare, Share2, Flag, Edit, Lock, Pin, Eye } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatRelativeTime } from "@/lib/utils"
import { voteOnPost } from "@/app/actions/post-actions"
import Image from "next/image"

export function PostDetail({ post, session }: { post: any; session: any }) {
  const [voteCount, setVoteCount] = useState(post._count.votes)
  const [userVote, setUserVote] = useState<'UP' | 'DOWN' | null>(
    session ? post.votes.find((v: any) => v.userId === session.user?.id)?.type ?? null : null
  )

  async function handleVote(type: 'UP' | 'DOWN') {
    if (!session) return
    const newVote = userVote === type ? null : type
    setUserVote(newVote)
    await voteOnPost(post.id, type)
  }

  return (
    <article className="mb-8">
      {/* Category & Meta */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Link href={`/forum/${post.category.slug}`}>
          <Badge style={{ backgroundColor: post.category.color + '20', borderColor: post.category.color + '40', color: post.category.color }}
            className="text-xs">
            {post.category.icon} {post.category.name}
          </Badge>
        </Link>
        {post.isPinned && <Badge variant="secondary" className="text-xs"><Pin className="w-3 h-3 mr-1" /> Pinned</Badge>}
        {post.isLocked && <Badge variant="outline" className="text-xs"><Lock className="w-3 h-3 mr-1" /> Locked</Badge>}
        {post.tags.map((tag: any) => (
          <Badge key={tag.id} variant="outline" className="text-xs"># {tag.name}</Badge>
        ))}
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">{post.title}</h1>

      {/* Author */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
        <Link href={`/profile/${post.author.username || post.author.id}`}>
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.author.image ?? ""} />
            <AvatarFallback>{post.author.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <Link href={`/profile/${post.author.username || post.author.id}`}
            className="font-semibold text-sm hover:underline">
            {post.author.name}
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{formatRelativeTime(post.createdAt)}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.viewCount} views</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="prose-content text-[15px] leading-relaxed mb-6">
        {post.content.split('\n').map((para: string, i: number) => (
          para ? <p key={i} className="mb-4">{para}</p> : <br key={i} />
        ))}
      </div>

      {/* Images */}
      {post.images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {post.images.map((img: string, i: number) => (
            <div key={i} className="aspect-video relative rounded-lg overflow-hidden border border-border">
              <Image src={img} alt={`Image ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform cursor-pointer" />
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <div className="flex items-center gap-1 border border-border rounded-full">
          <button onClick={() => handleVote('UP')}
            className={`p-2 hover:text-green-500 transition-colors rounded-full ${userVote === 'UP' ? 'text-green-500' : 'text-muted-foreground'}`}>
            <ArrowUp className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium px-1 min-w-[24px] text-center">{voteCount}</span>
          <button onClick={() => handleVote('DOWN')}
            className={`p-2 hover:text-red-500 transition-colors rounded-full ${userVote === 'DOWN' ? 'text-red-500' : 'text-muted-foreground'}`}>
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <MessageSquare className="w-4 h-4" />
          {post._count.comments} replies
        </button>

        <button onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Share2 className="w-4 h-4" />
          Share
        </button>

        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto">
          <Flag className="w-4 h-4" />
          Report
        </button>
      </div>
    </article>
  )
}