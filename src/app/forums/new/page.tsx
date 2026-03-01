'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { ArrowLeft, Send, Tag } from 'lucide-react'

const CATEGORIES = [
  { id: 'general', label: 'General Discussion' },
  { id: 'physical', label: 'Physical Optimization' },
  { id: 'aesthetics', label: 'Aesthetics & Skincare' },
  { id: 'nutrition', label: 'Nutrition & Diet' },
  { id: 'mental', label: 'Mental Performance' },
  { id: 'recovery', label: 'Recovery & Sleep' },
  { id: 'research', label: 'Research & Science' },
]

export default function NewPostPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('general')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (status === 'unauthenticated') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-bold mb-4">Sign in to post</h2>
        <p className="text-zinc-500 mb-6">You need to be logged in to create a discussion.</p>
        <Link href="/auth/login" className="bg-amber-100 text-black px-6 py-2.5 rounded-lg font-medium hover:bg-white transition-colors">
          Log in
        </Link>
      </div>
    )
  }

  function addTag(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tag = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')
      if (tag && !tags.includes(tag) && tags.length < 5) {
        setTags([...tags, tag])
        setTagInput('')
      }
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter(t => t !== tag))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError('Please fill in all required fields')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, category, tags }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'Failed to create post')
        return
      }
      
      router.push(`/forums/${data.post.id}`)
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-24">
      <Link href="/forums" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Forums
      </Link>
      
      <h1 className="text-2xl font-bold mb-8">Create New Discussion</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="What's your discussion about?"
            maxLength={200}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-200/40 placeholder-zinc-600"
          />
          <div className="text-xs text-zinc-600 mt-1 text-right">{title.length}/200</div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Category <span className="text-red-400">*</span>
          </label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-200/40 text-zinc-300"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Content <span className="text-red-400">*</span>
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Share your knowledge, question, or experience. Be specific and provide sources when possible..."
            rows={10}
            maxLength={10000}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-200/40 placeholder-zinc-600 resize-none font-mono text-sm"
          />
          <div className="text-xs text-zinc-600 mt-1 text-right">{content.length}/10,000</div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Tags <span className="text-zinc-500 font-normal">(up to 5)</span>
          </label>
          <div className="glass rounded-xl p-3">
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 bg-zinc-800 text-zinc-300 rounded-full px-3 py-1 text-xs">
                  <Tag className="w-2.5 h-2.5" />#{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-zinc-500 hover:text-white">×</button>
                </span>
              ))}
            </div>
            {tags.length < 5 && (
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder="Type a tag and press Enter..."
                className="w-full bg-transparent text-sm focus:outline-none placeholder-zinc-600"
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-amber-100 text-black py-3 rounded-xl font-semibold hover:bg-white transition-colors disabled:opacity-50"
        >
          {loading ? 'Publishing...' : <><Send className="w-4 h-4" /> Publish Discussion</>}
        </button>
      </form>
    </div>
  )
}
