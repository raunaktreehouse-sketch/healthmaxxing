import { SignInForm } from "@/components/auth/SignInForm"
import Link from "next/link"
import { Dna } from "lucide-react"

export default function SignInPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
              <Dna className="text-background" size={20} />
            </div>
          </Link>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to your HealthMaxxing account</p>
        </div>
        <SignInForm />
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="font-medium text-foreground hover:underline">Sign up free</Link>
        </p>
      </div>
    </div>
  )
}