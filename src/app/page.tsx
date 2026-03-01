import Link from "next/link"
import { ArrowRight, Dna, FlaskConical, Heart, Users, MessageSquare, TrendingUp, Shield, Zap, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { PostCard } from "@/components/forum/PostCard"
import { CategoryCard } from "@/components/forum/CategoryCard"

async function getHomeData() {
  try {
    const [recentPosts, categories, stats] = await Promise.all([
      db.post.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true, image: true, username: true } },
          category: true,
          _count: { select: { comments: true, votes: true } },
        },
      }),
      db.category.findMany({
        include: { _count: { select: { posts: true } } },
        take: 8,
      }),
      Promise.all([
        db.user.count(),
        db.post.count(),
        db.comment.count(),
      ])
    ])
    return { recentPosts, categories, stats: { users: stats[0], posts: stats[1], comments: stats[2] } }
  } catch {
    return {
      recentPosts: [],
      categories: [],
      stats: { users: 0, posts: 0, comments: 0 }
    }
  }
}

export default async function HomePage() {
  const { recentPosts, categories, stats } = await getHomeData()

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-background border-b border-border">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm text-muted-foreground mb-6 border border-border">
              <Zap className="w-3.5 h-3.5" />
              Science-backed optimization
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Optimize Every
              <br />
              <span className="relative">
                Aspect of Health
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/10 rounded" />
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              Join a community of evidence-based health optimizers. Discuss skincare, fitness, nutrition, 
              longevity, and everything in between — backed by science, not bro-science.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/forum">
                  Explore Forum
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link href="/auth/signin">Join Community</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-border">
              {[
                { value: stats.users.toLocaleString() || "1.2K+", label: "Members" },
                { value: stats.posts.toLocaleString() || "8.4K+", label: "Discussions" },
                { value: stats.comments.toLocaleString() || "42K+", label: "Replies" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Browse Topics</h2>
              <p className="text-muted-foreground mt-1">Find your niche in health optimization</p>
            </div>
            <Button asChild variant="ghost" className="text-sm">
              <Link href="/forum">View all <ArrowRight className="ml-1 w-3.5 h-3.5" /></Link>
            </Button>
          </div>
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {defaultCategories.map((cat) => (
                <Link key={cat.slug} href={`/forum/${cat.slug}`}
                  className="group p-4 rounded-xl border border-border hover:border-foreground/20 hover:bg-muted/50 transition-all">
                  <div className="text-2xl mb-2">{cat.icon}</div>
                  <div className="font-medium text-sm">{cat.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{cat.desc}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Recent Discussions</h2>
              <p className="text-muted-foreground mt-1">See what the community is talking about</p>
            </div>
            <Button asChild variant="ghost" className="text-sm">
              <Link href="/forum">All posts <ArrowRight className="ml-1 w-3.5 h-3.5" /></Link>
            </Button>
          </div>
          {recentPosts.length > 0 ? (
            <div className="grid gap-4">
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">No discussions yet</p>
              <p className="text-sm mt-1">Be the first to start a conversation</p>
              <Button asChild className="mt-4">
                <Link href="/forum/new">Start a Discussion</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Why HealthMaxxing?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-foreground text-background flex items-center justify-center">
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const defaultCategories = [
  { name: "Skincare & Appearance", slug: "skincare", icon: "✨", desc: "Evidence-based skincare" },
  { name: "Fitness & Training", slug: "fitness", icon: "💪", desc: "Optimize your physique" },
  { name: "Nutrition & Diet", slug: "nutrition", icon: "🥗", desc: "Dietary optimization" },
  { name: "Sleep & Recovery", slug: "sleep", icon: "😴", desc: "Sleep science" },
  { name: "Longevity", slug: "longevity", icon: "🧬", desc: "Live longer, better" },
  { name: "Mental Performance", slug: "mental", icon: "🧠", desc: "Cognitive enhancement" },
  { name: "Supplements", slug: "supplements", icon: "💊", desc: "Evidence-based supps" },
  { name: "General Discussion", slug: "general", icon: "💬", desc: "Everything health" },
]

const features = [
  { icon: FlaskConical, title: "Evidence-Based", desc: "Every claim is backed by peer-reviewed research. No pseudoscience, no gimmicks — just rigorous health optimization." },
  { icon: Users, title: "Expert Community", desc: "Connect with doctors, researchers, athletes, and dedicated health optimizers who share their knowledge freely." },
  { icon: Shield, title: "Quality Moderation", desc: "Dedicated moderators ensure all content meets our scientific standards and community guidelines." },
  { icon: MessageSquare, title: "Rich Discussions", desc: "Share images, cite studies, and have in-depth conversations about every aspect of health optimization." },
  { icon: TrendingUp, title: "Track Progress", desc: "Share your journey, document your progress, and get feedback from the community." },
  { icon: Brain, title: "Comprehensive Topics", desc: "From skincare and fitness to longevity and mental performance — we cover it all." },
]