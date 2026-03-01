import Link from 'next/link'
import { ArrowRight, Users, MessageSquare, TrendingUp, Shield, Zap, Star } from 'lucide-react'

const stats = [
  { label: 'Community Members', value: '12,400+' },
  { label: 'Daily Discussions', value: '340+' },
  { label: 'Articles Published', value: '2,800+' },
  { label: 'Success Stories', value: '5,000+' },
]

const categories = [
  {
    icon: '💪',
    title: 'Physical Optimization',
    description: 'Maximize your physique through evidence-based training, nutrition, and recovery protocols.',
    threads: 1240,
    href: '/forums/physical',
  },
  {
    icon: '✨',
    title: 'Aesthetics & Skincare',
    description: 'Science-backed skincare, grooming, and appearance enhancement techniques.',
    threads: 890,
    href: '/forums/aesthetics',
  },
  {
    icon: '🧠',
    title: 'Mental Performance',
    description: 'Cognitive enhancement, sleep optimization, and mental health strategies.',
    threads: 670,
    href: '/forums/mental',
  },
  {
    icon: '🍎',
    title: 'Nutrition & Diet',
    description: 'Evidence-based dietary approaches, supplementation, and metabolic health.',
    threads: 1100,
    href: '/forums/nutrition',
  },
  {
    icon: '😴',
    title: 'Recovery & Sleep',
    description: 'Optimize sleep quality, recovery protocols, and hormonal health.',
    threads: 450,
    href: '/forums/recovery',
  },
  {
    icon: '🔬',
    title: 'Research & Science',
    description: 'Deep dives into studies, clinical trials, and emerging research.',
    threads: 320,
    href: '/forums/research',
  },
]

const features = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Evidence-Based',
    description: 'All advice backed by scientific research and peer-reviewed studies.',
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Supportive Community',
    description: 'Connect with thousands of like-minded individuals on their improvement journey.',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Expert Insights',
    description: 'Learn from members who have achieved real, measurable results.',
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: 'Curated Content',
    description: 'High-quality threads and guides vetted by our community moderators.',
  },
]

export default function HomePage() {
  return (
    <div className="bg-mesh">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-sm text-zinc-400 mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Community is live — Join the discussion
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Optimize Every Aspect
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300">
              of Your Biology
            </span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The premier community for science-backed health optimization, aesthetics improvement, 
            and human performance. Evidence-based. No broscience.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/forums"
              className="inline-flex items-center gap-2 bg-amber-100 text-black px-8 py-3.5 rounded-lg font-semibold hover:bg-white transition-colors"
            >
              Explore Forums <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/auth/register"
              className="inline-flex items-center gap-2 glass px-8 py-3.5 rounded-lg font-medium text-zinc-300 hover:text-white transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-zinc-900 py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-amber-200 mb-1">{stat.value}</div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Forum Categories */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Explore Communities</h2>
            <p className="text-zinc-400">Dive into specialized forums for every aspect of self-improvement</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.title}
                href={cat.href}
                className="group glass rounded-xl p-6 hover:border-amber-200/20 transition-all hover:bg-white/5"
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-white mb-2 group-hover:text-amber-200 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-sm text-zinc-500 mb-4 leading-relaxed">{cat.description}</p>
                <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{cat.threads.toLocaleString()} threads</span>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link 
              href="/forums"
              className="inline-flex items-center gap-2 text-amber-200 hover:text-amber-100 font-medium transition-colors"
            >
              View all forums <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Why Healthmaxxing?</h2>
            <p className="text-zinc-400">Built for serious optimizers who demand evidence over anecdote</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="glass rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-amber-200/10 flex items-center justify-center text-amber-200 mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center glass rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Optimizing?</h2>
          <p className="text-zinc-400 mb-8">
            Join thousands of members who are already on their journey to peak performance.
          </p>
          <Link 
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-amber-100 text-black px-8 py-3.5 rounded-lg font-semibold hover:bg-white transition-colors"
          >
            Join the Community <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
