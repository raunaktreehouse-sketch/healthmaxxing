import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { getUsers, addUser } from '@/lib/store'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }
    
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }
    
    const users = getUsers()
    const existing = users.find(u => u.email === email)
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }
    
    const hashedPassword = await hash(password, 10)
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role: 'user',
      joinDate: new Date().toISOString(),
      posts: 0,
      bio: '',
    }
    
    addUser(newUser)
    
    return NextResponse.json({ 
      message: 'Account created successfully',
      userId: newUser.id 
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
