import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

  const where: any = {}

      if (category && category !== "all") {
            where.category = { slug: category }
      }

  if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
              ]
  }

  const posts = await db.post.findMany({
        where,
        include: {
                author: { select: { id: true, name: true, image: true, username: true } },
                category: true,
                tags: true,
                _count: { select: { comments: true, votes: true } },
        },
        orderBy: [
          { isPinned: "desc" },
          { createdAt: "desc" },
              ],
  })

  return NextResponse.json({ posts, total: posts.length })
}

export async function POST(request: NextRequest) {
    const session = await auth()
    if (!session?.user?.id) {
          return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

  try {
        const { title, content, categoryId, tags } = await request.json()

      if (!title || !content || !categoryId) {
              return NextResponse.json({ error: "Title, content and category required" }, { status: 400 })
      }

      const slug =
              title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-")
            .substring(0, 100) +
              "-" +
              Date.now()

      const post = await db.post.create({
              data: {
                        title: title.substring(0, 200),
                        content: content.substring(0, 10000),
                        slug,
                        categoryId,
                        authorId: session.user.id,
                        tags:
                                    tags && tags.length > 0
                            ? {
                                              connectOrCreate: tags.slice(0, 5).map((tag: string) => ({
                                                                  where: { name: tag },
                                                                  create: { name: tag },
                                              })),
                            }
                                      : undefined,
              },
              include: {
                        author: true,
                        category: true,
                        tags: true,
        },
      })

      return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
