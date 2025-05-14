import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is not signed in and the current path is not / or /login or /signup,
  // redirect the user to /login
  if (!session && !["/login", "/signup", "/"].includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // If user is signed in and the current path is /login or /signup,
  // redirect the user to /dashboard
  if (session && ["/login", "/signup"].includes(req.nextUrl.pathname)) {
    // Get user profile to determine role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (profile?.role) {
      return NextResponse.redirect(new URL(`/dashboard/${profile.role}`, req.url))
    }

    // Default to student dashboard if role is not found
    return NextResponse.redirect(new URL("/dashboard/student", req.url))
  }

  return res
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
}
