import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { name, email, subject, message } = await request.json()

  console.log('Contact form submission:', { name, email, subject, message })

  return NextResponse.json({ success: true })
}