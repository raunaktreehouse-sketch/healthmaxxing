import { NextRequest, NextResponse } from 'next/server'
import { getPosts, addPost, ForumPost } from '@/lib/store'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  
  let posts = getPosts()
  
  if (category && category !== 'all') {
    posts = posts.filter(p => p.category === category)
  }
  
  if (search) {
    const q = search.toLowerCase()
    posts = posts.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.content.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    )
  }
  
  // Sort: pinned first, then by date
  posts = posts.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
  
  return NextResponse.json({ posts, total: posts.length })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }
  
  try {
    const { title, content, category, tags } = await request.json()
    
    if (!title || !content || !category) {
      return NextResponse.json({ error: 'Title, content and category required' }, { status: 400 })
    }
    
    const newPost: ForumPost = {
      id: Date.now().toString(),
      title: title.substring(0, 200),
      content: content.substring(0, 10000),
      author: session.user.name || 'Anonymous',
      authorId: (session.user as any).id || '0',
      category,
      tags: Array.isArray(tags) ? tags.slice(0, 5) : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      views: 0,
      replies: [],
    }
    
    addPost(newPost)
    
    return NextResponse.json({ post: newPost }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
