import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { PostDetail } from "@/components/forum/PostDetail"
import { CommentSection } from "@/components/forum/CommentSection"

async function getPost(slug: string) {
  try {
    // Increment view count
    const post = await db.post.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
      include: {
        author: { select: { id: true, name: true, image: true, username: true, bio: true } },
        category: true,
        tags: true,
        votes: true,
        _count: { select: { comments: true, votes: true } },
        comments: {
          where: { parentId: null },
          orderBy: { createdAt: "asc" },
          include: {
            author: { select: { id: true, name: true, image: true, username: true } },
            likes: true,
            _count: { select: { replies: true, likes: true } },
            replies: {
              include: {
                author: { select: { id: true, name: true, image: true, username: true } },
                likes: true,
                _count: { select: { replies: true, likes: true } },
              },
              orderBy: { createdAt: "asc" }
            }
          }
        }
      }
    })
    return post
  } catch {
    return null
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const session = await auth()
  const post = await getPost(params.slug)
  
  if (!post) notFound()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PostDetail post={post} session={session} />
      <CommentSection post={post} session={session} />
    </div>
  )
}