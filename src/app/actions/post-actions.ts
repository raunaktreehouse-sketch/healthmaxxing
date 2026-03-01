"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 100) + "-" + Date.now()
}

export async function createPost({
    title,
    content,
    categoryId,
    images,
    tags,
}: {
    title: string
    content: string
    categoryId: string
    images?: string[]
    tags?: string[]
}) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

  const slug = generateSlug(title)

  const post = await db.post.create({
        data: {
                title,
                content,
                slug,
                images: images || [],
                categoryId,
                authorId: session.user.id,
                tags: tags && tags.length > 0 ? {
                          connectOrCreate: tags.map((tag) => ({
                                      where: { name: tag },
                                      create: { name: tag },
                          })),
                } : undefined,
        },
        include: {
                category: true,
                author: true,
                tags: true,
        },
  })

  revalidatePath(`/forum/${post.category.slug}`)
    revalidatePath("/forums")

  return post
}

export async function voteOnPost(postId: string, type: "UP" | "DOWN") {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

  const existing = await db.vote.findUnique({
        where: {
                userId_postId: {
                          userId: session.user.id,
                          postId,
                },
        },
  })

  if (existing) {
        if (existing.type === type) {
                // Remove vote if same type
          await db.vote.delete({
                    where: { id: existing.id },
          })
        } else {
                // Update vote if different type
          await db.vote.update({
                    where: { id: existing.id },
                    data: { type },
          })
        }
  } else {
        await db.vote.create({
                data: {
                          type,
                          userId: session.user.id,
                          postId,
                },
        })
  }

  const post = await db.post.findUnique({
        where: { id: postId },
        include: { category: true },
  })

  if (post) {
        revalidatePath(`/forum/post/${post.slug}`)
  }
}

export async function deletePost(postId: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

  const post = await db.post.findUnique({
        where: { id: postId },
        include: { category: true },
  })

  if (!post) throw new Error("Post not found")

  if (
        post.authorId !== session.user.id &&
        (session.user as any).role !== "ADMIN"
      ) {
        throw new Error("Forbidden")
  }

  await db.post.delete({ where: { id: postId } })

  revalidatePath(`/forum/${post.category.slug}`)
    revalidatePath("/forums")
}
