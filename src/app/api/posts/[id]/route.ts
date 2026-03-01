import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET(
    request: NextRequest,
  { params }: { params: { id: string } }
  ) {
    const post = await db.post.findUnique({
          where: { id: params.id },
          include: {
                  author: { select: { id: true, name: true, image: true, username: true } },
                  category: true,
                  tags: true,
                  comments: {
                            include: {
                                        author: { select: { id: true, name: true, image: true, username: true } },
                                        likes: true,
                                        replies: {
                                                      include: {
                                                                      author: { select: { id: true, name: true, image: true, username: true } },
                                                                      likes: true,
                                                      },
                                        },
                            },
                            where: { parentId: null },
                            orderBy: { createdAt: "asc" },
                  },
                  votes: true,
                  _count: { select: { comments: true, votes: true } },
          },
    })

  if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  await db.post.update({
        where: { id: params.id },
        data: { viewCount: { increment: 1 } },
  })

  return NextResponse.json({ post })
}

export async function POST(
    request: NextRequest,
  { params }: { params: { id: string } }
  ) {
    const session = await auth()
    if (!session?.user?.id) {
          return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

  try {
        const { content } = await request.json()

      if (!content || content.trim().length < 3) {
              return NextResponse.json({ error: "Reply content is required" }, { status: 400 })
      }

      const comment = await db.comment.create({
              data: {
                        content: content.substring(0, 5000),
                        authorId: session.user.id,
                        postId: params.id,
              },
              include: {
                        author: { select: { id: true, name: true, image: true, username: true } },
              },
      })

      return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
