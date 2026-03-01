import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session

  const protectedPaths = ['/forum/new', '/settings', '/api/uploadthing']
  const isProtected = protectedPaths.some(path => nextUrl.pathname.startsWith(path))

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${nextUrl.pathname}`, nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)']
}