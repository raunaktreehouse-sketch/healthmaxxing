'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Heart, Eye, MessageSquare, Send, Tag, User, Pin, Calendar } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { formatDistanceToNow } from 'date-fns'

interface Reply {
  id: string
  content: string
  author: string
  createdAt: string
  likes: number
}

interface Post {
  id: string
  title: string
  content: string
  author: string
  category: string
  tags: string[]
  createdAt: string
  likes: number
  views: number
  replies: Reply[]
  pinned?: boolean
}

function renderContent(text: string) {
  // Simple markdown-like rendering
  return text
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('# ')) return <h2 key={i} className="text-xl font-bold text-white mt-4 mb-2">{line.slice(2)}</h2>
      if (line.startsWith('## ')) return <h3 key={i} className="text-lg font-semibold text-white mt-3 mb-1">{line.slice(3)}</h3>
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-white my-1">{line.slice(2, -2)}</p>
      if (line.startsWith('- ')) return <li key={i} className="ml-4 text-zinc-300">{line.slice(2)}</li>
      if (line.trim() === '') return <br key={i} />
      return <p key={i} className="text-zinc-300 leading-relaxed">{line}</p>
    })
}

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [reply, setReply] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(0)

  useEffect(() => {
    fetchPost()
  }, [params.id])

  async function fetchPost() {
    try {
      const res = await fetch(`/api/posts/${params.id}`)
      if (!res.ok) { router.push('/forums'); return }
      const data = await res.json()
      setPost(data.post)
      setLikes(data.post.likes)
    } catch (e) {
      router.push('/forums')
    } finally {
      setLoading(false)
    }
  }

  async function handleLike() {
    if (!session || liked) return
    try {
      const res = await fetch(`/api/posts/${params.id}/like`, { method: 'POST' })
      if (res.ok) {
        setLiked(true)
        setLikes(l => l + 1)
      }
    } catch (e) {}
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault()
    if (!reply.trim() || submitting) return
    
    setSubmitting(true)
    try {
      const res = await fetch(`/api/posts/${params.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: reply }),
      })
      
      if (res.ok) {
        setReply('')
        fetchPost() // Refresh to show new reply
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-zinc-800 rounded w-3/4"></div>
          <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
          <div className="h-40 bg-zinc-800 rounded mt-8"></div>
        </div>
      </div>
    )
  }

  if (!post) return null

  return (
    <div className="max-w-3xl mx-auto px-4 py-24">
      <Link href="/forums" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Forums
      </Link>

      {/* Post */}
      <article className="glass rounded-2xl p-8 mb-6">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {post.pinned && (
            <span className="flex items-center gap-1 text-xs text-amber-200 bg-amber-200/10 px-2 py-1 rounded-full">
              <Pin className="w-3 h-3" /> Pinned
            </span>
          )}
          <span className="text-xs px-2 py-1 bg-zinc-800 rounded-full text-zinc-400 capitalize">{post.category}</span>
          {post.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-500">#{tag}</span>
          ))}
        </div>

        <h1 className="text-2xl font-bold text-white mb-6">{post.title}</h1>

        {/* Author info */}
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-zinc-800">
          <div className="w-9 h-9 rounded-full bg-amber-200/10 flex items-center justify-center">
            <User className="w-4 h-4 text-amber-200" />
          </div>
          <div>
            <div className="text-sm font-medium">{post.author}</div>
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <Calendar className="w-3 h-3" />
              {formatDistanceToNow(new Date(post.createdAt))} ago
            </div>
          </div>
          <div className="ml-auto flex items-center gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{post.views}</span>
          </div>
        </div>

        {/* Content */}
        <div className="prose-dark space-y-1 mb-8">
          {renderContent(post.content)}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-zinc-800">
          <button
            onClick={handleLike}
            disabled={!session || liked}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              liked 
                ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                : 'glass text-zinc-400 hover:text-red-400 disabled:opacity-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            {likes} {likes === 1 ? 'like' : 'likes'}
          </button>
          <span className="flex items-center gap-2 text-sm text-zinc-500">
            <MessageSquare className="w-4 h-4" />
            {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
          </span>
        </div>
      </article>

      {/* Replies */}
      {post.replies.length > 0 && (
        <div className="mb-6 space-y-3">
          <h2 className="text-lg font-semibold">{post.replies.length} {post.replies.length === 1 ? 'Reply' : 'Replies'}</h2>
          {post.replies.map((reply, index) => (
            <div key={reply.id} className="glass rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium">
                  {reply.author[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-medium">{reply.author}</div>
                  <div className="text-xs text-zinc-500">{formatDistanceToNow(new Date(reply.createdAt))} ago</div>
                </div>
                <div className="ml-auto text-xs text-zinc-600">#{index + 1}</div>
              </div>
              <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap pl-11">
                {reply.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply form */}
      {session ? (
        <div className="glass rounded-xl p-6">
          <h3 className="font-semibold mb-4">Add Your Reply</h3>
          <form onSubmit={handleReply}>
            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Share your thoughts, experience, or evidence-based insights..."
              rows={5}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-200/40 placeholder-zinc-600 resize-none text-sm mb-4"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !reply.trim()}
                className="flex items-center gap-2 bg-amber-100 text-black px-6 py-2.5 rounded-lg font-medium hover:bg-white transition-colors disabled:opacity-50 text-sm"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? 'Posting...' : 'Post Reply'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="glass rounded-xl p-6 text-center">
          <p className="text-zinc-400 mb-3">Sign in to join the discussion</p>
          <Link href="/auth/login" className="bg-amber-100 text-black px-6 py-2.5 rounded-lg font-medium hover:bg-white transition-colors inline-block text-sm">
            Log in to Reply
          </Link>
        </div>
      )}
    </div>
  )
}
