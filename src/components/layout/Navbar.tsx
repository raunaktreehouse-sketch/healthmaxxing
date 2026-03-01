"use client"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, Search, Bell, Plus, Dna } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/forum", label: "Forum" },
  { href: "/forum/skincare", label: "Skincare" },
  { href: "/forum/fitness", label: "Fitness" },
  { href: "/forum/nutrition", label: "Nutrition" },
  { href: "/forum/longevity", label: "Longevity" },
]

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
            <Dna className="w-4.5 h-4.5 text-background" size={18} />
          </div>
          <span className="font-bold text-[15px] tracking-tight hidden sm:block">HealthMaxxing</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-foreground bg-muted"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          {/* Search */}
          <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
            <Link href="/search"><Search className="w-4 h-4" /></Link>
          </Button>

          {session ? (
            <>
              {/* New Post */}
              <Button asChild size="sm" className="hidden sm:flex rounded-full">
                <Link href="/forum/new">
                  <Plus className="w-3.5 h-3.5 mr-1" /> New Post
                </Link>
              </Button>
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full ring-2 ring-transparent hover:ring-border transition-all">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={session.user?.image ?? ""} alt={session.user?.name ?? ""} />
                      <AvatarFallback className="text-xs">
                        {session.user?.name?.slice(0, 2).toUpperCase() ?? "HM"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{session.user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${(session.user as any)?.username || session.user?.id}`}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full">
                <Link href="/auth/signup">Join Free</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <button className="lg:hidden p-1.5" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-3 py-2 rounded-md text-sm",
                pathname === link.href ? "bg-muted font-medium" : "text-muted-foreground"
              )}>
              {link.label}
            </Link>
          ))}
          {session && (
            <Link href="/forum/new" onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium bg-foreground text-background text-center mt-2">
              + New Post
            </Link>
          )}
        </div>
      )}
    </header>
  )
}