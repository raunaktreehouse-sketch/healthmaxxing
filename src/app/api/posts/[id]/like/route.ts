import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function POST(
    request: NextRequest,
  { params }: { params: { id: string } }
  ) {
    const session = await auth()
    if (!session?.user?.id) {
          return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

  const post = await db.post.findUnique({ where: { id: params.id } })
    if (!post) {
          return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

  const existing = await db.vote.findUnique({
        where: {
                userId_postId: {
                          userId: session.user.id,
                          postId: params.id,
                },
        },
  })

  if (existing) {
        await db.vote.delete({ where: { id: existing.id } })
  } else {
        await db.vote.create({
                data: {
                          type: "UP",
                          userId: session.user.id,
                          postId: params.id,
                },
        })
  }

  const count = await db.vote.count({ where: { postId: params.id } })
    return NextResponse.json({ likes: count })
}
