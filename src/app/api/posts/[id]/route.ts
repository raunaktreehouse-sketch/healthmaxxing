import { NextRequest, NextResponse } from 'next/server'
import { getPosts, addReply, ForumReply } from '@/lib/store'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const posts = getPosts()
  const post = posts.find(p => p.id === params.id)
  
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }
  
  // Increment views
  post.views++
  
  return NextResponse.json({ post })
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }
  
  try {
    const { content } = await request.json()
    
    if (!content || content.trim().length < 3) {
      return NextResponse.json({ error: 'Reply content is required' }, { status: 400 })
    }
    
    const reply: ForumReply = {
      id: Date.now().toString(),
      content: content.substring(0, 5000),
      author: session.user.name || 'Anonymous',
      authorId: (session.user as any).id || '0',
      createdAt: new Date().toISOString(),
      likes: 0,
      postId: params.id,
    }
    
    addReply(params.id, reply)
    
    return NextResponse.json({ reply }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
