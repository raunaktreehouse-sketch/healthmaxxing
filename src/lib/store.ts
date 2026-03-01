// In-memory forum store (for Vercel serverless - use DB in production)
export interface ForumPost {
  id: string
  title: string
  content: string
  author: string
  authorId: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
  likes: number
  views: number
  replies: ForumReply[]
  pinned?: boolean
}

export interface ForumReply {
  id: string
  content: string
  author: string
  authorId: string
  createdAt: string
  likes: number
  postId: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  password: string
  role: string
  joinDate: string
  posts: number
  bio?: string
  avatar?: string
}

// Global in-memory stores
declare global {
  var _users: UserProfile[] | undefined
  var _posts: ForumPost[] | undefined
}

export function getUsers(): UserProfile[] {
  if (!global._users) {
    global._users = [
      {
        id: '1',
        name: 'HealthAdmin',
        email: 'admin@healthmaxxing.org',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'admin',
        joinDate: new Date().toISOString(),
        posts: 3,
        bio: 'Administrator of Healthmaxxing.org',
      }
    ]
  }
  return global._users
}

export function getPosts(): ForumPost[] {
  if (!global._posts) {
    global._posts = [
      {
        id: '1',
        title: 'Welcome to Healthmaxxing Forums!',
        content: 'Welcome everyone to the Healthmaxxing community! This is a place for science-backed discussion about health optimization, aesthetics, and human performance. Please read the rules before posting.\n\n**Community Rules:**\n- Be respectful and constructive\n- Cite sources when making claims\n- No pseudoscience or harmful advice\n- Support each other on the journey',
        author: 'HealthAdmin',
        authorId: '1',
        category: 'general',
        tags: ['welcome', 'rules', 'community'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 42,
        views: 1250,
        replies: [],
        pinned: true,
      },
      {
        id: '2',
        title: 'The Evidence on Collagen Supplementation for Skin Health',
        content: 'Multiple RCTs now support collagen peptide supplementation for improving skin elasticity and hydration. A 2023 meta-analysis of 19 studies found significant improvements in skin hydration (standardized mean difference: 0.56) and elasticity (SMD: 0.63) with hydrolyzed collagen supplementation compared to placebo.\n\nKey points:\n- 10-15g daily appears most effective\n- Marine collagen may be slightly more bioavailable\n- Vitamin C enhances collagen synthesis\n- Results typically seen after 8-12 weeks',
        author: 'HealthAdmin',
        authorId: '1',
        category: 'aesthetics',
        tags: ['collagen', 'skincare', 'supplements', 'research'],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        likes: 128,
        views: 3400,
        replies: [],
      },
      {
        id: '3',
        title: 'Optimal Sleep Architecture for Recovery and GH Release',
        content: 'Deep sleep (N3/slow-wave sleep) is when the majority of growth hormone is released - studies show 70-80% of daily GH secretion occurs during sleep. Optimizing sleep architecture is one of the highest-leverage interventions for physical recovery and body composition.\n\n**Strategies:**\n1. Keep consistent sleep/wake times\n2. Keep room temperature 65-68°F (18-20°C)\n3. Block blue light 2-3h before bed\n4. Consider glycine (3g) or magnesium glycinate\n5. Avoid alcohol - it suppresses REM and slow-wave sleep',
        author: 'HealthAdmin',
        authorId: '1',
        category: 'recovery',
        tags: ['sleep', 'recovery', 'growth-hormone', 'optimization'],
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
        likes: 89,
        views: 2100,
        replies: [],
      },
    ]
  }
  return global._posts
}

export function addUser(user: UserProfile) {
  const users = getUsers()
  users.push(user)
}

export function addPost(post: ForumPost) {
  const posts = getPosts()
  posts.push(post)
}

export function addReply(postId: string, reply: ForumReply) {
  const posts = getPosts()
  const post = posts.find(p => p.id === postId)
  if (post) {
    post.replies.push(reply)
    post.updatedAt = new Date().toISOString()
  }
}
