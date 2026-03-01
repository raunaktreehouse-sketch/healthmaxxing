"use server"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function createComment({
  postId,
  content,
  parentId,
  images,
}: {
  postId: string
  content: string
  parentId?: string
  images?: string[]
}) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const comment = await db.comment.create({
    data: {
      content,
      images: images || [],
      postId,
      authorId: session.user.id,
      parentId: parentId || null,
    },
    include: { post: { include: { category: true } } }
  })

  revalidatePath(`/forum/post/${comment.post.slug}`)
  return comment
}

export async function likeComment(commentId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const existing = await db.like.findUnique({
    where: { userId_commentId: { userId: session.user.id, commentId } }
  })

  if (existing) {
    await db.like.delete({ where: { id: existing.id } })
  } else {
    await db.like.create({ data: { userId: session.user.id, commentId } })
  }
}

export async function deleteComment(commentId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const comment = await db.comment.findUnique({
    where: { id: commentId },
    include: { post: { include: { category: true } } }
  })
  if (!comment) throw new Error("Comment not found")

  if (comment.authorId !== session.user.id && (session.user as any).role !== 'ADMIN') {
    throw new Error("Forbidden")
  }

  await db.comment.delete({ where: { id: commentId } })
  revalidatePath(`/forum/post/${comment.post.slug}`)
}