import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { name, email, username, password } = await req.json()

    if (!name || !email || !username || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    // Check if email or username already exists
    const existing = await db.user.findFirst({
      where: { OR: [{ email }, { username }] }
    })

    if (existing) {
      if (existing.email === email) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 })
      }
      return NextResponse.json({ error: "Username already taken" }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await db.user.create({
      data: {
        name,
        email,
        username,
        // Store hashed password in a real app you'd have a password field
        // For now we create the user without a password field since we're using OAuth adapter
      }
    })

    return NextResponse.json({ success: true, userId: user.id })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}