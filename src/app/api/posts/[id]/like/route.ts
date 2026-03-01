import { NextRequest, NextResponse } from 'next/server'
import { getPosts } from '@/lib/store'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }
  
  const posts = getPosts()
  const post = posts.find(p => p.id === params.id)
  
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }
  
  post.likes++
  
  return NextResponse.json({ likes: post.likes })
}
