"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Reply, MoreHorizontal, Image as ImageIcon } from "lucide-react"
import { formatRelativeTime } from "@/lib/utils"
import { createComment, likeComment } from "@/app/actions/comment-actions"
import Link from "next/link"

function CommentItem({ comment, session, postId, depth = 0 }: { comment: any; session: any; postId: string; depth?: number }) {
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [likes, setLikes] = useState(comment._count.likes)
  const [isLiked, setIsLiked] = useState(
    session ? comment.likes.some((l: any) => l.userId === session.user?.id) : false
  )
  const router = useRouter()

  async function handleLike() {
    if (!session) return
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
    await likeComment(comment.id)
  }

  async function handleReply() {
    if (!replyText.trim() || !session) return
    await createComment({ postId, content: replyText, parentId: comment.id })
    setReplyText("")
    setShowReply(false)
    router.refresh()
  }

  return (
    <div className={`${depth > 0 ? 'ml-8 pl-4 border-l border-border' : ''}`}>
      <div className="flex gap-3 py-4">
        <Link href={`/profile/${comment.author.username || comment.author.id}`}>
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={comment.author.image ?? ""} />
            <AvatarFallback className="text-xs">{comment.author.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link href={`/profile/${comment.author.username || comment.author.id}`}
              className="font-semibold text-sm hover:underline">
              {comment.author.name}
            </Link>
            <span className="text-xs text-muted-foreground">{formatRelativeTime(comment.createdAt)}</span>
          </div>
          <div className="text-sm leading-relaxed mb-2">
            {comment.content}
          </div>
          {comment.images?.length > 0 && (
            <div className="flex gap-2 mb-2">
              {comment.images.map((img: string, i: number) => (
                <img key={i} src={img} alt="" className="w-24 h-24 object-cover rounded-lg border border-border" />
              ))}
            </div>
          )}
          <div className="flex items-center gap-3">
            <button onClick={handleLike}
              className={`flex items-center gap-1 text-xs transition-colors ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}>
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              {likes}
            </button>
            {!session ? null : (
              <button onClick={() => setShowReply(!showReply)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Reply className="w-3.5 h-3.5" />
                Reply
              </button>
            )}
          </div>
          {showReply && (
            <div className="mt-3 space-y-2">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="text-sm min-h-[80px] resize-none"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleReply} className="text-xs h-7 rounded-full">Post Reply</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowReply(false)} className="text-xs h-7">Cancel</Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {comment.replies?.map((reply: any) => (
        <CommentItem key={reply.id} comment={reply} session={session} postId={postId} depth={depth + 1} />
      ))}
    </div>
  )
}

export function CommentSection({ post, session }: { post: any; session: any }) {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  async function handleSubmit() {
    if (!newComment.trim() || !session || isSubmitting) return
    setIsSubmitting(true)
    try {
      await createComment({ postId: post.id, content: newComment })
      setNewComment("")
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <h2 className="text-lg font-bold mb-6">{post._count.comments} Replies</h2>

      {/* New Comment */}
      {session ? (
        <div className="flex gap-3 mb-8">
          <Avatar className="w-9 h-9 flex-shrink-0">
            <AvatarImage src={session.user?.image ?? ""} />
            <AvatarFallback className="text-xs">{session.user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts, experiences, or questions..."
              className="min-h-[100px] resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Markdown supported</span>
              <Button onClick={handleSubmit} disabled={isSubmitting || !newComment.trim()} className="rounded-full" size="sm">
                {isSubmitting ? "Posting..." : "Post Reply"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-border rounded-xl p-6 text-center mb-8">
          <p className="text-muted-foreground mb-3">Join the conversation</p>
          <Button asChild className="rounded-full">
            <Link href="/auth/signin">Sign In to Reply</Link>
          </Button>
        </div>
      )}

      {/* Comments */}
      <div className="divide-y divide-border">
        {post.comments.map((comment: any) => (
          <CommentItem key={comment.id} comment={comment} session={session} postId={post.id} />
        ))}
        {post.comments.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No replies yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </section>
  )
}