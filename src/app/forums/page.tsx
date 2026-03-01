'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, MessageSquare, Eye, Heart, Pin, ChevronRight, PlusCircle, Filter } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { formatDistanceToNow } from 'date-fns'

const CATEGORIES = [
  { id: 'all', label: 'All Topics', icon: '🌐' },
  { id: 'general', label: 'General', icon: '💬' },
  { id: 'physical', label: 'Physical', icon: '💪' },
  { id: 'aesthetics', label: 'Aesthetics', icon: '✨' },
  { id: 'nutrition', label: 'Nutrition', icon: '🍎' },
  { id: 'mental', label: 'Mental', icon: '🧠' },
  { id: 'recovery', label: 'Recovery', icon: '😴' },
  { id: 'research', label: 'Research', icon: '🔬' },
]

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
  replies: any[]
  pinned?: boolean
}

export default function ForumsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const { data: session } = useSession()

  useEffect(() => {
    fetchPosts()
  }, [category, search])

  async function fetchPosts() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category !== 'all') params.set('category', category)
      if (search) params.set('search', search)
      
      const res = await fetch(`/api/posts?${params}`)
      const data = await res.json()
      setPosts(data.posts || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setSearch(searchInput)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Community Forums</h1>
          <p className="text-zinc-500 mt-1">Evidence-based discussions on health optimization</p>
        </div>
        {session && (
          <Link
            href="/forums/new"
            className="inline-flex items-center gap-2 bg-amber-100 text-black px-5 py-2.5 rounded-lg font-medium hover:bg-white transition-colors text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            New Post
          </Link>
        )}
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <div className="glass rounded-xl p-3 sticky top-20">
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2 mb-2">Categories</div>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  category === cat.id 
                    ? 'bg-amber-200/10 text-amber-200' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Search */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search discussions..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-200/40 placeholder-zinc-600"
              />
            </div>
          </form>

          {/* Mobile category filter */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs transition-colors ${
                  category === cat.id 
                    ? 'bg-amber-200/20 text-amber-200 border border-amber-200/30' 
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Posts list */}
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="glass rounded-xl p-5 animate-pulse">
                  <div className="h-5 bg-zinc-800 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="glass rounded-xl p-12 text-center text-zinc-500">
              <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p>No posts found. {session ? <Link href="/forums/new" className="text-amber-200">Start a discussion!</Link> : <Link href="/auth/login" className="text-amber-200">Log in to post</Link>}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {posts.map(post => (
                <Link
                  key={post.id}
                  href={`/forums/${post.id}`}
                  className="group glass rounded-xl p-5 hover:border-amber-200/20 hover:bg-white/5 transition-all block"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        {post.pinned && <Pin className="w-3.5 h-3.5 text-amber-200 flex-shrink-0" />}
                        <span className="text-xs px-2 py-0.5 bg-zinc-800 rounded-full text-zinc-400 capitalize">{post.category}</span>
                        {post.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-500">#{tag}</span>
                        ))}
                      </div>
                      <h3 className="font-semibold text-white group-hover:text-amber-200 transition-colors line-clamp-1 mb-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-zinc-500 line-clamp-2 mb-3">
                        {post.content.replace(/[#*\n]/g, ' ').substring(0, 150)}...
                      </p>
                      <div className="flex items-center gap-4 text-xs text-zinc-600">
                        <span>by <span className="text-zinc-400">{post.author}</span></span>
                        <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views}</span>
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{post.likes}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{post.replies.length}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 flex-shrink-0 mt-1 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
