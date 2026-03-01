import Link from "next/link"
import { Hash } from "lucide-react"

interface CategorySidebarProps {
  categories: Array<{
    id: string
    name: string
    slug: string
    description: string | null
    icon: string | null
    color: string | null
    _count: { posts: number }
  }>
}

export function CategorySidebar({ categories }: CategorySidebarProps) {
  const displayCats = categories.length > 0 ? categories : defaultCats
  
  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-24 space-y-4">
        <div className="border border-border rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-3">Topics</h3>
          <ul className="space-y-0.5">
            <li>
              <Link href="/forum" className="flex items-center justify-between px-2 py-1.5 rounded-md text-sm hover:bg-muted transition-colors">
                <span className="flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                  All Topics
                </span>
              </Link>
            </li>
            {displayCats.map((cat) => (
              <li key={cat.id || cat.slug}>
                <Link href={`/forum/${cat.slug}`}
                  className="flex items-center justify-between px-2 py-1.5 rounded-md text-sm hover:bg-muted transition-colors group">
                  <span className="flex items-center gap-2">
                    <span>{cat.icon || '📌'}</span>
                    <span className="group-hover:text-foreground text-muted-foreground transition-colors">{cat.name}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{cat._count?.posts || 0}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-border rounded-xl p-4 bg-foreground text-background">
          <h3 className="font-semibold text-sm mb-2">Join the Community</h3>
          <p className="text-xs opacity-70 mb-3">Share your health optimization journey with thousands of like-minded individuals.</p>
          <Link href="/auth/signup"
            className="block w-full text-center bg-background text-foreground text-xs font-medium py-2 rounded-lg hover:opacity-90 transition-opacity">
            Sign Up Free
          </Link>
        </div>
      </div>
    </aside>
  )
}

const defaultCats = [
  { id: '1', name: 'Skincare', slug: 'skincare', icon: '✨', description: null, color: '#e11d48', _count: { posts: 0 } },
  { id: '2', name: 'Fitness', slug: 'fitness', icon: '💪', description: null, color: '#2563eb', _count: { posts: 0 } },
  { id: '3', name: 'Nutrition', slug: 'nutrition', icon: '🥗', description: null, color: '#16a34a', _count: { posts: 0 } },
  { id: '4', name: 'Sleep', slug: 'sleep', icon: '😴', description: null, color: '#7c3aed', _count: { posts: 0 } },
  { id: '5', name: 'Longevity', slug: 'longevity', icon: '🧬', description: null, color: '#0891b2', _count: { posts: 0 } },
  { id: '6', name: 'Mental', slug: 'mental', icon: '🧠', description: null, color: '#d97706', _count: { posts: 0 } },
  { id: '7', name: 'Supplements', slug: 'supplements', icon: '💊', description: null, color: '#db2777', _count: { posts: 0 } },
  { id: '8', name: 'General', slug: 'general', icon: '💬', description: null, color: '#64748b', _count: { posts: 0 } },
]