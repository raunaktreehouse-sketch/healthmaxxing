'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Search, User, LogOut } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/60 bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">
              Health<span className="text-amber-200">maxxing</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
            <Link href="/forums" className="hover:text-white transition-colors">Forums</Link>
            <Link href="/articles" className="hover:text-white transition-colors">Articles</Link>
            <Link href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg">
              <Search className="w-4 h-4" />
            </button>
            {session ? (
              <div className="flex items-center gap-3">
                <Link 
                  href="/profile"
                  className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-200/20 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-amber-200" />
                  </div>
                  {session.user?.name || 'Profile'}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link 
                  href="/auth/login"
                  className="text-sm text-zinc-300 hover:text-white transition-colors px-4 py-2"
                >
                  Log in
                </Link>
                <Link 
                  href="/auth/register"
                  className="text-sm bg-amber-100 text-black px-4 py-2 rounded-lg font-medium hover:bg-white transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-black/95 px-4 py-4 space-y-3">
          <Link href="/forums" className="block text-zinc-300 hover:text-white py-2">Forums</Link>
          <Link href="/articles" className="block text-zinc-300 hover:text-white py-2">Articles</Link>
          <Link href="/leaderboard" className="block text-zinc-300 hover:text-white py-2">Leaderboard</Link>
          <Link href="/about" className="block text-zinc-300 hover:text-white py-2">About</Link>
          <div className="pt-3 border-t border-zinc-800 flex gap-3">
            {session ? (
              <>
                <Link href="/profile" className="flex-1 text-center py-2 glass rounded-lg text-sm">Profile</Link>
                <button onClick={() => signOut()} className="flex-1 text-center py-2 glass rounded-lg text-sm text-zinc-400">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="flex-1 text-center py-2 glass rounded-lg text-sm">Log in</Link>
                <Link href="/auth/register" className="flex-1 text-center py-2 bg-amber-100 text-black rounded-lg text-sm font-medium">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
