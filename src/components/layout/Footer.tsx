import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="font-bold text-sm">HealthMaxxing</Link>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="/forum" className="hover:text-foreground">Forum</Link>
            <Link href="/auth/signup" className="hover:text-foreground">Join</Link>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">&#169; {new Date().getFullYear()} HealthMaxxing. Science-backed health optimization.</p>
      </div>
    </footer>
  )
}